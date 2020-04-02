import { Meteor } from 'meteor/meteor';
import { Blocks } from '../blocks.js';

Meteor.publish('blocks.latest', function(){
    return Blocks.find({},{
        sort:{
            height:-1
        },
        limit:1
    });
});