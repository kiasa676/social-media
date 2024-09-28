import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
import backgroundImg from "../../asset/background.jpg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { likeAndUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { FaRegCommentAlt } from "react-icons/fa";
import CommentInput from "../commentInput/CommentInput";
import TotalComment from "../totalComment/totalComment.js";

function Post({ post }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  async function handlePostLike(e) {
    dispatch(likeAndUnlikePost({ postId: post?._id }));
  }

  const isDarkMode = useSelector((state) => {
    return state.appConfigReducer.isDarkMode;
  });

  const lessdarkTheme = {
    color: "#ebe6e6",
  };

  const [viewComment, setViewComment] = useState(false);
  const showComment = (value) => {
    if (value) {
      setViewComment(true);
    } else {
      setViewComment(!viewComment);
      console.log(viewComment);
    }
  };
  return (
    <div className="Post" style={isDarkMode ? { border: "none" } : {}}>
      <div
        className="heading"
        onClick={() => {
          navigate(`/profile/${post?.owner?._id}`);
        }}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4 style={isDarkMode ? lessdarkTheme : {}}>{post?.owner?.name}</h4>
      </div>
      <p style={isDarkMode ? lessdarkTheme : {}} className="caption">
        {post?.caption}
      </p>
      <div
        className="content"
        style={isDarkMode ? { backgroundColor: "black" } : {}}
      >
        <img src={post?.image.url} alt="" />
      </div>
      <div className="footer">
        <div className="post-info">
          <div className="likes" onClick={handlePostLike}>
            {post?.isLiked ? (
              <AiFillHeart className="icon" style={{ color: "red" }} />
            ) : (
              <AiOutlineHeart className="icon" />
            )}

            <h4 style={isDarkMode ? lessdarkTheme : {}}>
              {post?.likesCount} likes
            </h4>
          </div>
          <div
            className="comment"
            onClick={() => {
              showComment(false);
            }}
          >
            <FaRegCommentAlt
              style={{ fontSize: "1.23rem", alignSelf: "end" }}
            />
            <h4 style={isDarkMode ? lessdarkTheme : {}}>2 comment</h4>
          </div>
        </div>

        <h6
          style={
            isDarkMode
              ? { ...lessdarkTheme, color: "#999", alignSelf: "flex-end" }
              : {}
          }
          className="time-ago"
        >
          {post?.timeAgo}
        </h6>
        <div className="comment-box">
          <CommentInput comment={post} viewComment={showComment} />
          {viewComment
            ? post?.comments?.map((comment) => {
                return <TotalComment comments={comment} />;
              })
            : ""}
        </div>
      </div>
    </div>
  );
}

export default Post;
// {viewComment ? <TotalComment comments={post?.comments} /> : ""}
