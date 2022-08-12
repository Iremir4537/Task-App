const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Names minimum lenth is 3"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    validate: {
      validator: (v) => validator.isEmail(v) === true,
    },
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  likes:[{postId:mongoose.SchemaTypes.ObjectId}]
});

//Virtual blog posts

userSchema.virtual("posts",{
  ref: "Post",
  localField: "_id",
  foreignField: "postedBy"
})

module.exports = mongoose.model("User", userSchema);
