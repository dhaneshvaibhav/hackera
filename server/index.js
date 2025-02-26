const express=require("express");
require('dotenv').config();

const app=express();
const PORT=process.env.port||3000;
const cors=require("cors")





app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST' ,'PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.listen(PORT , ()=>{
    console.log(`the app is listening to ${PORT} server`);
})