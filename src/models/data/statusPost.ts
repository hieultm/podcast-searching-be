import mongoose from "mongoose";
const Schema = mongoose.Schema;

const statusPostSchema = new Schema({
  userLikePost: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Podcast",
  },
  isLike: { type: Boolean, default: false },
});

module.exports = mongoose.model("StatusPost", statusPostSchema);
