const express=require('express');
const {getAllPosts}=require('../controllers/postController')
const router=express.Router();
const {protect}=require('../middlewares/authMiddleware');





router.get('/',getAllPosts);



module.exports=router;