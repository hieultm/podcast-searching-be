import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const User = require("../../models/auth/userModel");
const generateToken = require("../../utils/generateToken");

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      addressDefault: user.addressDefault,
      roleId: user.roleId,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Wrong account or password");
  }
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, secretQuestion, secretAnswer } = req.body;

  const emailExits = await User.findOne({ email });

  const usernameExits = await User.findOne({ username });

  if (emailExits) {
    res.status(400);
    throw new Error("Account already exists");
  }

  if (usernameExits) {
    res.status(400);
    throw new Error("Account already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    secretQuestion,
    secretAnswer,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      roleId: user.roleId,
      role: user.role,
      token: generateToken(user._id),
      secretQuestion: user.secretQuestion,
      secretKey: user.secretAnswer,
    });
  } else {
    res.status(401);
    throw new Error("Invalid user data");
  }
});

const getConfirmationUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, secretQuestion, secretAnswer } = req.query;

    const user = await User.findOne({ email });
    try {
      if (!user) {
        res.status(404).json({ message: "Can't find account!" });
      }

      if (
        secretQuestion === user.secretQuestion &&
        secretAnswer === user.secretAnswer
      ) {
        res.status(200).json({
          message: "Verified information!",
          idUser: user._id,
        });
      } else {
        res.status(404).json({ message: "Incorrect information!" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const changePasswordUser = asyncHandler(async (req: Request, res: Response) => {
  const { idUser, newPassword } = req.body;

  const user = await User.findOne({ _id: idUser });
  try {
    if (!user) {
      res.status(404).json({ message: "Can't find account!" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    if (newPasswordHash) {
      await User.updateOne(
        {
          _id: idUser,
        },
        {
          $set: {
            password: newPasswordHash,
          },
        }
      );

      res.status(200).json({
        message: "Change password successful!",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export { registerUser, loginUser, getConfirmationUser, changePasswordUser };
