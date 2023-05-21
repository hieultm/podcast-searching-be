import mongoose from "mongoose";
const Schema = mongoose.Schema;

const audioSchema = new Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimeptype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
});

module.exports = mongoose.model("Audio", audioSchema);
