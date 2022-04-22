const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Names minimum lenght is 3"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already taken"],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => validator.isEmail(v) === true,
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [7, "Passwords minimum lenght is 7"],
    trim: true,
  },
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

//https://www.youtube.com/watch?v=TP6Fzo1Ls58
userSchema.statics.errorFormatter = function (e) {
  let errors = {};
  e = e.toString();
  const allErrors = e.substring(e.indexOf(":") + 1).trim();
  const allErrorsInArrayFormat = allErrors.split(",").map((err) => err.trim());
  allErrorsInArrayFormat.forEach((error) => {
    const [key, value] = error.split(":").map((err) => err.trim());
    errors[key + "Error"] = value;
  });
  return errors;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
