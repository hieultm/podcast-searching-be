import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const podcastSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    audio: { type: String, require: true },
    uploadDate: { type: Date, default: Date.now },
    background: {
      type: String,
      default:
        "https://res.cloudinary.com/dzmx7t0az/image/upload/v1684421973/backgroundPodcastDefaul_zqfl2s.jpg",
    },
    caption: { type: String },
    content: { type: String, default: "" },
    likes: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast", podcastSchema);
