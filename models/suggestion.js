const { Schema, model } = require("mongoose");

module.exports = model(
  "suggestion",
  new Schema({
    token: String,
    msg_id: String,
    suggestion: String,
    author: String,
  })
);
