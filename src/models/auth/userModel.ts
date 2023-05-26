import mongoose from "mongoose";
const bcrypt = require("bcryptjs");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    googleID: { type: String },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/564x/ac/29/ae/ac29aedf348f1409f49d53013f72c276.jpg",
    },
    addressDefault: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Role",
      default: "61cbc5391efe64b6e77f4661",
    },
    role: {
      type: String,
      default: "ROLE_MEMBER",
      enum: ["ROLE_MEMBER", "ROLE_ADMIN"],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],
    bio: {
      type: String,
    },
    secretQuestion: {
      type: String,
      required: true,
    },
    secretAnswer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword: any) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
