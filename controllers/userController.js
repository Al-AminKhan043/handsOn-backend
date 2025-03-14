const User=require('../models/User')
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config();


const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES})
}

const registerUser=async (req,res)=>{
  try{
    const {name, email, password, confirmPassword, skills, causes}=req.body;
    if(password!==confirmPassword){
        return res.status(400).json({message:'Password dont match!'});
    }
    const existUser=await User.findOne({email});
    if(existUser){
        return res.status(400).json({ message: "User already exists" });
    }
    const NewUser= new User({name, email, password, skills, causes})
    await NewUser.save();
    const token= generateToken(NewUser._id);
    res.status(201).json({message:'User registered successfully.',token})
  }
  catch(err){
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
}

const loginUser= async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
             return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch=await user.comparePassword(password);
        if(! isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
 
        }
        const token = generateToken(user._id);
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email, skills: user.profile.skills, causes: user.profile.causes }
        }); 
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
}

const logoutUser= async (req,res)=>{

    try{
        res.cookie('jwt','',{
            httpOnly:true,
            expires: new Date(0)
        })
        res.status(200).json({message: 'User logged out successfully.'})
    }
    catch(err){
        res.status(500).json({message:'Error logging out', error: err.message})
    }
}

const getUserProfile= async (req,res)=>{
try{
    const userId = req.params.id.trim();
    const user= await User.findById(req.params.id).select('-password');
    if(!user){
        return res.status(404).json({message: 'User not found'})
    }
    res.status(200).json(user);
}
catch(err){
    res.status(500).json({message: 'Error fetching user profile.', error: err.message})
}
}

const getAllUsers= async(req,res)=>{
    try{
        const Users= await User.find();
        res.status(200).json(Users);
    }
    catch(err){
        res.status(500).json({message: "Error fetching users", error: err.message })
    }
}
module.exports= {registerUser, getAllUsers,loginUser,logoutUser,getUserProfile};

