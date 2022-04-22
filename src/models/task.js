const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be empty"],
      trim: true,
      minLength: [3, "Names minimum lenght is 3"],
    },
    completed: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//https://www.youtube.com/watch?v=TP6Fzo1Ls58
taskSchema.statics.errorFormatter = function (e) {
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

module.exports = mongoose.model("Task", taskSchema);
