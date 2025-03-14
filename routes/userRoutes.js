const express= require('express');
const {registerUser, getAllUsers, loginUser, logoutUser, getUserProfile, deleteUser,updateUser} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware');
const router=express.Router();


router.get('/', getAllUsers);
router.post('/signup',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/:id',getUserProfile);
router.delete('/:id',deleteUser);
router.put('/:id/edit',updateUser)
module.exports=router;
