import React from "react";
import { KEY_ACCESS_TOKEN, getItem } from "../utils/localStroageManager";
import Login from "../pages/login/Login";
import { Navigate, Outlet } from "react-router-dom";

function RequiredUser() {
  const user = getItem(KEY_ACCESS_TOKEN);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default RequiredUser;
