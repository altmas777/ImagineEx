import express from "express"
import protect from "../middleware/authMiddleware.js"
import postController from "../controllers/postController.js"


import savePostController from "../controllers/savePostController.js"
import commentController from "../controllers/commentController.js"

const router = express.Router({mergeParams : true})

router.get("/preview" , postController.getPreviewPosts)
router.get("/" , protect.forUser , postController.getPosts)
router.post("/" , protect.forUser , postController.generateAndPost)
router.get("/:pid" , protect.forUser , postController.getPost)
router.put("/:pid" , protect.forUser , postController.likeAndUnlikePost)
router.post("/:pid/report" , protect.forUser , postController.reportPost)
router.delete("/:pid" , protect.forUser , postController.deletePost)



// Save Post Routes
router.post("/:pid/save" , protect.forUser, savePostController.savePost)

// Comment Post Routes
router.get("/:pid/comments" , protect.forUser, commentController.getComments)
router.post("/:pid/comments" , protect.forUser, commentController.addComment)
router.delete("/:pid/comments/:cid" , protect.forUser, commentController.removeComment)


export default router