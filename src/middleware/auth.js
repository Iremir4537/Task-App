const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    //Get token
    const token = req.cookies.SESSION;
    if (!token) {
      throw new Error("Please login");
    }
    //Get user
    const userCredentials = jwt.verify(token, "verysecret");
    const user = await User.findOne({ email: userCredentials.email });
    //Check user exis
    if (!user) {
      throw new Error("Please login");
    }
    req.user = user;
    //Connect user to req
    next();
  } catch (e) {
    res.send({ error: e.message });
  }
};

module.exports = authUser;
