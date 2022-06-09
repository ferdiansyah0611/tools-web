var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Token = new Schema({
  user_id: {
    type: Schema.ObjectId,
    ref: "User",
  },
  token: String,
  expiredAt: Number,
});

var models = mongoose.models.Token || mongoose.model("Token", Token);

module.exports = models;
