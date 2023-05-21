import { Request, Response } from "express";

const asyncHandler = require("express-async-handler");

const User = require("../../models/auth/userModel");
const Relationship = require("../../models/data/relationshipModel");
const Podcast = require("../../models/data/podcastModel");
const StatusPost = require("../../models/data/statusPost");

const userFollow = asyncHandler(async (req: Request, res: Response) => {
  const currentId = req.body.myId;
  const otherId = req.body.otherUserId;

  try {
    // following
    await User.updateOne(
      { _id: currentId },
      {
        $addToSet: {
          following: otherId,
        },
      }
    );
    await Relationship.updateOne(
      {
        currentUser: currentId,
        user: otherId,
      },
      {
        $set: {
          following: true,
        },
      }
    );

    // followed
    await User.updateOne(
      { _id: otherId },
      {
        $addToSet: {
          followers: currentId,
        },
      }
    );

    await Relationship.updateOne(
      {
        currentUser: otherId,
        user: currentId,
      },
      {
        $set: {
          followed_by: true,
        },
      }
    );

    res.json({
      message: "Follow successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const userUnFollow = asyncHandler(async (req: Request, res: Response) => {
  const currentId = req.body.myId;
  const otherId = req.body.otherUserId;

  try {
    // following
    await User.updateOne(
      { _id: currentId },
      {
        $pull: {
          following: otherId,
        },
      }
    );
    await Relationship.updateOne(
      {
        currentUser: currentId,
        user: otherId,
      },
      {
        $set: {
          following: false,
        },
      }
    );
    // followers
    await User.updateOne(
      { _id: otherId },
      {
        $pull: {
          followers: currentId,
        },
      }
    );
    await Relationship.updateOne(
      {
        currentUser: otherId,
        user: currentId,
      },
      {
        $set: {
          followed_by: false,
        },
      }
    );

    res.json({
      message: "Unfollow successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const getRelationship = asyncHandler(async (req: Request, res: Response) => {
  const currentId = req.query.myId;
  const otherId = req.query.otherUserId;

  const user = await Relationship.findOne({
    currentUser: currentId,
    user: otherId,
  });

  if (user) {
    res.json({
      status: user.following,
    });
  } else {
    res.status(500).json("Cant find user");
  }
});

const likePost = asyncHandler(async (req: Request, res: Response) => {
  const likeId = req.body.likeId;
  const idPost = req.body.idPost;

  try {
    const podcast = await Podcast.findOne({ _id: idPost });
    const UserLikePodcast = await StatusPost.findOne({
      userLikePost: likeId,
      post: idPost,
    });

    if (!podcast) {
      return res.status(404).json({ message: "Không tìm thấy Podcast" });
    }

    if (!likeId) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người thích bài viết" });
    }

    if (!UserLikePodcast) {
      await StatusPost.create({
        userLikePost: likeId,
        post: idPost,
        isLike: true,
      });
    }
    // add id of people like post to db
    await Podcast.updateOne(
      { _id: idPost },
      {
        $addToSet: {
          likes: likeId,
        },
      }
    );
    await StatusPost.updateOne(
      {
        userLikePost: likeId,
        post: idPost,
      },
      {
        $set: {
          isLike: true,
        },
      }
    );

    res.status(200).json({ message: "Thích bài viết thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const unLikePost = asyncHandler(async (req: Request, res: Response) => {
  const likeId = req.body.likeId;
  const idPost = req.body.idPost;

  try {
    const podcast = await Podcast.findOne({ _id: idPost });

    if (!podcast) {
      return res.status(404).json({ message: "Không tìm thấy Podcast" });
    }

    if (!likeId) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người thích bài viết" });
    }
    // remove id of people like post to db

    await Podcast.updateOne(
      { _id: idPost },
      {
        $pull: {
          likes: likeId,
        },
      }
    );
    await StatusPost.updateOne(
      {
        userLikePost: likeId,
        post: idPost,
      },
      {
        $set: {
          isLike: false,
        },
      }
    );

    res.status(200).json({ message: "Bỏ Thích bài viết thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getStatusLikePost = asyncHandler(async (req: Request, res: Response) => {
  const likeId = req.query.likeId;
  const postOwner = req.query.postOwner;

  const statusPost = await StatusPost.findOne({
    userLikePost: likeId,
    post: postOwner,
  });
  try {
    if (!statusPost) {
      return res.json(false);
    }

    res.json({
      isLike: statusPost.isLike,
      postOwner: statusPost.post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const commentPost = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const uploadDate = now.toISOString();
  const podcast = await Podcast.findById(req.body.postId);
  try {
    if (!podcast) {
      return res.status(404).json({ message: "Bài podcast không tồn tại" });
    }

    const comment = {
      user: req.body.userId,
      text: req.body.text,
      date: new Date(),
    };

    podcast.comments.push(comment);
    await podcast.save();

    res.status(200).json({
      message: "comment succesful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getCommentPost = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.query.postId;
  try {
    const podcast = await Podcast.findOne(
      { _id: postId },
      {
        comments: 1,
      }
    ).populate("comments.user");

    res.status(200).json({
      userComments: podcast.comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const getTotalLikeCount = asyncHandler(async (req: Request, res: Response) => {
  const idPost = req.query.idPost;

  try {
    const podcastData = await Podcast.findOne({
      _id: idPost,
    });

    if (podcastData) {
      res.status(200).json({
        likes: podcastData.likes,
      });
    } else {
      res.status(404).json("Cant find Podcast");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export {
  userFollow,
  userUnFollow,
  getRelationship,
  likePost,
  unLikePost,
  getStatusLikePost,
  commentPost,
  getCommentPost,
  getTotalLikeCount,
};
