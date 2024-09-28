const { mapPostOutput } = require("../Utils/Utils");
const { success, error } = require("../Utils/responseWrapper");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const { post } = require("../routers/postRouter");
const cloudinary = require("cloudinary").v2;

const creatPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;

    if (!caption || !postImg) {
      return res.send(error(400, "caption and image is required")); // for malfunction if something is required
    }

    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: "postImg",
    });

    const owner = req._id;
    console.log(owner);

    const post = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.secure_url,
      },
    });

    const user = await User.findById(req._id);
    console.log(user._id);

    user.posts.push(post._id);

    await user.save();

    return res.send(success(200, { post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const currentuser = req._id;

    const post = await Post.findById(postId).populate("owner");

    if (!post) {
      return res.send(error(404, "Post not found"));
    }

    if (post.likes.includes(currentuser)) {
      const index = post.likes.indexOf(currentuser);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currentuser);
    }

    await post.save();

    return res.send(success(200, { post: mapPostOutput(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(404, "post not found"));
    }

    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "only owner can update their post"));
    }

    if (caption) {
      post.caption = caption;
    }

    await post.save();
    return res.send(success(200, { post }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;

    const curUserId = req._id;

    const post = await Post.findById(postId);
    const curUser = await User.findById(curUserId);

    if (!post) {
      return res.send(error(404, "post not found"));
    }

    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "only user can delete there post"));
    }

    const index = curUser.posts.indexOf(postId);

    curUser.posts.splice(index, 1);

    await curUser.save();
    await post.deleteOne();

    return res.send(success(200, "post deleted succesfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const commentController = async (req, res) => {
  try {
    const { postId, text } = req.body;
    if (!postId || !text) {
      return res.send(error(400, "postId & comment is required"));
    }

    const post = await Post.findById(postId);
    const user = await User.findById(req._id);

    const comment = await Comment.create({
      postId,
      userId: req._id,
      name: user.name,
      avatar: user.avatar,
      text,
    });
    post.commentsId.unshift(comment._id);
    await post.save();
    return res.send(success(200, { comment }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const replyCommentController = async (req, res) => {
  try {
    const { postId, text, repliedTo, commentId } = req.body;
    if (!postId || !text || !repliedTo || !commentId) {
      res.send(
        error(400, "text is empty or problem in this reply and comment")
      );
    }
    const user = await User.findById(req._id);

    const comment = await Comment.create({
      postId,
      userId: req._id,
      name: user.name,
      avatar: user.avatar,
      text,
    });
    const originalComment = await Comment.findById(commentId);

    const reply = { repliedTo, repliedBy: comment._id };
    originalComment.reply.push(reply);
    await originalComment.save();

    return res.send(success(200, { sucess: "sucess" }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const deleteCommentController = async (req, res) => {
  try {
    const { commentId, postId, OriginalCommentId } = req.body;
    if (!commentId || !postId) {
      return res.send(error(400, "commentId or postId not found"));
    }
    const comment = await Comment.findById(commentId);

    if (!OriginalCommentId) {
      const post = await Post.findById(postId).populate({
        path: "commentsId",
      });
      const index = post.commentsId.findIndex((comment) => {
        return comment._id.equals(commentId);
      });

      if (index !== -1) {
        post.commentsId.splice(index, 1);

        await post.save();

        const TodeleteCommentId = comment.reply.map((reply) => {
          return reply.repliedBy;
        });
        await Comment.deleteMany({ _id: { $in: TodeleteCommentId } });
        await comment.deleteOne();
      }

      return res.send(success(200, "comment deleted"));
    } else {
      const originalComment = await Comment.findById(OriginalCommentId);
      console.log(originalComment, "originalcomment");

      const replyIndex = originalComment.reply.findIndex((reply) => {
        return reply.repliedBy.equals(commentId);
      });

      if (replyIndex !== -1) {
        originalComment.reply.splice(replyIndex, 1);

        await originalComment.save();
        await comment.deleteOne();
      }
    }
    return res.send(success(200, "replied deleted"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const EditCommentController = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    if (!commentId || !text) {
      res.send(error(404, "text or comment not found"));
    }
    const comment = await Comment.findById(commentId);
    comment.text = text; //text is string
    await comment.save();
    console.log(comment, text);
    return res.send(success(200, "edited"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  creatPostController,
  likeAndUnlikePost,
  updatePostController,
  deletePostController,
  commentController,
  replyCommentController,
  EditCommentController,
  deleteCommentController,
};
