import User from "../models/userModel.js"
import Post from "../models/postModel.js"

const getMyFollowers = async (req , res) => {

    const user = await User.findById(req.user.id).populate('followers')

    if(!user){
        res.status(404)
        throw new Error("User Not found")
    }

    res.status(200).json(user.followers)
}

const getProfile = async (req , res) => {


    const { name } = req.params


    const user = await User.findOne({name :  name }).populate('followers').populate('followings')
    const posts = await Post.find({user : user._id})

    if(!user || !posts){
        res.status(404)
        throw new Error("User Not found , Posts Not Found")
    }

    const profile = {
        _id : user._id,
        name : user.name,
        email : user.email,
        bio : user.bio,
        followers : user.followers,
        followings : user.followings,
        credits : user.credits,
        posts : posts, 
        createdAt : user.createdAt 
    }

    res.status(200).json(profile)
}

const getMyFollowings = async (req , res) => {
    const user = await User.findById(req.user.id).populate('followings')

    if(!user){
        res.status(404)
        throw new Error("User Not found")
    }

    res.status(200).json(user.followings)
}


const profileController = {getMyFollowers , getMyFollowings , getProfile}


export default profileController