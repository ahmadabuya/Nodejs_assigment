import express from 'express';
import { loginUser, registerUser } from "../controllers/AuthController.js";

const router = express.Router()

// router.get('/', async(req,res)=> {res.send("Auth Routh")})


router.post('/register', registerUser)
router.post('/login', loginUser)

export default router