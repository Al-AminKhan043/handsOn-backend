const express=require('express');
const {getAllPosts,createPost, updatePost,deletePost}=require('../controllers/postController')
const router=express.Router();
const {protect}=require('../middlewares/authMiddleware');





router.get('/',getAllPosts);
router.post('/new',protect,createPost)
router.put('/:id/edit',protect,updatePost)
router.delete('/:id',protect,deletePost);

module.exports=router;