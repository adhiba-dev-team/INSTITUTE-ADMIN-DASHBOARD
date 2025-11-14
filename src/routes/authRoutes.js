import express from 'express';
import { login, signup } from '../controllers/authController.js';
import multer from 'multer';


const router = express.Router();
const upload = multer();

// Single API for signup and login
router.post("/signup", upload.none(), signup);

// Single API for login
router.post("/login", upload.none(), login);



export default router;
