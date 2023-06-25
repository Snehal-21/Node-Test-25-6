import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import router from "./routes/userRoutes.js";

const app=express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/test',router);

mongoose.connect('mongodb+srv://Snehal:Snehal1234@mern-todo.va7rcii.mongodb.net/testDb?retryWrites=true&w=majority')
.then(()=>console.log('Db connected.'))
.catch((err)=>console.log('Db err=>',err));

app.listen(4000,()=>console.log("Working on PORT"));