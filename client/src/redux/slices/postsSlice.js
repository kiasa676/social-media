import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (body) => {
    try {
      const response = await axiosClient.post("/user/getUserProfile", body);

      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const likeAndUnlikePost = createAsyncThunk(
  "posts/likeAndUnlikePost",
  async (body) => {
    try {
      const response = await axiosClient.post("/posts/like", body);

      return response.result.post;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: {
    userProfile: {},
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
        const post = action.payload;

        const index = state.userProfile.posts?.findIndex((item) => {
          return item._id === post._id;
        });

        if (index != -1 && index != undefined) {
          state.userProfile.posts[index] = action.payload;
        }
      });
  },
});

export default postsSlice.reducer;
