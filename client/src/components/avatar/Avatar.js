import React from "react";
import userImg from "../../asset/hacker.png";
import "./Avatar.scss";
function Avatar({ src }) {
  return (
    <div className="avatar">
      <img src={src ? src : userImg} alt="user avatar" />
    </div>
  );
}

export default Avatar;
