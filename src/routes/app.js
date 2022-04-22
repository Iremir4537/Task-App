const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const token = req.cookies.SESSION;
  if (!token) {
    res.redirect("/login");
  } else {
    res.render("index", { signedIn: true });
  }
});

router.get("/login", (req, res) => {
  const token = req.cookies.SESSION;
  if (token) {
    res.redirect("/");
  } else {
    res.render("login", { signedIn: false });
  }
});

router.get("/register", (req, res) => {
  const token = req.cookies.SESSION;
  if (token) {
    res.redirect("/");
  } else {
    res.render("register", { signedIn: false });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("SESSION");
  res.redirect("/");
});

module.exports = router;
