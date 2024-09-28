import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import userImage from "../../asset/hacker.png";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../../redux/slices/appConfigSlice";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStroageManager";
import { useNavigate } from "react-router-dom";
function UpdateProfile() {
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (myProfile) {
      setName(myProfile?.name || "");
      setBio(myProfile?.bio || "");
      setUserImg(myProfile?.avatar?.url);
    }
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(updateMyProfile({ name, bio, userImg }));
  }

  async function handleDeleteAccount(e) {
    const response = await axiosClient.delete("/user/");
    removeItem(KEY_ACCESS_TOKEN);
    navigate("/signup");
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg ? userImg : userImage} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="your Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
            <input
              type="submit"
              value="Submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>

          <button
            className="delete-account btn-primary"
            onClick={handleDeleteAccount}
          >
            {" "}
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
