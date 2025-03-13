const mongoose=require('mongoose')
const bcrypt = require("bcryptjs"); 

const userSchema=new mongoose.Schema({
    
        name:{
            type: String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique: true,
            lowercase:true,
        },
        password:{
            type: String,
            required:true,
            minlength:8
        },

        confirmPassword:{
            type:String,
            required:true
        },
        profile:{
            skills:{
              type: [String],
              
              required: true   
            },
            causes:{
              type:[String],
              required: true 
            }
        }
})

userSchema.pre('save', async function(next){
    if(this.password !== this.confirmPassword){
        const err= new Error ('Passwords dont match!')
        return next(err);
    }
    

    if (!this.isModified('password')) return next();


    this.password= await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined; 
next();
})

const User= mongoose.model('User',userSchema);
module.exports= User;

/* 
// DELETE ALL USERS FROM DATABASE
(async () => {
  try {
    await User.deleteMany({});
    console.log("All users deleted successfully");
  } catch (err) {
    console.error("Error deleting users:", err);
  }
})();
*/


/* 
// CREATE A DUMMY USER 
(async () => {
  try {
    const dummyUser = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
      skills: ["JavaScript", "Node.js"],
      causes: ["Education", "Healthcare"]
    });

    await dummyUser.save();
    console.log("Dummy user created:", dummyUser);
  } catch (err) {
    console.error("Error creating dummy user:", err);
  }
})();
*/