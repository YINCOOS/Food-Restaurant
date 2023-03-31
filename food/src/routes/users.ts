import express from "express";
import {getAllUsers, getSingleUser, Login, Register, resendOTP, updateProfile, verifyUser} from "../controller/usersController";
import { auth } from "../middleware/authorization";

const router = express.Router();

router.post('/signup', Register)
router.post('/verify/:signature', verifyUser)
router.post('/login', Login)
router.get('/resend-otp/:signature', resendOTP) //This is needed if only the user did not receive otp for verification
router.get('/get-all-users', getAllUsers)
router.get('/get-single-user', auth, getSingleUser)
router.patch('/update-profile', auth, updateProfile)




export default router;
