import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Heart, MessageSquare, Send, Trash2, User as UserIcon, Bookmark, Flag, Download } from 'lucide-react';
import { fetchComments, addComment, deleteComment, toggleLike, reportPost, deleteUserPost } from '../redux/slices/postSlice';
import { savePost } from '../redux/slices/savedPostSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function PostModal({ post, onClose }) {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");
  
  const { comments, posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (post) {
      dispatch(fetchComments(post._id));
    }
  }, [dispatch, post]);

  if (!post) return null;

  const actualPost = posts.find(p => p._id === post._id) || post;

  const currentUserId = user?._id || user?.id;
  const isLiked = actualPost.likes?.some(id => (id._id || id)?.toString() === currentUserId?.toString());
  const isMe = (actualPost.user?._id || actualPost.user)?.toString() === currentUserId?.toString();

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post permanently?")) {
      await dispatch(deleteUserPost(actualPost._id));
      onClose();
    }
  };

  const handleDownload = async () => {
    try {
      const imageUrl = actualPost.imageLink || actualPost.imageUrl || actualPost.image;
      toast.loading("Downloading...", { id: 'download' });
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imaginex_${(actualPost.Prompt || actualPost.prompt || 'art').slice(0, 15).replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download complete!", { id: 'download' });
    } catch (error) {
      toast.error("Failed to download image", { id: 'download' });
    }
  };

  const handleSave = () => {
    dispatch(savePost(actualPost._id));
    toast.success("Post saved to your collection!");
  };

  const handleReport = () => {
    const text = window.prompt("Why are you reporting this post?");
    if(text && text.trim() !== "") {
       dispatch(reportPost({ pid: post._id, text: text }));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await dispatch(addComment({ pid: post._id, text: newComment })).unwrap();
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      // Error is handled in slice toast
    }
  };

  const handleDeleteComment = async (cid) => {
    try {
      await dispatch(deleteComment({ pid: post._id, cid })).unwrap();
    } catch (error) {
      // Error handled
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#111118] rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-2xl">
        
        {/* Close Button Mobile - Absolute position for smaller screens */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side - Image */}
        <div className="w-full md:w-[60%] h-[40vh] md:h-full bg-black flex items-center justify-center relative">
          <img 
            src={post.imageLink || post.imageUrl || post.image} 
            alt={post.Prompt || post.prompt} 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Details & Comments */}
        <div className="w-full md:w-[40%] h-[45vh] md:h-full flex flex-col bg-[#111118]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
            {post.user && (
              <Link to={`/profile/${post.user.name}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  {post.user.avatar 
                    ? <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover"/> 
                    : <UserIcon className="w-5 h-5 text-white" />
                  }
                </div>
                <span className="font-semibold text-white">{post.user.name}</span>
              </Link>
            )}
            
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors hidden md:block">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            {/* Post Prompt */}
            {(post.Prompt || post.prompt) && (
              <div className="flex gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                   {post.user?.avatar 
                    ? <img src={post.user.avatar} className="w-full h-full rounded-full object-cover"/>
                    : <UserIcon className="w-4 h-4 text-gray-400" />
                   }
                 </div>
                 <div>
                   <span className="font-semibold text-sm text-white mr-2">{post.user?.name}</span>
                   <span className="text-sm text-gray-300 leading-relaxed">{post.Prompt || post.prompt}</span>
                 </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments?.length > 0 ? (
                comments.map(comment => (
                  <div key={comment._id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {comment.user?.avatar 
                        ? <img src={comment.user.avatar} className="w-full h-full object-cover"/>
                        : <UserIcon className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm text-white mr-2">{comment.user?.name}</span>
                      <span className="text-sm text-gray-300">{comment.text}</span>
                    </div>
                    
                    {/* Delete Comment Button (Only for comment owner or post owner) */}
                    {(comment.user?._id === currentUserId || post.user?._id === currentUserId) && (
                      <button 
                        onClick={() => handleDeleteComment(comment._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-4 items-center">
                <button 
                  onClick={() => dispatch(toggleLike(actualPost._id))}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>
              </div>

              <div className="flex gap-3 items-center">
                 {isMe && (
                   <button 
                     onClick={handleDeletePost}
                     className="hover:scale-110 transition-transform text-white hover:text-red-500"
                     title="Delete Post"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 )}
                 <button 
                   onClick={handleDownload}
                   className="hover:scale-110 transition-transform text-white hover:text-green-400"
                   title="Download Post"
                 >
                   <Download className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleSave}
                   className="hover:scale-110 transition-transform text-white hover:text-[#06B6D4]"
                   title="Save Post"
                 >
                   <Bookmark className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleReport}
                   className="hover:scale-110 transition-transform text-gray-400 hover:text-red-400"
                   title="Report Post"
                 >
                   <Flag className="w-5 h-5" />
                 </button>
              </div>
            </div>
            <p className="font-semibold text-sm text-white">{actualPost.likes?.length || 0} likes</p>
          </div>

          {/* Add Comment Input */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <form onSubmit={handleAddComment} className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500 focus:ring-0"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!newComment.trim()}
                className="text-[#06B6D4] font-semibold text-sm hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Send className="w-4 h-4" /> Post
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
