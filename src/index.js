const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("./db/db");
const ejs = require("express-ejs-layouts");

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(ejs);

app.set("layout", "./layout/layout.ejs");
app.set("view engine", "ejs");

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const mainRouter = require("./routes/app");
app.use(userRouter);
app.use(taskRouter);
app.use(mainRouter);

app.listen(3000, () => {
  console.log("Server is live on port 3000");
});
