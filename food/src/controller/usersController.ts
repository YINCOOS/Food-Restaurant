import express, { Request, Response } from "express";
import {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  GenerateOTP,
  onRequestOTP,
  emailHtml,
  mailSent,
  GenerateSignature,
  verifySignature,
  loginSchema,
  validatePassword,
  updateSchema,
} from "../utils";
import { UserAttributes, UserInstance } from "../model/userModel";
import { v4 as uuid4 } from "uuid";
import { FromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, confirm_password } = req.body;

    const uuiduser = uuid4();

    const validateResult = registerSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    //generate salt
    const salt = await GenerateSalt();

    //generate password
    const userPassword = await GeneratePassword(password, salt);

    //Generate OTP
    const { otp, expiry } = GenerateOTP();

    //check if user exist
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;

    //create user
    if (!User) {
      let user = await UserInstance.create({
        id: uuiduser,
        email,
        password: userPassword,
        firstName: "",
        lastName: "",
        salt,
        address: "",
        phone,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role: "user",
      });
      //send OTP
      // await onRequestOTP(otp, phone);

      //send email
      const html = emailHtml(otp);
      await mailSent(FromAdminMail, email, userSubject, html);

      //check if user exist and is fully registered inordr to be issued an identity
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;

      //Generate a signature
      //This signature hide the user created details or showing them error message.
      //The below details are what would be generated with the message as response.
      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });
      //We return signature to the user to be used for authentication.
      return res.status(201).json({
        message: "User created successfully",
        signature,
        verified: User.verified,
      });
    }
    return res.status(400).json({ message: "User already exist" });

    console.log(userPassword);
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/signup",
    });
  }
};

//CREATE USER VERIFICATION

export const verifyUser = async (req: Request, res: Response) => {
  try {
    //get the user id from the signature (users/verify/id)
    //this means the frontend can attach the id of each user from the backend to the url
    const token = req.params.signature;
    //verify the signature
    const decode = await verifySignature(token);

    //check if the user exist/valid
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttributes;

    if (User) {
      const { otp } = req.body;
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        //update the user
        const updatedUser = (await UserInstance.update(
          {
            verified: true,
          },
          { where: { email: decode.email } }
        )) as unknown as UserAttributes;

        //Regenerate a new signature
        let signature = await GenerateSignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });
        if (updatedUser) {
          const User = (await UserInstance.findOne({
            where: { email: decode.email },
          })) as unknown as UserAttributes;
          return res.status(200).json({
            message: "New User verified successfully",
            signature,
            verified: User.verified,
          });
        }
      }
    }
    return res.status(400).json({ message: "Invalid User or OTP expired" });
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/verify",
    });
  }
};

//LOGIN USER
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //check if user exist
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;

    if (User.verified === true) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );

      if (validation) {
        //Regenerate a new signature
        let signature = await GenerateSignature({
          id: User.id,
          email: User.email,
          verified: User.verified,
        });
        return res.status(200).json({
          messgae: "you have successfully logged in",
          signature,
          email: User.email,
          verified: User.verified,
          role: User.role,
        });
      }
    }
    return res.status(400).json({
      Error: "Not a verified user or invalid password",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/login",
    });
  }
};

/**=================== Resend OTP ================== */
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as UserAttributes;

    if (User) {
      //Generate OTP
      const { otp, expiry } = GenerateOTP();
      const updatedUser = (await UserInstance.update(
        {
          otp,
          otp_expiry: expiry,
        },
        { where: { email: decode.email } }
      )) as unknown as UserAttributes;

      if (updatedUser) {
        const User = (await UserInstance.findOne({
          where: { email: decode.email },
        })) as unknown as UserAttributes;

        //send OTP TO USER
        await onRequestOTP(otp, User.phone);

        //send mail
        const html = emailHtml(otp);
        await mailSent(FromAdminMail, User.email, userSubject, html);
        return res.status(200).json({
          message: "OTP resent successfully",
        });
      }
    }
    return res.status(400).json({
      Error: "Error resending OTP",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/resend-otp:signature",
    });
  }
};

/**=================== USER PROFILE ================== */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit as number | undefined;
    const users = await UserInstance.findAndCountAll({
      limit: limit,
    });
    return res.status(200).json({
      message: "You have sucessfully retrieved all users",
      count: users.count,
      Users: users.rows,
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/get-all-users",
    });
  }
};

/**===============USER PROFILE (GET SINGLE USER BY HIS ID) =============== */
export const getSingleUser = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.User.id;

    //find the user by id
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;
    if (User) {
      return res.status(200).json({ User });
    }
    return res.json({
      message: "You have successfully retrieved a single user",
      User,
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/get-single-user",
    });
  }
};

/**===============USER PROFILE (UPDATE USER PROFILE) =============== */

export const updateProfile = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.User.id;
    const { firstName, lastName, address, phone } = req.body;
    //JOI VALIDATION
    const validateResult = updateSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    //check if it's a registered user
    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    //, if not a registered user throw error
    if (!User) {
      return res.status(400).json({
        Error: "You're not authorized to update this profile",
      });
    }

    //if user is registered, update the profile
    const updatedUser = (await UserInstance.update(
      {
        firstName,
        lastName,
        address,
        phone,
      },
      { where: { id: id } }
    )) as unknown as UserAttributes;

    //Give a repoonse to the newly updated user
    if (updatedUser) {
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;
      return res.status(200).json({
        message: "You have successfully updated your profile",
        User,
      });
    }
    return res.status(400).json({
      Error: "Error occur while updating your profile",
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/update-profile",
    });
  }
};