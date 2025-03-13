require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose')
const cors=require('cors')

const app=express();
app.use(express.json());
app.use(cors())


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

app.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`)
})