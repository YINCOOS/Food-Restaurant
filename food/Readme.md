### Set up -Done

## MVC Architecture - Done
the route welcome the controller and controller takes care of buisiness logic

## DB configuration -
we need 2 packages to set up our database
1. Sequelize = yarn add sequelize
2. sqlite3= yarn add sqlite3
create a database config folder inside the src, inside it create an index.ts 
on your own, learn how to use prisma, mongoose database. currently this project is running on sequelize.

## MVC modelling (How our users communicate with the database)
create a model folder inside the src, create a user model in side the model folder
USE a package called "uuid" (it's a unique generated id for all users without conflicting each other) = yarn add uuid4
you can't create a model without an interface
sorting is necessary cos it helps to strengthen our database security. Ensure the sort you're using is not too much for the app to decode to permit your users to have access to their data. As much as sort helps to encrypt your user password.
Ensure to gothrough evdry UI design before proceeding to writing the backend code.

You have to extend model in order to be able to create a model

## Helper function Joi Validation, Password Hashing, salt etc
we create a folder called utils, housing all our helper function (utilities)
inside it create utility.ts file
install joi dependency = "yarn add joi" to validate the user
install bcrypt dependency = "yarn add bcrypt" for password hashing
install json web-token = "yarn add jsonwebtoken" to generate every user a unique token and when the user leaves the app the token generatred expired

Create a schema for the user inside the utility.ts file

To use confirm password, you have to reference the previously entered email using joi.ref("password") or joi.any.equal(joi.ref)("password")
    confirm_password:Joi.equal(Joi.ref('password')).required().label('confirm password').messages({'any.only':'{{#label}}do not match'})


having done with your validation,

install sqlite explorer and sqltools extension in the market option on your vscode

## Hashing password using bcrypt
import bcrrypt from "bcrypt" inside the utility file (install the bcrypt type yarn add -D @types/bcrypt)

## //notification

write a javascript code to generate a random otp number then export it.

create a new file in the utils folder called index.ts to house both utility and notification data in order to be reusable. 
while importing data in the notification and the utility file, ensure to create an index folder to hold everything inside the notification and the utility folder (import both utility and notification data inside it)to be anble to be called anywhere it's needed. (the index file takes the root of utils folder)

Bring in your generated otp inside your userController cos that's where it's needed

export your userinstance and import it inside userController in order to be able to check if a user already exist via our already designed model.

in Es6, you often do not need key value pair cos it's been taken care of (e.g email:email is not necessary)

## HOW A USER RECEIVE THE TOKEN GENERATED OTP TO BE VERIFIED
We will be installing a package called "yarn add twilio "

visit there website and register, generate your trial phone number, then copy and paste your SID, PHONE NUMBER AND AUTHTOKEN inside env file then import it inside index.ts of config folder, then export it back to the notification.ts

yarn add nodemailer

an admin email (customized email) should be added to your .env

## SMTP SERVICE
for testing prupose we use nodemailer

DTO: DATA TRANSFER OBJECT (THIS WORKS LIKE AN INSTRUCTION THAT FOLLOWS THE PATTERN YOU'VE SET FOR YOUR CODE TO FOLLOW)

how to verify user

## USED WEBSITE
1. Nodemailer
2. Twilio
3. 


Request.params (this means anything after /: is the ID of the user)


we use jwt.verify to verify if a user is verified 

Learn about bcrypt.compare


## Limit and off-set while using .finAndCountAll data (using search query param)
This is used to get either the total user or  targeting a specific number of users (the thing that comes after the question mark)to be displayed on the frontend or where it's needful (giving your frontend guy the functionality to pargination)

## request.query can be used for sorting, searching by, 

to limit the number of users/products/service to be displayed on a page (pass it inside findAndCOuntAll or findAll)
e.g http://localhost:4100/users/get-all-users?limit=1


## getAllUser endpoint is for the backend usage to know details about the users on the plarform

## getSingleUser endpoint enable each user to have access to their own profile without conflicting other users

middleware is use to protect a route
a getSingleuser route should be protected always, enabling only logged in user to have access to their details (create an authorization middleware to protet the route using request.header.authorization to identify who is performing a particular operation)

on login the browser automaticaly set an authorization  header with the help of a cookie to retain the user details dduring an active session.

To a


## CREATING VENDOR MODEL

## HOW TO SAVE IMAGE TO THE CLOUD


## While testing your backend API Add the following dependencies
yarn add jest
yarn add supertest
yarn add ts-jest (for typescript API)


While testing, We have before all (before the commencing the testing, what do you want to do?), After All ()

Before all, connect to database

Mongodb memory server