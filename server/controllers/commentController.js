import Comment from "../models/commentModel.js"
import Post from "../models/postModel.js"

const getComments = async (req , res) => {

    const postId = req.params.pid

    const comments = await Comment.find({ post: postId }).populate('user', 'name avatar')

    if (!comments) {
        res.status(404)
        throw new Error("Comments Not Found!")
    }

    res.status(200).json(comments)
}


const addComment = async (req , res) => {
    const { text } = req.body
    const postId = req.params.pid
    const userId = req.user._id


    const post = await Post.findById(postId)

    if (!post) {
        res.status(404)
        throw new Error("Post Not Found")
    }

    if (!text) {
        res.status(409)
        throw new Error("Please Enter Text")
    }

    const newComment = new Comment({
        post: postId,
        user: userId,
        text: text
    })

    await newComment.save()
    await newComment.populate('user')
    await newComment.populate('post')

    if (!newComment) {
        res.status(409)
        throw new Error("Comments Not Created!")
    }

    res.status(201).json(newComment)
}


const removeComment = async (req , res) => {

    try {
        const commentId = req.params.cid

        const comment = await Comment.findById(commentId)

        if (!comment) {
            res.status(404)
            throw new Error("Comment Not Found")
        }

        await Comment.findByIdAndDelete(commentId)

        res.status(200).json({
            _id: commentId,
            message: "Comment Deleted"
        })
    } catch (error) {
        res.status(409)
        throw new Error("Comment Not Removed")
    }
}


const commentController = {getComments , addComment , removeComment}

export default commentController