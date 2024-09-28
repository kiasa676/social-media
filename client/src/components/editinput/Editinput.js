import React, { useState } from "react";

import "./EditInput.scss";
import Avatar from "../avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { getFeedData } from "../../redux/slices/feedSlice";

function CommentInput({ comments, edit }) {
  const [inputText, setInputText] = useState(comments?.text);
  const toGetComment = (e) => {
    setInputText(e.target.value);
  };
  const dispatch = useDispatch();
  console.log(comments.comment_id);
  const postButton = async (e) => {
    e.preventDefault();
    const response = await axiosClient.post("/posts/editcomment", {
      commentId: comments.comment_id,
      text: inputText,
    });

    dispatch(getFeedData());
    edit();
  };
  return (
    <div className="edit-Comment-input">
      <form className="edit-form">
        <Avatar src={comments?.avatar?.url} />

        <div className="edit-input-emoji">
          <input
            type="text"
            placeholder="Edit your Comment"
            onChange={toGetComment}
            value={inputText}
          />

          <div className="edit-emoji-icon"></div>
        </div>
        <button
          className="edit-cancelBtn"
          type="submit"
          onClick={() => {
            edit();
          }}
        >
          Cancel
        </button>
        <button className="edit-postBtn" type="submit" onClick={postButton}>
          Edit
        </button>
      </form>
    </div>
  );
}

export default CommentInput;
