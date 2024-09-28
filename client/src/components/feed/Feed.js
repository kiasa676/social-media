import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../posts/Post";
import Follower from "../follower/follower";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";
import CreatePost from "../createPost/CreatePost";
import Advertisement from "../advertisement/Advertisement";
function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => {
    return state.feedDataReducer.feedData;
  });

  useEffect(() => {
    dispatch(getFeedData());
  }, [dispatch]);

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
    <div className="Feed" style={isDarkMode ? darkTheme : {}}>
      <div className="container">
        <div className="left-part">
          <div className="createPost" style={isDarkMode ? lessdarkTheme : {}}>
            <CreatePost />
          </div>
          <div className="ads" style={isDarkMode ? lessdarkTheme : {}}>
            <Advertisement />
          </div>
          <div className="feedData" style={isDarkMode ? lessdarkTheme : {}}>
            {feedData?.posts?.map((post) => {
              return <Post key={post._id} post={post} />;
            })}
          </div>
        </div>
        <div className="right-part" style={isDarkMode ? lessdarkTheme : {}}>
          <div className="following" style={isDarkMode ? lessdarkTheme : {}}>
            <h3 className="title" style={isDarkMode ? lessdarkTheme : {}}>
              you are following
            </h3>
            {feedData?.following?.map((user) => {
              return <Follower key={user._id} user={user} />;
            })}
          </div>
          <div className="suggestion" style={isDarkMode ? lessdarkTheme : {}}>
            <h3 className="title" style={isDarkMode ? lessdarkTheme : {}}>
              suggestion for you
            </h3>
            {feedData?.suggestion?.map((user) => {
              return <Follower key={user._id} user={user} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
