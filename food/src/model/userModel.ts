import {DataTypes, Model} from 'Sequelize';
import {db} from '../config/index';

export interface UserAttributes {
    id: string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    salt:string;
    address:string;
    phone:string;
    otp:number;
    otp_expiry:Date;
    lng:number;
    lat:number;
    verified:boolean;
    role:string;
    
}

export class UserInstance extends Model<UserAttributes>{}


UserInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull:{
                msg:"Email is required"
            },
            isEmail:{
                msg:"Provide a valid email"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"Password is required"
            },
            notEmpty:{
                msg:"Password is required"
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull:true    
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull:true    
    },
    salt: {
       type:   DataTypes.STRING,
        allowNull:false
    },
    address: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"Phonenumber is required"
            },
            notEmpty:{
                msg:"Provide a phone number"
            }
        }
    },
    otp: {
        type: DataTypes.NUMBER,
        allowNull:false,
        validate:{
            notNull:{
                msg:"OTP is required"
            },
            notEmpty:{
                msg:"Provide an OTP"
            }
        }
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull:false,
        validate:{
            notNull:{
                msg:"OTP has expired"
            },    
        }
    },
    lng: {
        type: DataTypes.NUMBER,
        allowNull:true,
    },
    lat: {
        type: DataTypes.NUMBER,
        allowNull:true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        validate:{
            notNull:{
                msg:"Must be a verified user"
            },
            notEmpty:{
                msg:"Not a verified user"
            }
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull:true,
    }
},

{
    sequelize:db,
    tableName:"users"
});