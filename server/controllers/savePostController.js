import Post from "../models/postModel.js"
import Saved from "../models/savedPostModel.js"

// Save Post
const savePost = async (req, res) => {

    const userId = req.user._id
    const postId = req.params.pid

    // Check if posts exists
    const post = await Post.findById(postId)

    if (!post) {
        res.status(404)
        throw new Error("Post Not Found!")
    }

    // Check if post is already saved
    const saveExists = await Saved.findOne({ user: userId })

    if (saveExists) {
        res.status(409)
        throw new Error("Post Already Saved!")
    }


    // Create Save Post
    const savedPost = new Saved({
        user: userId,
        post: postId
    })

    await savedPost.save()
    await savedPost.populate('post')


    if (!savedPost) {
        res.status(409)
        throw new Error("Post Not Saved!")
    }

    res.status(201).json(savedPost)

}

//Get Save Posts
const getSavePosts = async (req, res) => {

    const userId = req.user._id

    const allMySavedPosts = await Saved.find({ user: userId }).populate('post')

    if (!allMySavedPosts) {
        res.status(404)
        throw new Error("Saved Posts Not Found!")
    }

    res.status(200).json(allMySavedPosts)

}

// Delete Saved Posts
const removeSavedPost = async (req, res) => {

    await Saved.findOneAndDelete(req.params.pid)
    res.status(200).json({
        _id: req.params.pid,
        msg: "Saved Post Removed"
    })

}




const savePostController = { savePost, getSavePosts, removeSavedPost }

export default savePostController