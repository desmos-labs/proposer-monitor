import { Blocks } from '/imports/api/blocks/blocks'
import { Validators } from '/imports/api/validators/validators'

Blocks.rawCollection().createIndex({height: -1},{unique:true});
Validators.rawCollection().createIndex({address: -1},{unique:true});