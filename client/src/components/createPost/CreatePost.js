import React, { useState } from "react";
import "./CreatePost.scss";
import Avatar from "../avatar/Avatar";
import userImg from "../../asset/hacker.png";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { getUserInfo } from "../../redux/slices/postsSlice";

function CreatePost() {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => {
    return state.appConfigReducer.myProfile;
  });
  const isDarkMode = useSelector((state) => {
    return state.appConfigReducer.isDarkMode;
  });

  async function handlePostSubmit() {
    try {
      const response = await axiosClient.post("/posts", {
        caption,
        postImg,
      });

      dispatch(getUserInfo({ userId: myProfile._id }));
    } catch (error) {
    } finally {
      setCaption("");
      setPostImg("");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  }

  return (
    <div className="CreatePost" style={isDarkMode ? { border: "none" } : {}}>
      <div className="left-part1">
        <Avatar
          src={myProfile?.avatar?.url ? myProfile?.avatar?.url : userImg}
        />
      </div>
      <div className="right-part2">
        <input
          style={isDarkMode ? { backgroundColor: "#222", color: "white" } : {}}
          value={caption}
          type="text"
          className="captionInput"
          placeholder="What's on your mind?"
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
        {postImg && (
          <div className="img-container">
            <img src={postImg} alt="post-img" className="post-img" />
          </div>
        )}

        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button className="post btn-primary" onClick={handlePostSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
