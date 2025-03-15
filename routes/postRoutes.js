const express=require('express');
const {getAllPosts,createPost, updatePost}=require('../controllers/postController')
const router=express.Router();
const {protect}=require('../middlewares/authMiddleware');





router.get('/',getAllPosts);
router.post('/new',protect,createPost)
router.put('/:id',protect,updatePost)


module.exports=router;