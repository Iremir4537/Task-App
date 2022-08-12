const express = require("express");
const router = express.Router();
const Post = require("../models/post")
const ObjectId = require("mongodb").ObjectId
const User = require("../models/user");
const getUser = require("../middleware/getUser");
const {uploadImage,downloadImage} = require("../middleware/image")
const { Error } = require("mongoose");
const user = require("../models/user");


router.post("/api/post/post",[getUser,uploadImage] ,async (req,res) => {
    try {
        const post = new Post({
            title: req.body.title,
            image: req.imgUrl,
            postHtml: req.body.postHtml,
            postedBy: req.user._id,
            likeCount:0
        })
        await post.save();
        res.send(post)
    } catch (e) {
        console.log(e);
        res.send({error: "Something went wrong please try again!"})
    }
})

router.get("/api/post/getall", async (req,res) => {
    try {
        const posts = await Post.find({})
        res.send(posts)
    } catch (e) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.get("/api/post/getone/:id", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.send(post)
        console.log(post);
    } catch (error) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.get("/api/post/myposts", getUser,async (req,res) => {
    try {
        
        const myPosts = await Post.find({ postedBy:  req.user._id});
        res.send(myPosts)
    } catch (e) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.put("/api/post/updatepost/:id", getUser, async (req,res) => {

try {
    const post = await Post.findById(req.params.id);
    if(post.postedBy.toString() == req.user._id.toString()){
        Post.findByIdAndUpdate(req.params.id,{title:req.body.title,image:req.body.image,postHtml:req.body.postHtml},function (err,result){
            if(err){
                throw new Error();
            }
            else{
                res.send(result)
            }
        })
    }
    else{
        throw new Error();
    }
} catch (e) {
    res.send({ error: "Something went wrong please try again!" });
}

})

router.delete("/api/post/deletepost/:id", getUser, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
       if (post.postedBy.toString() == req.user._id.toString()) {
         await Post.findByIdAndDelete(post._id);
         res.send("Deleted");
       } else {
         throw new Error();
       }
    } catch (e) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.get("/api/post/getcomments/:id", async(req,res) => {
    try {
        const post =await Post.findById(req.params.id);
        await post.populate("comments");
        res.send(post.comments);
    } catch (e) {
        res.send({ error: "Something went wrong please try again!" });
    }
})

router.put("/api/post/like/:id", getUser, async (req,res) => {
    try {
        let userLikes = req.user.likes;
        const post = await Post.findById(req.params.id);
        const arr = userLikes.filter(id => id.postId.toString() == req.params.id.toString());
        if(arr.length>0){
            for (let i = 0; i < userLikes.length; i++) {
                if (userLikes[i] == arr[0] || userLikes[i] == arr) {    
                    userLikes.splice(i, 1);
                    await User.findByIdAndUpdate(req.user._id,{likes: userLikes})
                    post.likeCount =post.likeCount- 1;
                    await Post.findByIdAndUpdate(req.params.id,{likeCount:post.likeCount})
                }
            }
            res.send("Like deleted")
        }
        else{
            post.likeCount =post.likeCount + 1; 
            await Post.findByIdAndUpdate(req.params.id,{likeCount:post.likeCount})
            await User.findByIdAndUpdate(req.user._id,{$push: {likes: {postId:req.params.id}}})
            res.send("Liked")      
        }
        
    } catch (e) {
        res.send("Something went wrong please try again!")
    }
})

module.exports = router;
