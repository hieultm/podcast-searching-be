import mongoose from "mongoose";
const Schema = mongoose.Schema;

const podcastUserSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  podcasts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "Podcast",
    },
  ],
});

module.exports = mongoose.model("PodcastUser", podcastUserSchema);
