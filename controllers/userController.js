const User=require('../models/User')

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
    res.status(201).json({message:'User registered successfully.'})
  }
  catch(err){
    res.status(500).json({ message: "Error creating user", error: err.message });
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
module.exports= {registerUser, getAllUsers};

