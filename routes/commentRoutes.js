const express=require('express')
const {postComment,deleteComment,getAllComment,editComment}=require('../controllers/commnetController')
const {protect}=require('../middlewares/authMiddleware');

const router=express.Router();

router.get('/:postId',getAllComment);
router.post('/:postId',protect,postComment);
router.put('/:commentId',protect,editComment)
router.delete('/:commentId',protect,deleteComment);


module.exports=router;
