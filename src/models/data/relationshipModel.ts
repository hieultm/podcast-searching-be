import mongoose from "mongoose";
const Schema = mongoose.Schema;

const relationshipSchema = new Schema({
  currentUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  following: { type: Boolean, default: false },
  followed_by: { type: Boolean, default: false },
});

module.exports = mongoose.model("Relationship", relationshipSchema);
