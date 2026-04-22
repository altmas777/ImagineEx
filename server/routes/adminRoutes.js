import express from "express"
import adminController from "../controllers/adminController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/users" , protect.forAdmin , adminController.getAllUsers)
router.get("/posts" , protect.forAdmin , adminController.getAllPosts)
router.get("/reports" , protect.forAdmin , adminController.getReports)
router.put("/user/:uid" , protect.forAdmin , adminController.updateUser)
router.put("/post/:pid" , protect.forAdmin , adminController.updatePost)
router.delete("/post/:pid" , protect.forAdmin , adminController.deletePost)



export default router