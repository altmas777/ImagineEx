import express from "express"
import followController from "../controllers/followController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()



router.put("/follow/:uid" , protect.forUser , followController.followUserRequest)
router.put("/unfollow/:uid" , protect.forUser , followController.unfollowUserRequest)



export default router