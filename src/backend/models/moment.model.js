const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User = require('./user.model');

const momentSchema = new Schema({
  ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  textDescription: {type: String, required: true, trim: true},
  date: {type: Date, required: true},
}, {
  timestamps: true, // Adds field for when created/modified
});

const Moment = mongoose.model('Moment', momentSchema);

module.exports = Moment;
