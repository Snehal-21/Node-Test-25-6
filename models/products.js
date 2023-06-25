import mongoose from "mongoose";
import { Schema } from "mongoose";

const product = new Schema({
    p_name: String,
    p_price: String,
    p_categosry: String,
    p_color: String
});

export default mongoose.model("Product", product);