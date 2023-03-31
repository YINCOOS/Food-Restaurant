import {Sequelize} from 'Sequelize'
import dotenv from 'dotenv'

dotenv.config()

//CONNECTING YOUR DATABASE
export const db = new Sequelize('app', '', '', {
    storage: './food.sqlite',
    dialect:"sqlite",
    logging: false
})

//SENDING OTP TO PHONE
export const accountSid = process.env.ACCOUNTSID;
export const authToken = process.env.AUTHTOKEN
export const fromAdminPhone = process.env.FROMADMINPHONE

//SENDING OTP TO EMAIL
export const GMAIL_USER =process.env.Gmail
export const GMAIL_PASS =process.env.GmailPass
export const FromAdminMail=process.env.FromAdminMail as string
export const userSubject=process.env.userSubject as string
export const APP_SECRET = process.env.APP_SECRET as string
