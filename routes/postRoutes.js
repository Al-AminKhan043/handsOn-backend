const express=require('express');
const {getAllPosts,createPost}=require('../controllers/postController')
const router=express.Router();
const {protect}=require('../middlewares/authMiddleware');





router.get('/',getAllPosts);
router.post('/new',protect,createPost)


module.exports=router;