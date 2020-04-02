import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import '/imports/startup/server/create-index';
import '/imports/api/blocks/server/methods';
import '/imports/api/blocks/server/publications';

import '/imports/api/validators/server/methods';
import '/imports/api/validators/server/publications';

import { Validators } from '/imports/api/validators/validators'

RPC = "http://18.163.129.161:26657/"
SYNCING = false;
timerBlocks = 0;

updateBlock = () => {
		Meteor.call('blocks.blocksUpdate', (error, result) => {
				if (error){
						console.log("updateBlocks: "+error);
				}
				else{
						console.log("updateBlocks: "+result);
				}

				// set timer again only when the function returned
				timerBlocks = Meteor.setInterval(function(){
					updateBlock();
				}, 1000);
		})
}

Meteor.startup(() => {
		let url = RPC+"/genesis";

		try{
				let response = HTTP.get(url)
				let validators = JSON.parse(response.content);
				validators = validators.result.genesis.validators;
				// console.log(validators);
				for (let i in validators) {
					validators[i].power = parseInt(validators[i].power)
					Validators.upsert({address:validators[i].address}, {$set:validators[i]})
				}
		}
		catch (e) {
			console.log(e)
		}

		timerBlocks = Meteor.setInterval(function(){
		  updateBlock();
		}, 1000);
});
