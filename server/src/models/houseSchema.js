const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const houseSchema = new Schema({
  address:  String,
  city: String,
  province: String
  // date: { type: Date, default: Date.now },
});

const House = module.exports = mongoose.model('House', houseSchema);