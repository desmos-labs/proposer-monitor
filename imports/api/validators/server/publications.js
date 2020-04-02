import { Meteor } from 'meteor/meteor';
import { Validators } from '../validators.js';

Meteor.publish('validators', function(){
    return Validators.find({},{
        sort:{
            power:-1
        }
    });
});