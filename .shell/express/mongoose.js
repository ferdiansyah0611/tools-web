var mongoose = require('mongoose');
var Schema = mongoose.Schema

const caseName = new Schema({
	createdAt: { type: Date, default: Date.now }
})

var models = mongoose.models.caseName || mongoose.model('caseName', caseName)

module.exports = models