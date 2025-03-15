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



const updatePost = async (req, res) => {
    const { id } = req.params; // ✅ Fix ID extraction
    const { title, description, level } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (post.postedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this post.' });
        }

        // Update fields if provided
        post.title = title || post.title;
        post.description = description || post.description;
        post.level = level || post.level;

        const updatedPost = await post.save(); // ✅ Fix saving method
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating post' });
    }
};


const deletePost = async (req, res) => {
    const { id } = req.params;  // Get the post ID from the URL
    const userId = req.user.id; // Get the logged-in user's ID from the request

    try {
        const post = await Post.findById(id);  // Find the post by ID

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the logged-in user is the one who posted it
        if (post.postedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post.' });
        }

        // Delete the post
        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting post.' });
    }
};



module.exports={getAllPosts,createPost,updatePost,deletePost}