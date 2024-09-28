const postController = require("../controller/postController");
const requiredUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post("/", requiredUser, postController.creatPostController);
router.post("/like", requiredUser, postController.likeAndUnlikePost);
router.put("/", requiredUser, postController.updatePostController);
router.delete("/", requiredUser, postController.deletePostController);
router.post("/comment", requiredUser, postController.commentController);
router.post("/reply", requiredUser, postController.replyCommentController);
router.post("/editcomment", requiredUser, postController.EditCommentController);
router.post(
  "/deletecomment",
  requiredUser,
  postController.deleteCommentController
);

module.exports = router;
