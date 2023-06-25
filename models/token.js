import mongoose from "mongoose";
import {Schema} from "mongoose";

const token=new Schema({
    awdiztoken:{
        type:String,
        required:true,
        unique:true
    }
});

export default mongoose.model("Token",token);