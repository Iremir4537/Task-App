const express = require("express");
const router = express.Router();
const authUser = require("../middleware/auth");
const Task = require("../models/task");
const User = require("../models/user");

//Post task
router.post("/task/post", authUser, async (req, res) => {
  try {
    const task = new Task({
      name: req.body.name,
      completed: req.body.completed,
      owner: req.user._id,
    });
    await task.save();
    res.send(task);
  } catch (e) {
    res.send(Task.errorFormatter(e));
  }
});
//Get all tasks
router.get("/task/getall", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    await user.populate("tasks");
    res.send(user.tasks);
  } catch (e) {
    res.send(Task.errorFormatter(e));
  }
});
//Get single tasks
router.get("/task/getone/:id", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    await user.populate("tasks");
    const taskC = [];
    user.tasks.forEach((task) => {
      if (task._id.toString() == req.params.id) {
        taskC.push(task);
      }
    });
    if (taskC != []) {
      res.send(taskC);
    } else {
      res.send();
    }
  } catch (e) {
    res.send(Task.errorFormatter(e));
  }
});
//Update task
router.put("/task/update/:id", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    await user.populate("tasks");
    const taskFound = [];
    user.tasks.forEach(async (task) => {
      if (task._id.toString() == req.params.id) {
        taskFound.push(req.params.id);
        if (req.body.name && req.body.name.length < 3) {
          res.send({ error: "Task name length ca't be less then 3 " });
        } else {
          await Task.findOneAndUpdate(
            { _id: req.params.id },
            { name: req.body.name, completed: req.body.completed }
          );
          const updatedTask = await Task.findOne({ _id: req.params.id });
          res.send(updatedTask);
        }
      }
    });
    if (taskFound[0] == undefined) {
      res.send([]);
    }
  } catch (e) {
    res.send({ error: e.message });
  }
});
//Delete task
router.delete("/task/delete/:id", authUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    await user.populate("tasks");
    const taskFound = [];
    user.tasks.forEach(async (task) => {
      if (task._id.toString() == req.params.id) {
        taskFound.push(req.params.id);
        await Task.findOneAndDelete({ _id: req.params.id });
        res.send();
      }
    });
    if (taskFound[0] == undefined) {
      res.send([]);
    }
  } catch (e) {
    res.send(Task.errorFormatter(e));
  }
});

module.exports = router;
