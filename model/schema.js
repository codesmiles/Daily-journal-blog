const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const newsLetterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const NewsLetter = mongoose.model("NewsLetter", newsLetterSchema);
module.exports = NewsLetter;
