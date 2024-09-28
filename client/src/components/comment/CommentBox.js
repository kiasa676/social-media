import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import Editinput from "../editinput/Editinput.js";
import { FaReply } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import "./Comment.scss";

import { useNavigate } from "react-router-dom";
import CommentInput1 from "../commentInput1/CommentInput1.js";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { axiosClient } from "../../utils/axiosClient.js";
import { getFeedData } from "../../redux/slices/feedSlice.js";

function CommentBox({ comments }) {
  const navigate = useNavigate();
  const [reply, setReply] = useState(false);
  const [change, showChange] = useState(false);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();

  const replyBox = () => {
    setReply(!reply);
  };

  // const [itsReply, setItsReply] = useState(comments.repliedToUserId);
  const deletecomment = async () => {
    const response = await axiosClient.post("/posts/deletecomment", {
      commentId: comments.comment_id,
      postId: comments.postId,
      OriginalCommentId: comments?.Originalcomment_id,
    });

    dispatch(getFeedData());
  };
  return (
    <div className="commentCombine">
      {edit ? (
        <Editinput comments={comments} edit={setEdit} />
      ) : (
        <>
          <div className="comment-box">
            <div className="leftBox">
              <div
                className="profileInfo"
                onClick={() => {
                  navigate(`/profile/${comments?.userId}`);
                }}
              >
                <Avatar src={comments?.avatar?.url} />
                <h4 className="fullname">{comments?.name}</h4>
              </div>
              <div className="text-align">
                <div className="text">
                  {comments.repliedToUserId ? (
                    <p>
                      {comments.repliedToUserId === comments.userId ? (
                        ""
                      ) : (
                        <p
                          className="tag"
                          onClick={() => {
                            navigate(`/profile/${comments.repliedToUserId}`);
                          }}
                          style={{
                            display: "inline-block",
                            color: "black",
                            fontSize: "0.92rem",
                            color: "#3ea6ff",
                            backgroundColora: "#3ea6ff",
                            cursor: "pointer",
                          }}
                        >
                          {" "}
                          {`@${comments?.repliedToName}`}&nbsp;
                        </p>
                      )}

                      {comments?.text}
                    </p>
                  ) : (
                    <p>{comments?.text}</p>
                  )}
                </div>
                <div className="reply-box" onClick={replyBox}>
                  <FaReply />
                  <h4>Reply</h4>
                </div>
              </div>
            </div>
            <div
              className="rightBox"
              onClick={() => {
                showChange(!change);
              }}
            >
              <SlOptionsVertical />
              {change ? (
                <div className="changes">
                  <div
                    className="edit"
                    onClick={() => {
                      setEdit(!edit);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} fontSize="0.8rem" />
                    <h4>Edit</h4>
                  </div>
                  <div className="delete" onClick={deletecomment}>
                    <FontAwesomeIcon icon={faTrashCan} />
                    <h4>Delete</h4>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="comment-Reply">
            {reply ? (
              <CommentInput1
                comment={comments}
                reply={() => {
                  setReply(false);
                }}
              />
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CommentBox;
