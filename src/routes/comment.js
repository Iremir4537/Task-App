const express = require("express");
const router = express.Router();
const Comment = require("../models/comment")
const Post = require("../models/post");
const User = require("../models/user");
const getUser = require("../middleware/getUser");

router.post("/api/comment/post/:id", getUser, async (req,res) => {
    try {
        const userId =req.user._id;
        const comment = new Comment({commentText:req.body.commentText,commentedBy:userId,commentedPost:req.params.id})
        await comment.save()
        res.send(comment)
    } catch (e) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.delete("/api/comment/delete/:id", getUser, async (req,res) => {
    try {
        const userID = req.user._id;
        const comment = await Comment.findById(req.params.id);
        if(userID.toString() == comment.commentedBy.toString()){
            await Comment.findByIdAndDelete(comment._id);
            res.send("Deleted")
        }
        else{
            throw new Error();
        }
    } catch (e) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.put("/api/comment/updatetext/:id", getUser, async (req,res) => {
    try {
          const userID = req.user._id;
          const comment = await Comment.findById(req.params.id);
          if (userID.toString() == comment.commentedBy.toString()) {
            const newComment = await Comment.findByIdAndUpdate(comment._id,{commentText:req.body.commentText})
            res.send(newComment);
          } else {
            console.log(e);
            throw new Error();
          }
    } catch (e) {
        res.send({error: "Something went wrong please try again!"})
    }
})

module.exports = router;