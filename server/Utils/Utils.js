const ta = require("time-ago");

const mapPostOutput = (post, userId) => {
  return {
    _id: post._id,
    caption: post.caption,
    image: post.image,
    owner: {
      _id: post.owner._id,
      name: post.owner.name,
      avatar: post.owner.avatar,
    },
    isLiked: post.likes.includes(userId),
    likesCount: post.likes.length,
    timeAgo: ta.ago(post.createdAt),
    comments: Array.isArray(post.commentsId)
      ? post.commentsId.map((comment) => {
          return {
            avatar: comment.avatar,
            name: comment.name,
            text: comment.text,
            comment_id: comment._id,
            userId: comment.userId,
            postId: comment.postId,
            createdAt: comment.createdAt,
            reply: Array.isArray(comment.reply)
              ? comment.reply.map((reply) => {
                  return {
                    repliedToUserId: reply.repliedTo.userId,
                    repliedToName: reply.repliedTo.name,

                    avatar: {
                      publicId: reply.repliedBy.avatar.publicId,
                      url: reply.repliedBy.avatar.url,
                    },
                    Originalcomment_id: comment._id,
                    comment_id: reply.repliedBy._id,
                    postId: reply.repliedBy.postId,
                    userId: reply.repliedBy.userId,
                    name: reply.repliedBy.name,
                    text: reply.repliedBy.text,
                    createdAt: reply.repliedBy.createdAt,
                    __v: reply.repliedBy.__v,
                  };
                })
              : [],
          };
        })
      : [],
  };
};

module.exports = { mapPostOutput };
