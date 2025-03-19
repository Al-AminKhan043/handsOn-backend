require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose')
const cors=require('cors')
const helmet=require('helmet');
const rateLimit = require("express-rate-limit");
const mongoSanitize=require('express-mongo-sanitize');
const userRoutes=require('./routes/userRoutes');
const postRoutes=require('./routes/postRoutes')
const commentRoutes=require('./routes/commentRoutes');
const eventRoutes=require('./routes/eventRoute')

const app=express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(helmet());
app.use(mongoSanitize());
const limiter= rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
})
app.use(limiter);

const PORT=process.env.PORT;
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

app.get('/',(req,res)=>{
    res.send('HandsOn running')
})

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/events',eventRoutes);

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})