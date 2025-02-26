const express=require("express");
require('dotenv').config();
const app=express();
const PORT=process.env.PORT||3000;
const cors=require("cors")
const login=require("./component/login")
const signin=require("./component/signin")
const connection=process.env.mongodb
const mongoose=require("mongoose");

mongoose.connect(connection).then(()=>console.log("mongodb connected successfully")).catch((err)=>{
    console.log(err);
});


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST' ,'PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use("/login",login);
app.listen(PORT , ()=>{
    console.log(`the app is listening to na server`);
})