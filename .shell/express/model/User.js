var mongoose = require('mongoose');
var Schema = mongoose.Schema

const User = new Schema({
	name: String,
	email: String,
	password: String,
	createdAt: { type: Date, default: Date.now }
})

var models = mongoose.model('User', User)

module.exports = models