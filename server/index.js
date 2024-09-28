const express = require("express");
const postRouter = require("./routers/postRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Dotenv = require("dotenv");
Dotenv.config("./.env");

const dbconnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const cloudinary = require("cloudinary").v2;

const morgan = require("morgan");
const userRouter = require("./routers/userRouter");
const app = express();

const PORT = process.env.PORT || 4001;

//cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//middleware
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("working");
});
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);

dbconnect();
app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
