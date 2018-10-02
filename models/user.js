const mongoose = require('mongoose');
const shortId = require('shortid');
const Schema = mongoose.Schema;

const logSchema = new Schema();

const userSchema = new Schema({
  _id : { type: String, default: shortId.generate },
  username: { type: String, required: true },
  logs: { type: [{
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      date: { type: Date }
    }], default: [] }
});

module.exports = mongoose.model('User', userSchema);