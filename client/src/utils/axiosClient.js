import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStroageManager";

import store from "../redux/store";
import { TOAST_SUCCESS, TOAST_FAILURE } from "../App";
import { ShowToast, setLoading } from "../redux/slices/appConfigSlice";
// import { error } from "../../../server/Utils/responseWrapper";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const access_token = getItem(KEY_ACCESS_TOKEN);
  console.log("request interceptor");
  request.headers["Authorization"] = `Bearer ${access_token}`;
  store.dispatch(setLoading(true));

  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;
    console.log("response interceptor", response.data);

    if (data.status === "ok") {
      console.log(data.status, "response is ok");
      return data;
    }
    console.log(data.error, "response comes with error");
    const StatusCode = data.statusCode;
    const originalRequest = response.config; // we get the original request
    const error = data.error;

    store.dispatch(
      ShowToast({
        type: TOAST_FAILURE,
        message: error,
      })
    );

    if (StatusCode === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      // mean the access token has expired
      console.log("refresh api called");

      // const response = await axiosClient.get("/auth/refresh");  // use axios instead of axios client to skin infinite loop in this interceptor will not work

      const response = await axios
        .create({
          withCredentials: true,
        })
        .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

      console.log(response, " from refresh ");
      if (response.data.status === "ok") {
        setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;
        console.log("running", response.data.result.accessToken);
        return axios(originalRequest);
      } else {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    console.log("running");
    return Promise.reject(error);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(
      ShowToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );
    return Promise.reject(error);
  }
);
