import fetch from "node-fetch";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import uploadToCloudinary, { deleteFromCloudinary } from "../middleware/cloudinaryMiddleware.js";
import Post from "../models/postModel.js";
import crypto from "crypto";
import User from "../models/userModel.js";
import Report from "../models/reportModel.js"



const __dirname = path.dirname(fileURLToPath(import.meta.url))


const generateAndPost = async (req, res) => {

  let userId = req.user.id
  let newPost

  // Check if user Exist
  const user = await User.findById(userId)

  if (!user) {
    res.status(404)
    throw new Error("User Not Dound !!")
  }

  // Check if user have enough credits 
  if (user.credits < 1) {
    res.status(409)
    throw new Error("Not Enough Credits!")
  }


  try {
    // Get Prompt
    const { prompt } = req.body

    // Check If Prompt Is Coming In Body
    if (!prompt) {
      res.status(409)
      throw new Error("Kindly Provide Prompt To Generate Image")
    }



    // Build Pollinations AI URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&model=flux`

    // Fetch image as buffer
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Pollinations API error: ${imageResponse.status}`)
    }
    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save Locally
    const filename = crypto.randomUUID() + ".png"
    const filePath = path.join(__dirname, "../generated-content", filename)
    // Write File Into Server
    fs.writeFileSync(filePath, buffer)

    // Upload to Cloudinary
    const imageLink = await uploadToCloudinary(filePath)

    // Remove Image From Server
    fs.unlinkSync(filePath)

    // Create Post
    newPost = new Post({
      user: userId,
      imageLink: imageLink.secure_url,
      Prompt: prompt  // capital P to match postModel schema
    })

    //Save Post To DB
    await newPost.save()
    //Aggregate user Details in newPost Object
    await newPost.populate('user')


    //Update Credits 
    await User.findByIdAndUpdate(user._id, { credits: user.credits - 1 }, { new: true })


    res.status(201).json(newPost)


  } catch (error) {
    console.error(error);
    res.status(409).json({ message: "Post Not Created: " + (error.message || "Unknown Error") });
  }
}


const getPosts = async (req, res) => {
  const posts = await Post.find({ isPublished: { $ne: false } }).populate('user').sort({ createdAt: -1 })

  if (!posts) {
    res.status(404)
    throw new Error("Posts Not Found")
  }

  res.status(201).json(posts)

}


const getPreviewPosts = async (req, res) => {
  const posts = await Post.find({ isPublished: { $ne: false } })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(8)

  res.status(200).json(posts)
}


const getPost = async (req, res) => {
  const post = await Post.findById(req.params.pid).populate('user')

  if (!post) {
    res.status(404)
    throw new Error("Posts Not Found")
  }

  res.status(201).json(post)

}


const likeAndUnlikePost = async (req, res) => {

  let currentUser = await User.findById(req.user._id)


  //Check if user exists
  if (!currentUser) {
    res.status(404)
    throw new Error('User Not Found')
  }


  //Check If Post Exist
  const post = await Post.findById(req.params.pid).populate('user')

  if (!post) {
    res.status(404)
    throw new Error("Posts Not Found")
  }


  // Check if already liked
  const isLiked = post.likes.some(id => id.toString() === currentUser._id.toString());

  if (isLiked) {
    // Dislike
    // Remove Follower from likes
    let updatedLikesList = post.likes.filter(like => like.toString() !== currentUser._id.toString())
    post.likes = updatedLikesList
    await post.save()
  } else {
    // Like
    // Add Follower in Liked
    post.likes.push(currentUser._id)
    await post.save()
  }

  // Populate after save using the Post model directly
  await Post.populate(post, { path: 'likes' })

  res.status(200).json(post)



}


const reportPost = async (req, res) => {


  const { text } = req.body
  const postId = req.params.pid
  const userId = req.user._id

  if (!text) {
    res.status(409)
    throw new Error("Please Enter Text")
  }


  const newReport = new Report({
    user: userId,
    post: postId,
    text: text,
  })

  await newReport.save()
  await newReport.populate('user')
  await newReport.populate('post')

  if (!newReport) {
    res.status(409)
    throw new Error("Unable To Reports This Post")
  }

  res.status(200).json(newReport)

}




const deletePost = async (req, res) => {
  const postId = req.params.pid;
  const post = await Post.findById(postId);
  
  if (!post) {
      res.status(404);
      throw new Error("Post Not Found");
  }

  if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to delete this post");
  }

  const imageUrl = post.imageLink || post.imageUrl || post.image;
  if (imageUrl) {
      await deleteFromCloudinary(imageUrl);
  }

  await Post.findByIdAndDelete(postId);
  
  res.status(200).json({ id: postId, message: "Post deleted" });
}

const postController = { generateAndPost, getPosts, getPreviewPosts, getPost, likeAndUnlikePost, reportPost, deletePost }



export default postController


