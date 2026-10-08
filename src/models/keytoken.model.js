'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Keys'
const DOCUMENT_NAME = 'Key'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    publicKey:{
        type:String,
        required:true,
    },
    refeshToken:{
        type:Array,
        default:[]
    },
}, {
    collection: COLLECTION_NAME, 
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);