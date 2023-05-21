import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const User = require("../../models/auth/userModel");
const generateToken = require("../../utils/generateToken");

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
  const { username, email, password } = req.body;

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

  const user = await User.create({ username, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      roleId: user.roleId,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Dữ liệu người dùng không hợp lệ");
  }
});

export { registerUser, loginUser };
