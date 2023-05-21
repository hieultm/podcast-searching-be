import {
  getAllPodcastByUserId,
  getPodcastFollowingUser,
  getDetailPodcast,
  searchContentPodcast,
  deletePodcastById,
} from "../../controllers/data/podcastController";
const router = require("express").Router();

// get All podcast by user id
router.route("/user/:id").get(getAllPodcastByUserId);

router.route("/new_feed/:id").get(getPodcastFollowingUser);
router.route("/podcast/:id").get(getDetailPodcast).delete(deletePodcastById);
router.route("/search_podcast").get(searchContentPodcast);

module.exports = router;
