import React, { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import "./follower.scss";
import { useDispatch, useSelector } from "react-redux";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
import { useNavigate } from "react-router-dom";
import userImg from "../../asset/hacker.png";
function Follower({ user }) {
  const feedData = useSelector((state) => {
    return state.feedDataReducer.feedData;
  });

  const lessdarkTheme = {
    color: "#ebe6e6",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState();
  const isDarkMode = useSelector((state) => {
    return state.appConfigReducer.isDarkMode;
  });

  useEffect(() => {
    setIsFollowing(
      feedData?.following?.find((item) => {
        return item?._id === user?._id;
      })
    );
  }, [feedData]);

  function handleUserFollow() {
    dispatch(followAndUnfollowUser({ userIdToFollow: user?._id }));
  }

  return (
    <div className="Follower">
      <div
        className="user-info"
        onClick={() => {
          navigate(`/profile/${user?._id}`);
        }}
      >
        <Avatar src={user?.avatar?.url} />
        <h4 className="name" style={isDarkMode ? lessdarkTheme : {}}>
          {user?.name}
        </h4>
      </div>

      <h5
        style={isDarkMode ? lessdarkTheme : {}}
        onClick={handleUserFollow}
        className={
          isFollowing ? "hover-link follow-link" : "btn-primary hover-link"
        }
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </h5>
    </div>
  );
}

export default Follower;
