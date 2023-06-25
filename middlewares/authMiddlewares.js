import Token from "../models/token.js";
import User from "../models/user.js";
import encrypt from "encryptjs";

export const checks = async (req, res, next) => {
    try {
        const { name, email, password, confirmpassword, role, pin, number } = req.body;
        if (!name) return res.send("Name is required.");
        if (!email) return res.send("Email is required.");
        if (!password) return res.send("Password is required.");
        if (!confirmpassword) return res.send("Confirm your password.");
        if (!role) return res.send("Role is required.");
        if (!pin) return res.send("Pin is required.");
        if (!number) return res.send("Number is required.");

        if (password <= 5 || confirmpassword <= 5) return res.send("password and confirm password should be more than or equal to 5 digits");

        if (password != confirmpassword) return res.send("password and confirm Password shooul be equal")

        next();
    } catch (error) {
        return res.send(error);
    }

}


export const checkProduct = async (req, res, next) => {
    try {
        const { email, password, pin } = req.body;
        if (!email) return res.send("email is required.");
        if (!password) return res.send("Password is required.");
        if (!pin) return res.send("Pin is required.");

        const response = await User.find({ email }).exec();
        if (!response) return res.send("User not found");
        const pass = "pin";
        const dpass = encrypt.decrypt(response[0].pin, pass, 256);
        const spin = "pin";
        const dpin = encrypt.decrypt(response[0].pin, spin, 256);
        if (dpass == password) {
            if (dpin == pin) {
                next();
            } else {
                return res.send("Incorrect pin.")
            }
        } else {
            return res.send("incoreect password")
        }
    } catch (error) {
        return res.send(error);
    }
}