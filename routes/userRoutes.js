const express= require('express');
const {registerUser, getAllUsers, loginUser, logoutUser, getUserProfile, deleteUser,updateUser} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware');
const router=express.Router();


router.get('/', getAllUsers);
router.post('/signup',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/:id',protect,getUserProfile);
router.delete('/:id',protect,deleteUser);
router.put('/:id/edit',protect,updateUser)
module.exports=router;
