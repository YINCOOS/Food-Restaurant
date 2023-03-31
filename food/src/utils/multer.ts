//this is the configursation for multer to upload images
//needed to upload files and storing the image in any format you want (jpeg, png, etc)
//install yarn add cloudinary multer multer-storage-cloudinary
//install yarn add -D @types/multer @types/multer-storage-cloudinary

import multer from "multer";

const cloudinary = require('cloudinary').v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
 

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
 })

 const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file) =>{
        return {
            folder: 'food',
            // allowed_formats:['jpg, png, jpeg'],
            // unique_filename: true,
        }
       
    },
 })

export const upload = multer({storage:storage})

//the upload variabel will now be used as a middleware in the controller (update route) to upload images

//if you want to upload multiple images, you have to use the upload.array('images', 5) middleware
