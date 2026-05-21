import User from "../models/userModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn : '30d'}) 
}

// In-memory store for pending registrations (OTP not yet verified)
// Key: email, Value: { name, email, phone, password (hashed), bio, otp, otpExpires }
const pendingRegistrations = new Map();

const registerUser = async (req , res) => {

    const {name , email , phone , password , bio} = req.body

    //check if All fields are coming
    if(!name || !email || !phone || !password) {
        res.status(409)
        throw new Error('Please Fill All Details!!!')
    }

    //Check if user already exists in DB
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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store registration data temporarily — DO NOT save to DB yet
    pendingRegistrations.set(email, {
        name,
        email,
        phone,
        password: hashedPassword,
        bio,
        otp,
        otpExpires
    });

    // Auto-cleanup after 10 minutes if not verified
    setTimeout(() => {
        if (pendingRegistrations.has(email)) {
            const pending = pendingRegistrations.get(email);
            if (pending.otpExpires < Date.now()) {
                pendingRegistrations.delete(email);
            }
        }
    }, 10 * 60 * 1000);

    try {
        const message = `Welcome to ImaginEx! Your verification code is: ${otp}. It expires in 10 minutes.`;
        await sendEmail({
            email: email,
            subject: 'ImaginEx - Account Verification',
            message: message
        });

        res.status(201).json({
            message: "OTP sent to your email. Please verify.",
            email: email
        })
    } catch (error) {
        // Remove from pending if email failed
        pendingRegistrations.delete(email);
        console.error("Register email error:", error.message);
        return res.status(500).json({
            message: "Email sending failed. Please try again in a moment."
        });
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

    // FIRST: Check if this is a pending new registration (not yet in DB)
    if (pendingRegistrations.has(email)) {
        const pending = pendingRegistrations.get(email);

        // Check OTP validity
        if (pending.otp !== otp || pending.otpExpires < Date.now()) {
            res.status(400);
            throw new Error("Invalid or expired OTP");
        }

        // OTP is valid — NOW create the user in the database
        const user = await User.create({
            name: pending.name,
            email: pending.email,
            phone: pending.phone,
            password: pending.password,
            bio: pending.bio,
            isVerified: true  // Already verified via OTP
        });

        // Remove from pending
        pendingRegistrations.delete(email);

        if (!user) {
            res.status(400);
            throw new Error("User Not Created");
        }

        return res.status(200).json({
            id: user._id,
            name: user.name,
            bio: user.bio,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            credits: user.credits,
            token: generateToken(user._id)
        });
    }

    // SECOND: Check if this is an existing unverified user (e.g. from login flow)
    const user = await User.findOne({ email });

    if(!user) {
        res.status(404);
        throw new Error("User not found. Please register first.");
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




const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide email");
    }

    // Check pending registrations first
    if (pendingRegistrations.has(email)) {
        const pending = pendingRegistrations.get(email);
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        pending.otp = newOtp;
        pending.otpExpires = Date.now() + 10 * 60 * 1000;
        pendingRegistrations.set(email, pending);

        try {
            await sendEmail({
                email,
                subject: 'ImaginEx - New Verification Code',
                message: `Your new verification code is: ${newOtp}. It expires in 10 minutes.`
            });
            return res.status(200).json({ message: "New OTP sent to your email.", email });
        } catch (error) {
            res.status(500);
            throw new Error("Error sending email");
        }
    }

    // Check existing unverified user
    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
        res.status(404);
        throw new Error("No pending verification found for this email.");
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
        await sendEmail({
            email,
            subject: 'ImaginEx - New Verification Code',
            message: `Your new verification code is: ${newOtp}. It expires in 10 minutes.`
        });
        return res.status(200).json({ message: "New OTP sent to your email.", email });
    } catch (error) {
        res.status(500);
        throw new Error("Error sending email");
    }
}


const authController = {registerUser , loginUser , verifyOTP, resendOTP, privateController}

export default authController