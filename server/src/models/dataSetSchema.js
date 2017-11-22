const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSetSchema = new Schema({
    name: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    fields : [{
        name: String,
        // required:
        // type: 
        // references:
    }],
    // _collectionName: String,
    // version: String,
    // updatedAt: { type: Date, default: Date.now },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now }
});

const DataSet = module.exports = mongoose.model('DataSet', dataSetSchema);