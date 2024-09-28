import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";
import { likeAndUnlikePost } from "./postsSlice";

export const getFeedData = createAsyncThunk("user/getFeedData", async (_) => {
  try {
    const response = await axiosClient.get("/user/getFeedData");

    return response.result;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const followAndUnfollowUser = createAsyncThunk(
  "user/followAndUnfollow",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/follow", body);

      return response.result.user;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const feedSlice = createSlice({
  name: "feedSlice",
  initialState: {
    feedData: {},
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;
        const index = state.feedData?.posts?.findIndex((item) => {
          return item._id === post._id;
        });
        if (index != -1 && index != undefined) {
          state.feedData.posts[index] = action.payload;
        }
      })
      .addCase(followAndUnfollowUser.fulfilled, (state, action) => {
        const user = action.payload;

        const index = state.feedData?.following?.findIndex((item) => {
          return item._id === user._id;
        });
        if (index != -1 && index != undefined) {
          state.feedData?.following.splice(index, 1);
        } else {
          state.feedData.following.push(user);
        }
      });
  },
});

export default feedSlice.reducer;
