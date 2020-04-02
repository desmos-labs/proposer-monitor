import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Blocks } from '../blocks';
import { Validators } from '../../validators/validators';

Meteor.methods({
    'blocks.blocksUpdate': function() {
        if (SYNCING)
            return "Syncing...";
        else console.log("start to sync");
        
        let lastBlock = Blocks.findOne({},{sort:{height:-1}});
        let lastHeight = 1;
        let latestHeight = 0;

        if (lastBlock && lastBlock.height){
            lastHeight = lastBlock.height
        }

        try {
            let url = RPC+"/status"
            let response = HTTP.get(url);
            latestHeight = JSON.parse(response.content);
            latestHeight = parseInt(latestHeight.result.sync_info.latest_block_height);
            console.log(latestHeight);
            
            if (latestHeight > lastHeight){
                SYNCING = true;
                Meteor.clearInterval(timerBlocks);

                let height = lastHeight;

                for (let h=height; h <= latestHeight; h++){
                    let url = RPC+"/block?height="+h;
                    try{
                        let response = HTTP.get(url);
                        let block = JSON.parse(response.content);
                        block = block.result;
                        block.height = parseInt(block.block.header.height);
                        Blocks.insert(block, (error, id)=>{
                            if (error){
                                // console.log(error);
                                console.log("error");
                                SYNCING = false
                                return latestHeight;
                            }
                            else{
                                console.log(block.height);
                                Validators.update({address:block.block.header.proposer_address}, {$inc:{proposer_count:1}})    
                            }
                        });
                    }
                    catch (e){
                        SYNCING = false
                        return latestHeight;
                    }
                }
                SYNCING = false
            }
        }
        catch(e){
            console.log(e)
            SYNCING = false
            return latestHeight;
        }

        return latestHeight;
    }
})