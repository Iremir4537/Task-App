const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
require("dotenv").config();
require("./src/db/db.js");

app.use(express.json());
app.use(cookieParser())
app.use(fileupload());

const userRouter = require("./src/routes/user");
const appRouter = require("./src/routes/app");
const postRouter = require("./src/routes/post")
const commentRouter = require("./src/routes/comment")

app.use(userRouter);
app.use(appRouter);
app.use(postRouter);
app.use(commentRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is up on port ${process.env.PORT}`);
});
