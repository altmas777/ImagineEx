import express from "express"
import authController from "../controllers/authControllers.js"
import protect from "../middleware/authMiddleware.js"


const router = express.Router()

router.post("/register" , authController.registerUser)
router.post("/login" , authController.loginUser)
router.post("/verify", authController.verifyOTP)
router.post("/private" , protect.forUser , authController.privateController)

export default router