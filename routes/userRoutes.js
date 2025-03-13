const express= require('express');
const {registerUser, getAllUsers, loginUser} = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware');
const router=express.Router();


router.get('/', getAllUsers);
router.post('/signup',registerUser);
router.post('/login',loginUser);
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});
module.exports=router;
