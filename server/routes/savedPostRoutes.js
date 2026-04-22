import express from "express"
import protect from "../middleware/authMiddleware.js"
import savePostController from "../controllers/savePostController.js"



const router = express.Router()


router.get("/", protect.forUser, savePostController.getSavePosts)
router.delete("/:pid", protect.forUser, savePostController.removeSavedPost)

export default router