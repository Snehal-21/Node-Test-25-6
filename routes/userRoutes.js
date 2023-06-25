import express from "express";
import { addProduct, deleteProduct, generateToken, getProduct, getToken, login, register } from "../controllers/userControllers.js";
import { checkProduct, checks } from "../middlewares/authMiddlewares.js";

const router=express.Router();

router.post('/register',checks,register);
router.post('/login',login);
router.post('/generateToken',generateToken);
router.get('/getToken',getToken);
router.post('/addProduct',checkProduct,addProduct);
router.post('/getProduct',getProduct);
router.post('/deleteProduct',deleteProduct)

export default router;