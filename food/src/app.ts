import express, {Request, Response, NextFunction} from "express";
import logger from "morgan";
import cookieparser from "cookie-parser";
import userRouter from "./routes/users";
import indexRouter from "./routes/index";
import adminRouter from "./routes/Admin";
import vendorRouter from "./routes/vendor";
import cors from "cors";
import {db} from "./config/index";
// import vendorRouter from "./routes/vendor";

//sequelize connection
db.sync().then(() => {
    console.log("Database connected successfully");
}).catch(err=>{
    console.log(err);
})

const app = express();



app.use(express.json());
app.use(logger("dev"));
app.use(cookieparser());
app.use(cors());

//Router middleware
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/vendors', vendorRouter)
// app.use('/vendors', vendorRouter);
const port= 4100;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


export default app;