const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  name:  String,
  date_of_birth: String,
  gender: String,
  address: String
  // date: { type: Date, default: Date.now },
});

const Person = module.exports = mongoose.model('Person', personSchema);