import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, followUser, unfollowUser, optimisticFollow, optimisticUnfollow } from "../redux/slices/profileSlice";
import { UserPlus, UserCheck, Heart, Bookmark, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { toggleLike } from "../redux/slices/postSlice";
import { savePost } from "../redux/slices/savedPostSlice";

export function ProfilePage() {
  const { username } = useParams();
  const dispatch = useDispatch();
  
  const { currentProfile, isLoading } = useSelector((state) => state.profile);
  const { user: currentUser } = useSelector((state) => state.auth);

  const decodedUsername = decodeURIComponent(username || '');
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    if(decodedUsername) {
      dispatch(fetchProfile(decodedUsername));
    }
  }, [dispatch, decodedUsername]);

  if (isLoading || !currentProfile) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#EC4899] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isMe = currentUserId && currentProfile._id && currentUserId.toString() === currentProfile._id.toString();

  const isFollowing = currentProfile.followers?.some(f => {
    const fId = f._id || f;
    return fId.toString() === currentUserId?.toString();
  });

  const handleFollowToggle = async () => {
    if (isFollowing) {
      // Optimistic: remove from followers array instantly
      dispatch(optimisticUnfollow({ currentUserId }));
      const result = await dispatch(unfollowUser(currentProfile._id));
      if (result.type.endsWith('/rejected')) {
        // Revert on failure — re-fetch
        dispatch(fetchProfile(decodedUsername));
      } else {
        // Silent refresh to sync exact DB state
        dispatch(fetchProfile(decodedUsername));
      }
    } else {
      // Optimistic: add to followers array instantly
      dispatch(optimisticFollow({ currentUserId }));
      const result = await dispatch(followUser(currentProfile._id));
      if (result.type.endsWith('/rejected')) {
        dispatch(fetchProfile(decodedUsername));
      } else {
        dispatch(fetchProfile(decodedUsername));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#111118] border border-white/10 p-8 mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/5 via-[#7C3AED]/5 to-[#EC4899]/5 pointer-events-none"></div>
        
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full border-4 border-[#0A0A0F] shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-5xl font-bold flex-shrink-0 z-10 overflow-hidden">
          {currentProfile.avatar 
            ? <img src={currentProfile.avatar} className="w-full h-full object-cover" alt={currentProfile.name} /> 
            : currentProfile.name?.charAt(0).toUpperCase()
          }
        </div>
        
        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                <h1 className="text-3xl font-bold font-heading">{currentProfile.name}</h1>
                {currentProfile.isAdmin && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">Admin</span>
                )}
              </div>
              <p className="text-gray-400 mt-2 max-w-lg">{currentProfile.bio || "No bio yet."}</p>
            </div>
            
            {!isMe && (
              <button 
                onClick={handleFollowToggle}
                className={`px-7 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 flex-shrink-0 ${
                  isFollowing 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                    : 'bg-gradient-primary text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transform hover:-translate-y-0.5'
                }`}
              >
                {isFollowing ? <><UserCheck className="w-4 h-4" /> Following</> : <><UserPlus className="w-4 h-4" /> Follow</>}
              </button>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-center md:justify-start gap-10 mt-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-white">{currentProfile.posts?.length || 0}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-0.5">Generations</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-white">{currentProfile.followers?.length || 0}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-0.5">Followers</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-white">{currentProfile.followings?.length || 0}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-0.5">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Their Generations */}
      <h2 className="text-2xl font-bold font-heading mb-6">
        {isMe ? 'Your Generations' : `${currentProfile.name}'s Generations`}
      </h2>
      
      {currentProfile.posts && currentProfile.posts.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {currentProfile.posts.map((item) => (
            <div key={item._id} className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/10 bg-[#111118]">
              <img 
                src={item.imageLink || item.imageUrl || item.image} 
                alt={item.Prompt || item.prompt}
                className="w-full object-cover"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                <div className="flex justify-end gap-2 mb-3 pointer-events-auto">
                  <button 
                    onClick={() => dispatch(toggleLike(item._id))}
                    className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${item.likes?.includes(currentUserId) ? 'text-red-500' : 'text-white'}`}
                  >
                    <Heart className="w-4 h-4" fill={item.likes?.includes(currentUserId) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => dispatch(savePost(item._id))}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
                <div className="pointer-events-auto">
                  <p className="text-sm font-medium text-white line-clamp-3 mb-3">{item.Prompt || item.prompt}</p>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(item.Prompt || item.prompt || ''); toast.success('Prompt copied!'); }}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Prompt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-white/10 border-dashed rounded-3xl bg-[#111118]/50">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <p className="text-gray-400 font-medium">
            {isMe ? "You haven't generated anything yet." : `${currentProfile.name} hasn't generated anything yet.`}
          </p>
        </div>
      )}
    </div>
  );
}
