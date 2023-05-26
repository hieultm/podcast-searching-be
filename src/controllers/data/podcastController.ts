import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");

const Podcast = require("../../models/data/podcastModel");
const PodcastUser = require("../../models/data/podcastUserModel");
const User = require("../../models/auth/userModel");

interface dataPodcast {
  user: string;
  audio: string;
  uploadDate: Date;
  caption: string;
}

const getAllPodcastByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const dataPodcast = await Podcast.find({
        user: req.params.id,
      }).populate("user");

      res.status(200).json({ dataPodcast });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const getPodcastFollowingUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const dataUser = await User.find(
        {
          _id: req.params.id,
        },
        {
          _id: 0,
          following: 1,
        }
      );
      let listData: dataPodcast[] = [];
      const promises = dataUser[0].following.map(async (item: any) => {
        const regex = 'new ObjectId(" ")';
        const id = item.toString().replace(regex, "").trim();

        const data = await Podcast.find({
          user: id,
        }).populate("user");

        return data;
      });

      listData = [].concat(...(await Promise.all(promises)));

      res.status(200).json(listData);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const getDetailPodcast = asyncHandler(async (req: Request, res: Response) => {
  try {
    const dataPodcast = await Podcast.findById(req.params.id).populate("user");

    res.status(200).json({
      _id: dataPodcast._id,
      audio: dataPodcast.audio,
      background: dataPodcast.background,
      caption: dataPodcast.caption,
      user: dataPodcast.user,
      uploadDate: dataPodcast.uploadDate,
      content: dataPodcast.content,
      likes: dataPodcast.likes,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

const getRecommendPodcasts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const podcastData = await Podcast.aggregate([
        {
          $project: {
            user: 1,
            audio: 1,
            uploadDate: 1,
            background: 1,
            caption: 1,
            content: 1,
            likes: { $size: "$likes" },
            comments: 1,
          },
        },
        { $sort: { likes: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.username": 1,
            audio: 1,
            uploadDate: 1,
            background: 1,
            caption: 1,
            content: 1,
            likes: 1,
            comments: 1,
          },
        },
      ]);

      res.status(200).json({
        podcastData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const searchContentPodcast = asyncHandler(
  async (req: Request, res: Response) => {
    let searchKeyword = req.query.content;

    try {
      let regex: RegExp;

      if (typeof searchKeyword === "string") {
        searchKeyword = decodeURIComponent(searchKeyword);
        regex = new RegExp(searchKeyword, "i");
      } else {
        const keywordString = JSON.stringify(searchKeyword);
        regex = new RegExp(decodeURIComponent(keywordString), "i");
      }

      const podcastData = await Podcast.find({
        content: regex,
      }).populate("user");

      if (!podcastData) {
        return res.status(404).json({ message: "The podcast does not exist." });
      }

      res.status(200).json({
        podcastData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deletePodcastById = asyncHandler(async (req: Request, res: Response) => {
  const idPodcast = req.query.idPodcast;
  const idUser = req.query.idUser;

  try {
    const dataPodcast = await Podcast.findByIdAndDelete({
      _id: idPodcast,
    });

    if (dataPodcast) {
      await dataPodcast.remove();

      await PodcastUser.updateOne(
        { user: idUser },
        {
          $pull: {
            podcasts: idPodcast,
          },
        }
      );

      res.json({ message: "Delete podcast successfully" });
    } else {
      res.status(500).json("Can't find Podcast to delete");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export {
  getAllPodcastByUserId,
  getPodcastFollowingUser,
  getDetailPodcast,
  searchContentPodcast,
  deletePodcastById,
  getRecommendPodcasts,
};
