const Post= require('../models/Post')
const User=require('../models/User')

const getAllPosts= async(req,res)=>{
    try{
        const posts= await Post.find().populate('postedBy','name');
        res.status(200).json(posts);
    }
    catch(err){
     console.log(err);
     res.status(500).json({message: 'Error retrieving posts'});
    }
}

const createPost= async(req,res)=>{
const {title,description,level}=req.body;
const userId=req.user.id;
try{
    const newPost= new Post({
        title,
        description,
        level,
        postedBy:userId
    })
    const savedPost= await newPost.save();
    res.status(201).json(savedPost);
}
catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error creating post' });
}
}

module.exports={getAllPosts,createPost}