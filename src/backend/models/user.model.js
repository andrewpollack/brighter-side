const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Moment = require('./moment.model');

const userSchema = new Schema({
  username: {type: String, required: true, unique: true, trim: true,
    minlength: 3},
  password: {type: String, required: true, trim: true, minlength: 6},
  email: {type: String, required: true, unique: true, trim: true},
  firstname: {type: String, required: true, trim: true},
  moments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Moment'}],
}, {
  timestamps: true, // Adds field for when created/modified
});

const User = mongoose.model('User', userSchema);

module.exports = User;
