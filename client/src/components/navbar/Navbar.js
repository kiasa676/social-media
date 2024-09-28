import React, { useRef, useState } from "react";
import "./Nvabar.scss";
import Avatar from "../avatar/Avatar";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import LoadingBar from "react-top-loading-bar";
import { setDarkMode, setLoading } from "../../redux/slices/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStroageManager";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const isDarkMode = useSelector((state) => {
    return state.appConfigReducer.isDarkMode;
  });

  // const [loading, setLoading] = useState(false);

  // const toggleLoadingBar = (e) => {
  //   dispatch(setLoading(true));
  // };
  const Changemode = (e) => {
    dispatch(setDarkMode(!isDarkMode));
  };

  const lessdarkTheme = useSelector((state) => {
    return state.appConfigReducer.lessDarkTheme;
  });

  async function handleLogoutClicked() {
    try {
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
    } catch (error) {}
  }

  return (
    <div
      className="Navbar"
      style={isDarkMode ? { ...lessdarkTheme, border: "none" } : {}}
    >
      <div className="container">
        <h2
          style={isDarkMode ? { color: "#fff" } : {}}
          className="banner hover-link"
          onClick={() => {
            navigate("/");
          }}
        >
          Social Media
        </h2>
        <div className="right-side">
          <div className="darkmode" onClick={Changemode}>
            {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
          </div>
          <div
            className="profile hover-link"
            onClick={() => {
              navigate(`/profile/${myProfile?._id}`);
            }}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link" onClick={handleLogoutClicked}>
            <AiOutlineLogout />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
