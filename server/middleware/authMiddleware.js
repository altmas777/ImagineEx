import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const forUser = async (req , res , next) => {
    try {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token , process.env.JWT_SECRET)
            const user = await User.findById(decoded.id).select("-password")
            if (!user) {
                res.status(401)
                return next(new Error('User not found'))
            }
            req.user = user
            next()       
        } else {
            res.status(401)
            next(new Error('No Token Found'))
        }
    } catch (error) {
        res.status(401)
        next(new Error('Unauthorised Access - Invalid Token'))
    }
}


const forAdmin = async (req , res , next) => {
    
    
    try {

        let token


        
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
            token = req.headers.authorization.split(" ")[1]
            let decoded = jwt.verify(token , process.env.JWT_SECRET)
            let user = await User.findById(decoded.id).select("-password")
            req.user = user
            req.user = user
            if(user.isAdmin){
            next() 
            }else{
            res.status(401)
            throw new Error('Unauthorised Access! Admin Only')  
            } 
    } else {
        res.status(401)
        throw new Error('No Token Found')
    }
    } catch (error) {
    res.status(401)
    throw new Error('unAuthorised Access')  
    }
}

const protect = {forUser , forAdmin}


export default protect