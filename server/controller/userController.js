const { mapPostOutput } = require("../Utils/Utils");
const { error, success } = require("../Utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const followOrUnfollowUserController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const curUserId = req._id;

    const userToFollow = await User.findById(userIdToFollow);
    const curUser = await User.findById(curUserId);

    if (userIdToFollow === curUserId) {
      return res.send(error(409, "users cannot follow themselves"));
    }

    if (!userToFollow) {
      return res.send(error(404, "user to follow not found"));
    }

    if (curUser.following.includes(userIdToFollow)) {
      //already followed
      const followingIndex = curUser.following.indexOf(userIdToFollow);
      curUser.following.splice(followingIndex, 1);

      const followerIndex = userToFollow.follower.indexOf(curUserId);
      userToFollow.follower.splice(followerIndex, 1);
    } else {
      curUser.following.push(userIdToFollow);
      userToFollow.follower.push(curUserId);
    }
    await userToFollow.save();
    await curUser.save();

    return res.send(success(200, { user: userToFollow }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostOfFollowing = async (req, res) => {
  try {
    const curUserId = req._id;
    const curUser = await User.findById(curUserId).populate("following");

    if (!curUser) {
      return res.send(error(404, "user not found"));
    }

    const followingsId = curUser.following.map((item) => {
      return item._id;
    });

    const fullPosts = await Post.find({
      owner: {
        $in: followingsId,
      },
    })
      .populate("owner")
      .populate({
        path: "commentsId",
        populate: {
          path: "reply",
          populate: [{ path: "repliedTo" }, { path: "repliedBy" }],
        },
      });

    const posts = fullPosts
      .map((post) => {
        return mapPostOutput(post, req._id);
      })
      .reverse();
    console.log(curUser.posts);
    followingsId.push(req._id);

    const suggestion = await User.find({
      _id: {
        $nin: followingsId,
      },
    });

    return res.send(success(200, { ...curUser._doc, suggestion, posts }));
    // return res.send(success(200, { fullPosts }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getMyPosts = async (req, res) => {
  try {
    const curUserId = req._id;

    const curUser = await User.findById(curUserId);

    const allUserposts = await Post.find({
      owner: curUserId,
    }).populate("likes");

    if (allUserposts.toString() === "") {
      return res.send(error(404, "post not found"));
    }
    return res.send(success(200, { allUserposts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const GetuserPosts = async (req, res) => {
  try {
    const { reqUserId } = req.body;

    if (!reqUserId) {
      return res.send(error(400, "user id is required"));
    }

    const reqUser = await User.findById(reqUserId);

    if (!reqUser) {
      return res.send(error(404, "user not found"));
    }

    const post = await Post.find({
      owner: reqUser._id,
    }).populate("likes");

    if (post.toString() === "") {
      return res.send(error(404, "post not found"));
    }
    return res.send(success(200, post));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteMyUser = async (req, res) => {
  try {
    const curUserId = req._id;

    // delete all post of curUser
    const curUser = await User.findById(curUserId);
    await Post.deleteMany({
      owner: curUser._id,
    });

    //remove myself from my followers

    curUser.follower?.forEach(async (followerId) => {
      const Eachfollower = await User.findById(followerId);
      const index = Eachfollower?.following?.indexOf(curUserId);
      Eachfollower?.following?.splice(index, 1);
      await Eachfollower?.save();
    });

    // remove myself from my followings follower
    curUser.following?.forEach(async (followingId) => {
      const Eachfollowings = await User.findById(followingId);
      const index = Eachfollowings?.follower?.indexOf(curUserId);
      Eachfollowings?.follower?.splice(index, 1);
      await Eachfollowings?.save();
    });

    // delete likes of posts whom i liked

    const allPost = await Post.find({ likes: curUserId });

    allPost?.forEach(async (eachPost) => {
      const index = eachPost?.likes?.indexOf(curUserId);
      eachPost?.likes?.splice(index, 1);
      await eachPost?.save();
    });
    await curUser.deleteOne();
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user succesfully deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    return res.send(success(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;
    const user = await User.findById(req._id);
    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileimg",
      });

      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
      await user.save();
      return res.send(success(200, { user }));
    }
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId)
      .populate({
        path: "posts",
        populate: {
          path: "owner",
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "commentsId",
          populate: {
            path: "reply",
            populate: [{ path: "repliedTo" }, { path: "repliedBy" }],
          },
        },
      });

    console.log(user);

    const fullPost = user.posts;
    const posts = fullPost
      .map((post) => {
        return mapPostOutput(post, req._id);
      })
      .reverse();

    res.send(success(200, { ...user._doc, posts }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

module.exports = {
  followOrUnfollowUserController,
  getPostOfFollowing,
  getMyPosts,
  GetuserPosts,
  deleteMyUser,
  getMyInfo,
  updateUserProfile,
  getUserProfile,
};
