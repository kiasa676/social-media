import React, { useState } from "react";
import CommentBox from "../comment/CommentBox.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./totalComment.scss";

function TotalComment({ comments, viewComment }) {
  const [replyBox, setReplyBox] = useState(false);

  return (
    <div className="totalComment">
      <CommentBox comments={comments} />
      {comments?.reply?.length === 0 ? (
        ""
      ) : (
        <div className="count">
          {replyBox ? (
            <FontAwesomeIcon icon={faArrowUp} fontSize="0.9rem" />
          ) : (
            <FontAwesomeIcon icon={faArrowDown} fontSize="0.9rem" />
          )}

          <h2
            onClick={() => {
              setReplyBox(!replyBox);
            }}
          >
            {comments?.reply?.length} replies
          </h2>
        </div>
      )}

      {replyBox ? (
        <div className="reply">
          {comments.reply.map((reply) => {
            return (
              <div
                className="replysection"
                style={{
                  borderLeft: "1px solid #ebebeb",
                  marginLeft: "25px",
                  padding: "0 0 0 15px",
                }}
              >
                <CommentBox key={reply?.comment_id} comments={reply} />
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TotalComment;
