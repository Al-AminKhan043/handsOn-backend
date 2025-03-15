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

}

module.exports={getAllPosts}