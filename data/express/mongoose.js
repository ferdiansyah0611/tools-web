var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const $name = new Schema({
  createdAt: { type: Date, default: Date.now },
});

var $models = mongoose.models.$name || mongoose.model("$name", $name);

module.exports = $models;
