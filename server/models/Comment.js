const { default: mongoose } = require("mongoose");

const commentScheme = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: { type: String, required: true },
  avatar: {
    publicId: String,
    url: String,
  },
  text: {
    type: String,
    required: true,
  },
  reply: [
    {
      repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        required: true,
      },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("comment", commentScheme);
