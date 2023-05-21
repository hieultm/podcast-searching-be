import mongoose from "mongoose";

const OtherUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  isFollowing: {
    type: Boolean,
    required: true,
    default: "False",
  },
});

module.exports = mongoose.model("OtherUser", OtherUserSchema);
