import express from "express";
import {authVendor} from '../middleware/authorization'
import {createFood, deleteFood, updateVendorProfile, vendorLogin, VendorProfile, GetAllVendor, GetFoodByVendor } from "../controller/vendorController";
import { upload } from "../utils/multer";


const router = express.Router();
router.post('/login',vendorLogin)
router.post('/create-food',authVendor,  upload.single('image'), createFood)
router.get('/get-profile',authVendor, VendorProfile)
router.delete('/delete-food/:foodid',authVendor,deleteFood)
router.patch('/update-profile', authVendor, upload.single('coverImage'),  updateVendorProfile)
router.get('/get-all-vendors', GetAllVendor)
router.get('/get-vendor-food/:id', GetFoodByVendor)



export default router;

//upload.single('image'),
//upload.single('coverImage'),