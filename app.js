require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose')
const cors=require('cors')
const helmet=require('helmet');
const xss=require('xss-clean');
const mongoSanitize=require('express-mongo-sanitize');
const userRoutes=require('./routes/userRoutes');
const postRoutes=require('./routes/postRoutes')
const commentRoutes=require('./routes/commentRoutes');
const eventRoutes=require('./routes/eventRoute')

const app=express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',  
  'https://hands-on-app.vercel.app', 
  'https://hands-on-ixnutyu7v-al-amin-khans-projects-58808c94.vercel.app', 
];

app.use(cors({
  origin: allowedOrigins, 
  credentials: true,
}));

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());


const PORT = process.env.PORT || 5000;
const MONGO_URL=process.env.MONGO_URL;

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB Connected Successfully");
      } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
      }
    }



app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/events',eventRoutes);

app.use((req,res)=>{
  res.status(404).json({success: false, message:'Route not found.'})
  
})

app.use((err, req, res, next) => {
  console.error("💥 Error:", err);
  res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Something went wrong on the server',
  });
});

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})