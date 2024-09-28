import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async (body) => {
  try {
    const response = await axiosClient.get("/user/getMyInfo");

    return response.result;
  } catch (error) {
    return Promise.reject(error);
  }
});

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      const response = await axiosClient.put("/user/", body);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    myProfile: null,
    toastData: {},
    isDarkMode: false,
    darkTheme: {
      backgroundColor: "#0b090a",
      color: "#fff",
    },
    lessDarkTheme: {
      backgroundColor: "#011e19",
      color: "#999",
    },
    showReply: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    ShowToast: (state, action) => {
      state.toastData = action.payload;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setShowReply: (state, action) => {
      state.showReply = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      });
  },
});

export default appConfigSlice.reducer;

export const { setLoading, ShowToast, setDarkMode, setShowReply } =
  appConfigSlice.actions;
