import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name : {
        type : String , 
        unique : true,
        required : [true , "Pleaze Enter Your Name"],
    } ,
    email : {
        type : String , 
        required : [true , "Pleaze Enter Your Email"],
        unique : true
    } ,
    phone : {
        type : Number , 
        required : [true , "Pleaze Enter Your Phone Number"],
        unique : true
    } ,
    password : {
        type : String , 
        required : [true , "Pleaze Enter Your Password"],
    } ,
    avatar : {
        type : String ,
        default : "" ,
    } ,
    bio : {
        type : String , 
        required : [true , "Pleaze Enter Your Bio"],
    } ,
    followers :[
        {type : mongoose.Schema.Types.ObjectId,
        ref : 'User'}
    ],
    followings : [
        {type : mongoose.Schema.Types.ObjectId,
        ref : 'User'}
    ],
    isAdmin : {
        type : Boolean,
        default : false,
        required : true
    } ,
    isActive : {
        type : Boolean,
        default : true,
        required : true
    } ,
    credits : {
        type : Number ,
        default : 5 ,
        required : true
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    otp : {
        type : String
    },
    otpExpires : {
        type : Date
    }
} , {
    timestamps : true
})


const user = mongoose.model('User' , userSchema)

export default user