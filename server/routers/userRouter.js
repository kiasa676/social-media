const UserController = require("../controller/userController");
const requireUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post(
  "/follow",
  requireUser,
  UserController.followOrUnfollowUserController
);

router.get("/getFeedData", requireUser, UserController.getPostOfFollowing);

router.get("/getMyPosts", requireUser, UserController.getMyPosts);
router.post("/getUserPosts", requireUser, UserController.GetuserPosts);
router.delete("/", requireUser, UserController.deleteMyUser);
router.get("/getMyInfo", requireUser, UserController.getMyInfo);
router.put("/", requireUser, UserController.updateUserProfile);
router.post("/getUserProfile", requireUser, UserController.getUserProfile);
module.exports = router;
