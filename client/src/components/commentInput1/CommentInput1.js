import React, { useState } from "react";

import "./CommentInput1.scss";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { getFeedData } from "../../redux/slices/feedSlice";
import { getUserInfo } from "../../redux/slices/postsSlice";

function CommentInput1({ comment, reply }) {
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => {
    return state.appConfigReducer.myProfile;
  });
  const repliedToname = comment?.repliedToName || comment?.name;
  const name = `${"  "}@${repliedToname}` + " ";
  const [inputText, setInputText] = useState(name);
  const [repliedToText, setRepliedToText] = useState();

  const toGetComment = (e) => {
    const value = () => {
      return e.target.value.replace(name, "").trim();
    };
    setInputText(e.target.value);
    setRepliedToText(value());
  };
  const postButton = async (e) => {
    e.preventDefault();

    const response = await axiosClient.post("/posts/reply", {
      postId: comment?.postId,
      text: repliedToText,

      repliedTo: comment?.comment_id,
      commentId: comment?.Originalcomment_id || comment?.comment_id,
    });
    setInputText("");
    reply();
    dispatch(getFeedData());
  };

  return (
    <div className="Comment-input">
      <form className="form">
        <Avatar src={myProfile?.avatar?.url} />

        <div className="input-emoji">
          <input
            type="text"
            placeholder="Type your reply here"
            onChange={toGetComment}
            value={inputText}
          />

          <div className="emoji-icon"></div>
        </div>
        <button className="postBtn" type="submit" onClick={postButton}>
          Post
        </button>
      </form>
    </div>
  );
}

export default CommentInput1;
