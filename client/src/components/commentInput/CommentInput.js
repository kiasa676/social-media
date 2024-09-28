import React, { useState } from "react";

import "./CommentInput.scss";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { getFeedData } from "../../redux/slices/feedSlice";

function CommentInput({ comment, viewComment }) {
  const myProfile = useSelector((state) => {
    return state.appConfigReducer.myProfile;
  });
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState();
  const toGetComment = (e) => {
    setInputText(e.target.value);
    console.log(inputText);
  };
  const postButton = async (e) => {
    e.preventDefault();
    const response = await axiosClient.post("/posts/comment", {
      postId: comment._id,
      text: inputText,
    });
    dispatch(getFeedData());
    setInputText("");
    const a = true;
    viewComment(a);
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

export default CommentInput;
