import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : '30d'}) 
}

const registerUser = async (req , res) => {

    const {name , email , phone , password , bio} = req.body

    //check if All fields are coming
    if(!name || !email || !phone || !password) {
        res.status(409)
        throw new Error('Please Fill All Details!!!')
    }

    //Check if user already exists
    let userNameExist = await User.findOne({name : name})
    let emailExist = await User.findOne({email : email})
    let phoneExist = await User.findOne({phone : phone})

    if(userNameExist || emailExist || phoneExist){
        res.status(409)
        throw new Error("User Already Exists!!")
    }


    //Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Register User with OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    let user = await User.create({
        name, 
        email, 
        phone, 
        password: hashedPassword, 
        bio,
        otp,
        otpExpires
    })

    if(!user){
        res.status(400)
        throw new Error("User Not Created")
    }

    try {
        const message = `Welcome to ImaginEx! Your verification code is: ${otp}. It expires in 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'ImaginEx - Account Verification',
            message: message
        });

        res.status(201).json({
            message: "OTP sent to your email. Please verify.",
            email: user.email
        })
    } catch (error) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500)
        throw new Error("Error sending email");
    }
}



const loginUser = async (req , res) => {
    const {email , password} = req.body

    //check if All fields are coming
    if(!email || !password) {
        res.status(409)
        throw new Error('Please Fill All Details!!!')
    }

    //Check if user exists
    let user = await User.findOne({email : email})

    if(user && await bcrypt.compare(password , user.password)){
        
        // Block if not verified
        if(!user.isVerified) {
            // Generate new OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            await user.save();
            
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'ImaginEx - Account Verification',
                    message: `Welcome back to ImaginEx! Your new verification code is: ${otp}. It expires in 10 minutes.`
                });
                res.status(403).json({ message: "Account not verified. A new OTP has been sent to your email.", email: user.email, unverified: true });
                return;
            } catch (error) {
                res.status(500);
                throw new Error("Could not send verification email");
            }
        }

        res.status(200).json({
            id : user._id,
            name : user.name,
            bio : user.bio,
            email : user.email,
            phone : user.phone,
            isAdmin : user.isAdmin,
            isActive : user.isActive,
            credits : user.credits,
            token : generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid Credentials")
    }
}

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if(!email || !otp) {
        res.status(400);
        throw new Error("Please provide email and OTP");
    }

    const user = await User.findOne({ email });

    if(!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if(user.isVerified) {
        res.status(400);
        throw new Error("User already verified");
    }

    if(user.otp !== otp || user.otpExpires < Date.now()) {
        res.status(400);
        throw new Error("Invalid or expired OTP");
    }

    // OTP is valid
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
        id : user._id,
        name : user.name,
        bio : user.bio,
        email : user.email,
        phone : user.phone,
        isAdmin : user.isAdmin,
        isActive : user.isActive,
        credits : user.credits,
        token : generateToken(user._id)
    });
}




// Protected Controller 
const privateController = (req , res) => {
    res.send("I am Private Controller " + req.user.name)
}







const authController = {registerUser , loginUser , verifyOTP, privateController}

export default authController