import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const generateToken = require("../../utils/generateToken");
const User = require("../../models/auth/userModel");
const Relationship = require("../../models/data/relationshipModel");
import { ParsedUrlQuery } from "querystring";

interface IUserReq extends Request {
  user?: any;
}

const getUserProfile = asyncHandler(async (req: IUserReq, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(404);
    throw new Error("Cant find user");
  }
});

const updateProfile = asyncHandler(async (req: IUserReq, res: Response) => {
  const user = await User.findById(req.params.id);

  try {
    if (user) {
      user.username = req.body.username || user.username;
      user.avatar = req?.file?.path || user.avatar;
      // if (req.body.password) {
      //   user.password = req.body.password;
      // }

      const updateUser = await user.save();

      res.json({
        username: updateUser.username,
        avatar: updateUser.avatar,
        token: generateToken(updateUser._id),
        role: updateUser.role,
        roleId: updateUser.roleId,
        _id: updateUser._id,
      });
    }
  } catch (error) {
    res.status(404).json({ message: "Error uploading file", error: error });
  }
});

const searchUserByUsername = asyncHandler(
  async (req: Request, res: Response) => {
    const searchKeyword = req.query.username;

    try {
      let regex: RegExp;

      if (typeof searchKeyword === "string") {
        regex = new RegExp(searchKeyword, "i");
      } else {
        const keywordString = JSON.stringify(searchKeyword); // convert to string using JSON.stringify()
        regex = new RegExp(keywordString, "i");
      }

      const user = await User.find({
        username: regex,
      }).select("-password");

      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  }
);

const getOtherUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const currentId = req.query.myId;
    const otherUserId = req.query.otherUserId;

    const userExits = await Relationship.findOne({
      currentUser: currentId,
      user: otherUserId,
    });

    try {
      if (!userExits) {
        // change following to true
        await Relationship.create({
          currentUser: currentId,
          user: otherUserId,
        });

        // change follower to true

        await Relationship.create({
          currentUser: otherUserId,
          user: currentId,
        });
      }
      const infoUser = await Relationship.find({
        user: otherUserId,
      }).populate("user", "-password");
      res.json({
        infoUser,
      });
    } catch (error) {
      res.status(404).json({ message: "Cant find user", error: error });
    }
  }
);

export {
  getUserProfile,
  updateProfile,
  searchUserByUsername,
  getOtherUserProfile,
};
