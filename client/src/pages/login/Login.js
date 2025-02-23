import React, { useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import Signup from "../signup/signup";
import { axiosClient } from "../../utils/axiosClient";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  setItem,
} from "../../utils/localStroageManager";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      navigate("/");
      //   console.log("acess token from login", getItem("access_token"));
    } catch (error) {
      console.log(error, "error in login");
    }
  }

  return (
    <div className="login">
      <div className="login-box">
        <h2 className="heading">Login</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <input type="submit" className="sumit" value="Submit" />
        </form>

        <p className="subHeading">
          Do not have an account?<Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
