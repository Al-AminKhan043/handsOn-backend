const Comment=require('../models/Comment');
const Post= require('../models/Post')

const postComment= async(req,res)=>{
    const userId=req.user.id;
    const {text}=req.body;
    const {postId}=req.params;

    try{
        const postExist= await Post.findById(postId);
        if(!postExist){
           return res.status(404).json({message:'Post not found.'})
        }
        const newComment= new Comment ({
            text,
            postedBy: userId,
            post: postId
        });
        const savedComment= await newComment.save();
        res.status(201).json(savedComment)
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'Error posting comment.'})
    }
}


const deleteComment= async(req,res)=>{
    const {commentId}=req.params;
    const userId= req.user.id;

    try{
        const comment= await Comment.findById(commentId);
        if(!comment){
           return res.status(404).json({message:'Comment no found.'})
        }
        if(comment.postedBy.toString()!== userId){
          return  res.status(403).json({message:'Unauthorized to delete this comment.'})
        }
        await Comment.deleteOne({_id:commentId});
        res.status(200).json({message:'Comment successfully deleted.'})
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting comment." });
    }
}

const getAllComment= async(req,res)=>{
    const {postId}= req.params;
    try{
        const comments= await Comment.find({post:postId}).populate('postedBy','name')
        res.status(200).json(comments);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving comments." });
    }
}

const editComment=async(req,res)=>{
    const {commentId}=req.params;
    const {text}=req.body;
    const userId=req.user.id;
    try{
        const comment= await Comment.findById(commentId);
        if(!comment){
          return  res.status(404).json({message:'Comment not found.'})
        }
        if(comment.postedBy.toString()!==userId){
          return res.status(403).json({message:'Unauthorized to delete this comment.'})
        }
        comment.text= text || comment.text;
        const updatedComment= await comment.save();
        res.status(200).json(updatedComment);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error editing comment." });
    }

}


module.exports={postComment,deleteComment,getAllComment,editComment}