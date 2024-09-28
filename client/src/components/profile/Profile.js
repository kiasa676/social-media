import React, { useEffect, useState } from "react";
import Post from "../posts/Post";
import "./Profile.scss";
import userImg from "../../asset/hacker.png";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import linkdlin from "../../asset/linkedin.png";
import twitter from "../../asset/twitter.png";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa6";
import { color } from "@cloudinary/url-gen/qualifiers/background";
{
  /* <FaLocationDot />
<FaBriefcase /> */
}

function Profile() {
  const Navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const userProfile = useSelector((state) => {
    return state.postsReducer.userProfile;
  });

  const myProfile = useSelector((state) => {
    return state.appConfigReducer.myProfile;
  });
  console.log(myProfile);

  const feedData = useSelector((state) => {
    return state.feedDataReducer.feedData;
  });

  useEffect(() => {
    dispatch(getUserInfo({ userId: params.userId }));

    setIsFollowing(
      feedData?.following?.find((item) => {
        return item._id === params.userId;
      })
    );
    setIsMyProfile(myProfile?._id === params?.userId);
  }, [params.userId, myProfile, feedData]);

  function handleUserFollow() {
    dispatch(followAndUnfollowUser({ userIdToFollow: params.userId }));
  }
  const isDarkMode = useSelector((state) => {
    return state.appConfigReducer.isDarkMode;
  });
  const darkTheme = useSelector((state) => {
    return state.appConfigReducer.darkTheme;
  });
  const lessdarkTheme = useSelector((state) => {
    return state.appConfigReducer.lessDarkTheme;
  });

  return (
    <div className="Profile" style={isDarkMode ? darkTheme : {}}>
      <div className="container">
        <div className="left-part" style={isDarkMode ? darkTheme : {}}>
          <div className="createPost" style={isDarkMode ? lessdarkTheme : {}}>
            {isMyProfile && <CreatePost />}
          </div>

          {userProfile?.posts?.map((post) => {
            return (
              <div style={isDarkMode ? lessdarkTheme : {}}>
                {" "}
                <Post key={post._id} post={post} />
                {console.log(post, "post from profile")}
              </div>
            );
          })}
        </div>
        <div className="right-part">
          <div
            className="profile-card"
            style={isDarkMode ? { ...lessdarkTheme, border: "none" } : {}}
          >
            <img
              className="user-img"
              src={userProfile?.avatar?.url}
              alt={userImg}
            />
            <h3
              className="user-name"
              style={isDarkMode ? { color: "white" } : {}}
            >
              {userProfile?.name}
            </h3>
            <p className="bio" style={isDarkMode ? { color: "white" } : {}}>
              {userProfile?.bio}
            </p>
            <div className="follower-info">
              <h4
                style={isDarkMode ? { color: "#ebe6e6" } : {}}
              >{`${userProfile?.follower?.length} Followers`}</h4>
              <h4
                style={isDarkMode ? { color: "#ebe6e6" } : {}}
              >{`${userProfile?.following?.length} Followings`}</h4>
            </div>
            <div
              style={isDarkMode ? { backgroundColor: "#555" } : {}}
              className="line"
            ></div>

            <div className="per-info">
              <div className="information">
                <FaLocationDot />
                <p style={isDarkMode ? { color: "#999" } : {}}>
                  Somewhere out There,IND
                </p>
              </div>
              <div className="information">
                <FaBriefcase />
                <p style={isDarkMode ? { color: "#999" } : {}}>
                  some degenerate
                </p>
              </div>
            </div>
            <div
              style={isDarkMode ? { backgroundColor: "#555" } : {}}
              className="line"
            ></div>
            <div className="personalLink">
              <h4
                style={
                  isDarkMode
                    ? { color: "white", textAlign: "start", fontWeight: "600" }
                    : {}
                }
              >
                Social Profiles
              </h4>
              <div className="link-Container">
                <div className="social-link">
                  <img src={twitter} alt="twitter" />

                  <div className="hoverLink" id="link">
                    <p style={isDarkMode ? { color: "white" } : {}}>Twitter</p>
                    <p>social network</p>
                  </div>
                </div>
                <div className="edit-png">
                  <MdOutlineModeEdit />
                </div>
              </div>
              <div className="link-Container">
                <div className="social-link">
                  <img src={linkdlin} alt="twitter" />

                  <div className="hoverLink" id="link">
                    <p style={isDarkMode ? { color: "white" } : {}}>Linkdlin</p>
                    <p>Network platform</p>
                  </div>
                </div>
                <div className="edit-png">
                  <MdOutlineModeEdit />
                </div>
              </div>
            </div>
            {!isMyProfile && (
              <h5
                style={{ marginTop: "10px" }}
                onClick={handleUserFollow}
                className={
                  isFollowing
                    ? "hover-link follow-link"
                    : "btn-primary hover-link"
                }
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </h5>
            )}
            {isMyProfile && (
              <button
                className="Update-profile btn-secondary"
                onClick={() => {
                  Navigate("/updateProfile");
                }}
              >
                Update profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
