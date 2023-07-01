
import Token from "../models/token.js";
import User from "../models/user.js";
import encrypt from "encryptjs";
import { CronJob } from "cron";
import Product from "../models/products.js";

let job = new CronJob(
    '* */4 * * *',
    () => {
        Token.updateOne({}, { $unset: { awdiztoken: 1 } })
    }
)
job.start();

export const register = async (req, res) => {
    try {
        const { name, email, passowrd, role, pin, number } = req.body;

        const response = await User.find({ email }).exec();
        if (response.lenght) return res.send("email already taken.");

        const secretpass = "pass";
        const encryptpass = encrypt.encrypt(passowrd, secretpass, 256);

        const secretpin = "pin";
        const encryptpin = encrypt.encrypt(pin, secretpin, 256);

        const user = new User({
            name,
            email,
            password: encryptpass,
            role,
            pin: encryptpin,
            number
        });

        await user.save();
        return res.send("USer registered Successfully.")
    } catch (error) {
        return res.send(error);
    }
}

export const login = async (req, res) => {
    try {
        // const { email, password } = req.body;
        // if (!email) return res.send("Email is required.");
        // if (!password) return res.send("PAssword is required.");

        // const response = await User.find({ email }).exec();
        // if (!response.length) return res.send("USer not found");
        // console.log(response);

        // let secretpass = "pass";
        // const decryptPass = encrypt.decrypt(response[0].password, secretpass, 256);
        // console.log(decryptPass);
        // if (decryptPass == password) {
        //     return res.send("Login Successful!");
        // }
        // else {
        //     return res.send("Incorrect passord!");
        // }

        const {email, password} = req.body;
        if(!email) return res.send("Email is required.");
        if(!password) return res.send("Password is required.");

        const user = await User.find({email}).exec();
        if(!user.length) return res.send("User not found.");

        let secretKeyPass = "pass";
        const decryptPass = encrypt.decrypt(user[0].password, secretKeyPass, 256);

        if(password !== decryptPass){
            return res.send("Incorrect credentials.");
        }
        return res.send("Logged in successfully.");
    } catch (error) {
        return res.send(error)
    }
}


export const generateToken = async (req, res) => {
    try {
        let random = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let charlength = characters.length;
        let length = 100;
        for (var i = 0; i < length; i++) {
            random += characters.charAt(Math.floor(Math.random(characters) * charlength));
        }

        //    const response=await Token.findOne({}).exec();
        //    console.log(response);
        //    if(response.lenght){
        //     response[0].awdiztoken=random;
        //     await Token.save();
        //     return res.send("Token has been updated successfully.")
        //    }
        //    console.log(random)
        const token = new Token({
            awdiztoken: random
        })
        await token.save();
        return res.send("Token has been gerated successfully.")
    } catch (error) {
        return res.send(error);
    }
}


export const getToken = async (req, res) => {
    try {
        const resposne = await Token.find({}).exec();

        return res.send(resposne[0].awdiztoken);
    } catch (error) {
        return res.send(error);
    }
}

export const addProduct = async (req, res) => {
    try {
        const { awdiztoken, p_name, p_price, p_category, p_color, email } = req.body;
        if (!awdiztoken) return res.send("Token is required to add the products");
        const user = await User.find({ email }).exec();
        if (user[0].role == "buyer") return res.send("Buyer cannot add the products");

        const product = new Product({
            p_name,
            p_price,
            p_category,
            p_color
        });
        await product.save();
        return res.send("Product added successfully.")
    } catch (error) {
        return res.send(error);
    }
}

export const getProduct = async (req, res) => {
    try {
        const { awdiztoken, email } = req.body;
        if (!awdiztoken) return res.send("Token is required to add the products");
        const user = await User.find({ email }).exec();
        if (!user.length) return res.send("User not found")

        if (user[0].role != "seller") {
            const productList = await Product.find({}).exec();

            return res.send(productList);
        } else {
            return res.send("You are not allowed to acess the products")
        }
    } catch (error) {
        return res.send(error);
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { awdiztoken, email, product_id } = req.body;
        if (!awdiztoken) return res.send("Token is required to delete the product.");
        if (!email) return res.send("Email is required");

        const user = await User.find({ email }).exec();
        if (!user.length) return res.send("USer not found");

        if (user[0].role == "admin") {
            const product = await Product.deleteOne({ _id: product_id }).exec();
            // await product.save();
            return res.send("product deleted successfully.")
        } else {
            return res.send("Registered as a admin to deletes the product.")
        }
    } catch (error) {
        return res.send(error);
    }
}