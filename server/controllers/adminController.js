import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import Report from "../models/reportModel.js"
import { deleteFromCloudinary } from "../middleware/cloudinaryMiddleware.js"

const getAllUsers = async (req , res) => {
    
    const users = await User.find()

    if(!users){
        res.status(404)
        throw new Error("Users Not Found!!")
    }

    res.status(201).json(users)

}


const getAllPosts = async (req , res) => {
    const posts = await Post.find().populate('user', 'name email avatar')

    if(!posts){
        res.status(404)
        throw new Error("Posts Not Found")
    }

    res.status(200).json(posts)
}


const deletePost = async (req , res) => {
    let postId = req.params.pid

    const post = await Post.findById(postId)

    if(!post){
        res.status(404)
        throw new Error('Post Not Found')
    }

    const imageUrl = post.imageLink || post.imageUrl || post.image;
    if (imageUrl) {
        await deleteFromCloudinary(imageUrl);
    }

    await Post.findByIdAndDelete(postId)

    res.status(200).json({ message: 'Post deleted successfully', _id: postId })
}


const updatePost = async (req , res) => {
     let postId = req.params.pid 

    const post = await Post.findById(postId)

    if(!post){
        res.status(404)
        throw new Error('Post Not Found')
    }

    let updatedPost = await Post.findByIdAndUpdate(postId , req.body , {new : true} )


    if(!updatedPost){
        res.status(404)
        throw new Error('Post Not Updated')
    }

    res.status(200).json(updatedPost)
}


const getReports = async (req , res) => {
    const reports = await Report.find()

    if(!reports){
        res.status(404)
        throw new Error("Reports Not Found")
    }

    res.status(200).json(reports)
}


const updateUser = async (req , res) => {
    
    let userId = req.params.uid 

    const user = await User.findById(userId)

    if(!user){
        res.status(404)
        throw new Error('User Not Found')
    }

    // Build update object from request body — supports isAdmin, isActive, credits
    const updates = {}
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive
    if (req.body.isAdmin !== undefined) updates.isAdmin = req.body.isAdmin
    if (req.body.credits !== undefined) updates.credits = Number(req.body.credits)

    // If no body provided, default to toggling isActive
    if (Object.keys(updates).length === 0) {
        updates.isActive = !user.isActive
    }

    let updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true })

    if(!updatedUser){
        res.status(404)
        throw new Error('User Not Updated')
    }

    res.status(200).json(updatedUser)
}





const adminController = {getAllUsers , getAllPosts , updatePost , deletePost , getReports , updateUser}


export default adminController