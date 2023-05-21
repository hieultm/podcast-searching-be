import {
  getRelationship,
  userFollow,
  userUnFollow,
  likePost,
  unLikePost,
  getStatusLikePost,
  commentPost,
  getCommentPost,
  getTotalLikeCount,
} from "../../controllers/data/postController";
const router = require("express").Router();

router.route("/follow_user").post(userFollow);

router.route("/unfollow_user").post(userUnFollow);
router.route("/relationship").get(getRelationship);
router.route("/like_post").post(likePost);
router.route("/unlike_post").post(unLikePost);
router.route("/status_like_post").get(getStatusLikePost);
router.route("/comment_post").post(commentPost).get(getCommentPost);
router.route("/post_total_count").get(getTotalLikeCount);

module.exports = router;
