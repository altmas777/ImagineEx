import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Copy, Heart, Bookmark, UserPlus, UserCheck, User as UserIcon, Image as ImageIcon, Flame, Clock, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, toggleLike } from "../redux/slices/postSlice";
import { savePost } from "../redux/slices/savedPostSlice";
import { followUser, unfollowUser } from "../redux/slices/profileSlice";
import toast from "react-hot-toast";
import { PostModal } from "../components/PostModal";

export function GalleryPage() {
  const [filter, setFilter] = useState("Latest");
  const [followingIds, setFollowingIds] = useState(new Set());
  const [selectedPost, setSelectedPost] = useState(null);
  const dispatch = useDispatch();

  const { posts, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleFollowToggle = async (authorId, isFollowing, event) => {
    event.preventDefault();
    event.stopPropagation();

    setFollowingIds(prev => {
      const next = new Set(prev);
      if (isFollowing) { next.delete(authorId); } else { next.add(authorId); }
      return next;
    });

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(authorId));
      } else {
        await dispatch(followUser(authorId));
      }
    } catch {
      setFollowingIds(prev => {
        const next = new Set(prev);
        if (isFollowing) { next.add(authorId); } else { next.delete(authorId); }
        return next;
      });
    }
  };

  const currentUserId = user?._id || user?.id;

  const filters = [
    { label: "Latest", icon: Clock, color: "from-blue-400 to-cyan-400" },
    { label: "Trending", icon: Flame, color: "from-orange-400 to-red-500" },
    { label: "Featured", icon: Sparkles, color: "from-purple-400 to-pink-500" },
  ];

  const filteredPosts = [...(posts || [])].sort((a, b) => {
    if (filter === "Trending") return (b.likes?.length || 0) - (a.likes?.length || 0);
    return new Date(b.createdAt) - new Date(a.createdAt); // Latest & Featured default to newest
  });

  return (
    <div className="relative max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 min-h-screen">

      {/* Ambient glowing orbs */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none" />

      {/* Header Matrix */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
        <div>
          <h1 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 flex items-center gap-3 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <Sparkles className="text-cyan-400" /> Nexus Feed
          </h1>
          <p className="text-gray-400 text-sm mt-2 tracking-wide">
            Explore creations synthesized by the global network
          </p>
        </div>

        {/* Futuristic Filter Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          {filters.map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                filter === label
                  ? "text-white shadow-lg shadow-black/50"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {filter === label && (
                <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-20`} />
              )}
              {filter === label && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white]" />
              )}
              <Icon className={`w-4 h-4 ${filter === label ? '' : 'opacity-70'}`} />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative w-16 h-16">
             <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin" />
             <div className="absolute inset-2 rounded-full border-4 border-t-pink-500 border-l-cyan-400 border-b-transparent border-r-transparent animate-[spin_1.5s_reverse_infinite]" />
          </div>
          <p className="text-cyan-400 animate-pulse font-mono text-sm tracking-widest uppercase">Fetching Visuals...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          <ImageIcon className="w-16 h-16 text-gray-600 mb-6 group-hover:text-cyan-400 transition-colors duration-500" />
          <h2 className="text-2xl font-bold mb-3 text-white">The Void is Empty</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            The neural network awaits your input. Be the pioneer to synthesize a new reality.
          </p>
          <Link to="/generate" className="relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold overflow-hidden group/btn shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10">Initialize Sequence</span>
          </Link>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredPosts.map((item) => {
            const authorId = item.user?._id;
            const isMe = currentUserId && authorId && currentUserId.toString() === authorId.toString();
            const dbFollowing = item.user?.followers?.some(
              f => (f._id || f)?.toString() === currentUserId?.toString()
            );
            const isFollowing = followingIds.has(authorId)
              ? !dbFollowing
              : dbFollowing;

            const isLiked = item.likes?.some(
              id => (id._id || id)?.toString() === currentUserId?.toString()
            );

            return (
              <div
                key={item._id}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/10 bg-black backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(124,58,237,0.3)] hover:border-purple-500/50 cursor-pointer"
                onClick={() => setSelectedPost(item)}
              >
                {/* Author Floating Badge */}
                {item.user && (
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2 p-1.5 pr-3 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" onClick={e => e.stopPropagation()}>
                    <Link
                      to={`/profile/${encodeURIComponent(item.user.name)}`}
                      className="flex items-center gap-2 hover:opacity-80"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-tr from-cyan-400 to-purple-500">
                        {item.user.avatar
                          ? <img src={item.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          : <UserIcon className="w-3 h-3 text-white m-auto translate-y-1.5" />
                        }
                      </div>
                      <span className="text-xs font-bold text-white max-w-[80px] truncate">{item.user.name}</span>
                    </Link>

                    {!isMe && (
                      <button
                        onClick={(e) => handleFollowToggle(authorId, isFollowing, e)}
                        className={`ml-1 text-[10px] uppercase font-bold px-2 py-1 rounded-full transition-all ${
                          isFollowing
                            ? "bg-white/10 text-gray-400"
                            : "bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        }`}
                      >
                        {isFollowing ? '✓ Following' : '+ Follow'}
                      </button>
                    )}
                  </div>
                )}

                {/* Main Image */}
                <div className="relative">
                  <img
                    src={item.imageLink || item.imageUrl || item.image}
                    alt={item.Prompt || item.prompt}
                    className="w-full h-auto object-cover transform scale-[1.02] group-hover:scale-100 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Cinematic Hover Action Bar */}
                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  
                  {/* Prompt Text visible on hover */}
                  {(item.Prompt || item.prompt) && (
                    <p className="text-[11px] text-gray-300 line-clamp-2 mb-3 font-mono leading-relaxed pointer-events-auto">
                      &gt; {item.Prompt || item.prompt}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pointer-events-auto" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => dispatch(toggleLike(item._id))}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 backdrop-blur-md border border-white/10 transition-all group/action"
                    >
                      <Heart className={`w-4 h-4 transition-transform group-hover/action:scale-110 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                      <span className="text-xs font-bold text-white">{item.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => {
                        dispatch(savePost(item._id));
                        toast.success("Post catalogued!");
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 backdrop-blur-md border border-white/10 text-white hover:text-cyan-400 transition-all group/action"
                      title="Save Post"
                    >
                      <Bookmark className="w-4 h-4 group-hover/action:-translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.Prompt || item.prompt || "");
                        toast.success("Prompt copied to neural link");
                      }}
                      className="p-2 ml-auto rounded-xl bg-white/10 hover:bg-purple-500/20 backdrop-blur-md border border-white/10 text-white hover:text-purple-400 transition-all group/action flex items-center gap-1.5"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold hidden sm:block">Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal Overlay */}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
