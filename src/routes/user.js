const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authUser = require("../middleware/auth");

router.post("/user/register", async (req, res) => {
  try {
    //Create hashed password
    bcrypt.hash(req.body.password, 8, async (err, hash) => {
      try {
        //Create user
        if (req.body.password.length < 7) {
          res.send({ passwordError: "Passwords minimum length is 7" });
        } else {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
          });
          const userCheck = await User.findOne({ email: req.body.email }).then(
            (data) => {
              return data;
            }
          );
          //Save user
          await user.save();
          //Create SESSION cookie
          if (userCheck == null) {
            const token = jwt.sign(
              {
                name: user.name,
                email: user.email,
              },
              "verysecret"
            );
            res.cookie("SESSION", token, { expiresIn: "24h" });
          }
          res.send(user);
        }
      } catch (e) {
        //If user exists send "User exists error"
        const userCheck = await User.findOne({ email: req.body.email }).then(
          (data) => {
            return data;
          }
        );
        if (userCheck !== null) {
          res.send({ error: "User exist" });
        }
        //Else sende other errors
        else {
          res.send(User.errorFormatter(e));
        }
      }
    });
  } catch (e) {
    res.send({ error: "Something went wrong" });
  }
});
router.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      res.send({ error: "Password or Email is wrong" });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (!err && result == true) {
          const token = jwt.sign(
            {
              name: user.name,
              email: user.email,
            },
            "verysecret"
          );
          res.cookie("SESSION", token, { expiresIn: "24h" });
          res.send({ user });
        }
      });
    }
  } catch (e) {
    res.send({ error: "Something went wrong" });
  }
});
router.post("/user/logout", async (req, res) => {
  // Delete SESSION cookie
  try {
    res.clearCookie("SESSION");
    res.send();
  } catch (e) {
    res.send({ error: "Something went wrong" });
  }
});
module.exports = router;
