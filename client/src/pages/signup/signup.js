import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.scss";
import { axiosClient } from "../../utils/axiosClient";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log(response);

      //   console.log("acess token from login", getItem("access_token"));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="signup">
      <div className="signup-box">
        <h2 className="heading">Sign up</h2>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="name"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

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
          Already have an account?<Link to="/login">Login up</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
