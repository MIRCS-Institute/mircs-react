const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterDataSetSchema = new Schema({
    name: String,
    description: String,
    datasets: String, // populate this with the others
    updatedAt: { type: Date, default: Date.now }
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now }
});

const MasterDataSet = module.exports = mongoose.model('MasterDataSet', masterDataSetSchema);