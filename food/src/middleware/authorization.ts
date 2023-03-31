import {NextFunction, Request, Response} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {APP_SECRET} from "../config";
import { UserAttributes, UserInstance } from "../model/userModel";
import { VendorAttributes, VendorInstance } from '../model/vendorModel'

export const auth = async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try {
        const authorization = req.headers.authorization;

        if(!authorization){
            return res.status(401).json({
                Error: "Unauthorized Request, please login"
            })
        }
        //Bearer uygyftyubvvtv
        const token = authorization.slice(7, authorization.length);
        let verified = jwt.verify(token, APP_SECRET) //as jwt.JwtPayload;

        if(!verified){
            return res.status(401).json({
                Error: "Unauthorized Request, please login"
            })
        }

        const {id} = verified as {[key:string]:string};
        const User = (await UserInstance.findOne({
            where: { id:id },
          })) as unknown as UserAttributes;

          if(!User){
            return res.status(401).json({
                Error: "Invalid Credential, please check your email and password"
            })
          }
          req.User = verified;
          next();

    }catch(err){
        res.status(401).json({
            Error: "unauthorized",
          });
    }

}


/** ================= Vendor Authentication ===================== **/
export const authVendor = async(req:JwtPayload , res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
    
        if(!authorization){
            return res.status(401).json({
                Error:"Kindly login"
            })
        }
       // Bearer erryyyygccffxfx
       const token = authorization.slice(7, authorization.length);
        let verified = jwt.verify(token,APP_SECRET) 
    
        if(!verified){
            return res.status(401).json({
                Error:"unauthorised"
            })
        }
       
      
        const {id} = verified as {[key:string]:string}
    
         // find the vendor by id
         const vendor = (await VendorInstance.findOne({
            where: { id: id},
          })) as unknown as VendorAttributes;
    
         if(!vendor){
            return res.status(401).json({
                Error:"Invalid Credentials"
            })
         } 
    
       req.vendor = verified;
       next()
    }catch(err){
        return res.status(401).json({
            Error:"unauthorised"
        })
    }
    }