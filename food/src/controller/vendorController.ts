import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { VendorAttributes, VendorInstance } from "../model/vendorModel";
import {
  GenerateSignature,
  loginSchema,
  option,
  updateVendorSchema,
  validatePassword,
} from "../utils";
import { FoodAttributes, FoodInstance } from "../model/foodModel";
import { v4 as uuidv4 } from "uuid";
import vendor from "../routes/vendor";

/** ================= Vendor Login ===================== **/
export const vendorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // check if the vendor exist
    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttributes;

    if (Vendor) {
      const validation = await validatePassword(
        password,
        Vendor.password,
        Vendor.salt
      );
      console.log(validation)
      if (validation) {
        //Generate signature for vendor
        let signature = await GenerateSignature({
          id: Vendor.id,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable,
        });

        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable,
          role: Vendor.role,
        });
      }
    }
    return res.status(400).json({
      Error: "Wrong Username or password or not a verified vendor ",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/login",
    });
  }
};

/** ================= Vendor Add Food ===================== **/

export const createFood = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.vendor.id;
    const { name, description, category, foodType, readyTime, price, image} =
      req.body;

    // check if the vendor exist
    const Vendor = await VendorInstance.findOne({where: {id:id}}) as unknown as VendorAttributes;
    const foodid = uuidv4();
    if (Vendor) {
      const createfood = await FoodInstance.create({
        id: foodid,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        rating: 0,
        vendorId: id,
        image: req.file.path,     
      })as unknown as FoodAttributes;

      return res.status(201).json({
        message: "Food added successfully",
        createfood,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/create-food",
    });
  }
};


/** ================= Get Vendor profile===================== **/
//This endpoint is important because it allows a specific vendor to only have access to their unique dashboard (he can perform his CRUD operation on his dashboard)
export const VendorProfile = async(req: JwtPayload, res: Response)=>{
  try{
    const id = req.vendor.id;
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
      attributes:['id','email', 'name', 'restaurantName', 'phone', 'address', 'serviceAvailable', 'rating', 'role', "coverImage"], //The listed attributes are what to be shown to the vendor.
      include:[
        {
          model:FoodInstance,
          as:'food',
          attributes:['id','name','description','category','foodType','readyTime','price','rating','vendorId']//attributes are what you want the user to see on their dashboard.
        }
      ]
    })) as unknown as VendorAttributes;
    return res.status(200).json({
      Vendor
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/get-profile",
    })
  }
}


/** ================= Vendor Delete Food===================== **/
export const deleteFood =async(req:JwtPayload, res:Response)=>{
  try{
    const id = req.vendor.id
    const foodid= req.params.foodid

    // check if the vendor exist
    const Vendor = await VendorInstance.findOne({
      where: { id: id },
    }) as unknown as VendorAttributes;
    
    if (Vendor) {
        const deletedFood = await FoodInstance.destroy({where: {id: foodid}});

      return res.status(201).json({
        message: "Food successfully deleted",
        deletedFood
      });
    }

  }catch(err){
    res.sendStatus(500).json({
      Error: "Internal server Error",
      route: "/vendors/delete-food",
    })
  }
}

/**===============UPDATE VENDOR PROFILE =============== */

export const updateVendorProfile = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.vendor.id;
    const { name, address, phone, coverImage } = req.body;
    //JOI VALIDATION
    const validateResult = updateVendorSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if it's a registered user
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
    })) as unknown as VendorAttributes;

    //, if not a registered user throw error
    if (!Vendor) {
      return res.status(400).json({
        Error: "You're not authorized to update this profile",
      });
    }

    //if user is registered, update the profile
    const updatedVendor = (await VendorInstance.update(
      {
        name,
        phone,
        address,
        coverImage: req.file.path,
      },
      { where: { id: id } }
    )) as unknown as VendorAttributes;

    //Give a repoonse to the newly updated user
    if (updatedVendor) {
      const Vendor = (await VendorInstance.findOne({
        where: { id: id },
      })) as unknown as VendorAttributes;
      return res.status(200).json({
        message: "You have successfully updated your profile",
        Vendor,
      });
    }
    return res.status(400).json({
      Error: "Error occur while updating your profile",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/vendors/update-profile",
    });
  }
};


/**==============================GET ALL VENDOR========================== */
export const GetAllVendor = async(req: Request, res: Response)=>{
  try{
    const Vendor = await VendorInstance.findAndCountAll({})

    return res.status(200).json({
      vendor: Vendor.rows,
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/get-all-vendors",
    })
  }
}



/** ================= Get Food===================== **/
//This endpoint is important because it allows a specific vendor to only have access to their unique dashboard (he can perform his CRUD operation on his dashboard)
export const GetFoodByVendor = async(req: Request, res: Response)=>{
  try{
    const id = req.params.id;
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
      attributes:['id','email', 'name', 'restaurantName', 'phone', 'address', 'serviceAvailable', 'rating', 'role', "coverImage"], //The listed attributes are what to be shown to the vendor.
      include:[
        {
          model:FoodInstance,
          as:'food',
          attributes:['id','name','description','category','foodType','readyTime','price','rating','vendorId', 'image']//attributes are what you want the user to see on their dashboard.
        }
      ]
    })) as unknown as VendorAttributes;
    return res.status(200).json({
      Vendor
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/get-vendor-food/:id",
    })
  }
}
