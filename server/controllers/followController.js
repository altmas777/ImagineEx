import User from "../models/userModel.js"

const followUserRequest = async (req, res) => {
    let targetUser = await User.findById(req.params.uid)
    let currentUser = await User.findById(req.user._id)

    if (!targetUser || !currentUser) {
        res.status(404)
        throw new Error('User Not Found!!')
    }

    const isFollowed = targetUser.followers.some(
        (id) => id.toString() === currentUser._id.toString()
    );

    if (isFollowed) {
        res.status(409)
        throw new Error("Already Followed")
    }

    targetUser.followers.push(currentUser._id)
    await targetUser.save()

    currentUser.followings.push(targetUser._id)
    await currentUser.save()

    const { password: _pw, ...safeUser } = targetUser.toObject()
    res.status(200).json(safeUser)
}


const unfollowUserRequest = async (req, res) => {
    let targetUser = await User.findById(req.params.uid)
    let currentUser = await User.findById(req.user._id)

    if (!targetUser || !currentUser) {
        res.status(404)
        throw new Error('User Not Found!!')
    }

    const isFollowed = targetUser.followers.some(
        (id) => id.toString() === currentUser._id.toString()
    );

    if (!isFollowed) {
        res.status(409)
        throw new Error("Already unFollowed")
    }

    let updatedFollowerList = targetUser.followers.filter(follower => follower.toString() !== currentUser._id.toString())
    targetUser.followers = updatedFollowerList
    await targetUser.save()

    let updatedFollowingList = currentUser.followings.filter(follower => follower.toString() !== targetUser._id.toString())
    currentUser.followings = updatedFollowingList
    await currentUser.save()

    const { password: _pw, ...safeUser } = targetUser.toObject()
    res.status(200).json(safeUser)
}



const followController = { followUserRequest, unfollowUserRequest }

export default followController