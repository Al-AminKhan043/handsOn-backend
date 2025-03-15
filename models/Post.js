const mongoose=require('mongoose');
const User= require('./User') 
const postSchema= new mongoose.Schema({
    title:{
     type: String,
     required:true
    },
    description:{
        type: String,
        required:true
    },
    level:{
        type: String,
        
        required:true
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{ timestamps: true }  
)

const Post = mongoose.model('Post',postSchema);

module.exports=Post;