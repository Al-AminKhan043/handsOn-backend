const express= require('express');
const {registerUser, getAllUsers, loginUser, logoutUser, getUserProfile} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware');
const router=express.Router();


router.get('/', getAllUsers);
router.post('/signup',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/:id',getUserProfile);
module.exports=router;
