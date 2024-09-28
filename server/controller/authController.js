const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../Utils/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      // res.status(400).send("all field are required");
      res.send(error(400, "all feild are required"));
      return;
    }

    const OldUser = await User.findOne({ email });

    if (OldUser) {
      // return res.status(409).send("user exist");
      return res.send(error(409, "user exist"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.send(success(200, "user created successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.send(error(400, "all feild are required"));
      return;
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // return res.status(404).send("user not resistered");
      return res.send(error(404, "user not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      // return res.status(403).send("password not matched");
      return res.send(error(403, "password not matched"));
    }

    const accessToken = genrateAccessToken({
      _id: user.id,
    });

    const refreshToken = genrateRefreshToken({
      _id: user.id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (e) {
    console.log(error(500, e.message));
  }
};
// this refresh token will check validity and generate the new acsess token
const refreshAccessToken = async (req, res) => {
  const cookies = req.cookies;

  // check this code has done same thing in line 67 and 72
  if (!cookies.jwt) {
    // res.status(401).send("refresh token in cookie is requires");

    return res.send(error(401, "refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  console.log("refresh token", refreshToken);
  if (!refreshToken) {
    // return res.status(401).send("refresh token is required");
    return res.send(error(401, "refresh token is required"));
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = genrateAccessToken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    // return res.status(401).send("invalid refresh token");
    return res.send(error(401, "invalid refresh token"));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user logged out"));
  } catch (e) {
    return res.send(error(500, e, message));
  }
};

//internal function
const genrateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
const genrateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signupController,
  loginController,
  refreshAccessToken,
  logoutController,
};
