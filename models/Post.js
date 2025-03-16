const mongoose=require('mongoose');
const User= require('./User')
const Comment=require('./Comment') 
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
    
        comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    ,
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{ timestamps: true }  
)

const Post = mongoose.model('Post',postSchema);

module.exports=Post;