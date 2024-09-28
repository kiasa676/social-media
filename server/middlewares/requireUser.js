const jwt = require("jsonwebtoken");
const { error } = require("../Utils/responseWrapper");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // console.log(req.headers + "req.headers");
  // console.log(req.headers.authorization + "req.headers.authorization");
  // console.log(
  //   req.headers.authorization.startsWith("Bearer") +
  //     "req.headers.authorization.startsWith beare"
  // );

  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    // return res.status(401).send(" Authorization header is required");
    return res.send(error(401, "Authorization header is required"));
    console.log("Authorization header is required");
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    // console.log(decoded);
    req._id = decoded._id;

    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "user not found"));
    }

    next();
  } catch (e) {
    console.log(e);
    // return res.status(401).send("invalid authorization token");
    return res.send(error(401, "invalid authorization token"));
    console.log("invalid authorization token");
  }
};
