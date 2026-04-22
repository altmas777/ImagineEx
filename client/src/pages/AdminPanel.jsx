import { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { 
  LayoutDashboard, Users, Image as ImageIcon, 
  LogOut, Menu, X, CheckCircle, XCircle, Eye, EyeOff,
  Shield, Plus, Minus, Edit3, Save, Trash2, AlertTriangle, ArrowLeft
} from "lucide-react";
import { Card } from "../components/ui/Card";

// Admin Sidebar
const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Generations", path: "/admin/generations", icon: ImageIcon },
  ];

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111118] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-white/10 justify-between lg:justify-center">
            <Link to="/" className="font-heading font-bold text-xl text-gradient">ImaginEx Admin</Link>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-white/10 text-white shadow-[inset_4px_0_0_0_#EC4899]' : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-5'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#EC4899]' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#06B6D4] hover:bg-white/5 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Leave Admin Panel</span>
            </Link>
            <Link to="/" onClick={() => dispatch(logout())} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

// Dashboard
const DashboardView = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, activeUsers: 0, adminUsers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, postsRes] = await Promise.all([
          axiosInstance.get('/api/admin/users'),
          axiosInstance.get('/api/admin/posts'),
        ]);
        const users = usersRes.data;
        const posts = postsRes.data;
        setStats({
          totalUsers: users.length,
          totalPosts: posts.length,
          activeUsers: users.filter(u => u.isActive).length,
          adminUsers: users.filter(u => u.isAdmin).length,
        });
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: isLoading ? "..." : stats.totalUsers, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10" },
    { label: "Total Generations", value: isLoading ? "..." : stats.totalPosts, color: "text-[#EC4899]", bg: "bg-[#EC4899]/10" },
    { label: "Active Users", value: isLoading ? "..." : stats.activeUsers, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Admin Users", value: isLoading ? "..." : stats.adminUsers, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className={`p-6 border border-white/10 ${stat.bg}`}>
            <p className="text-gray-400 text-sm font-medium mb-3">{stat.label}</p>
            <h3 className={`text-4xl font-bold ${stat.color}`}>{stat.value}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Edit User Modal
const EditUserModal = ({ user, onClose, onSave }) => {
  const [credits, setCredits] = useState(user.credits ?? 5);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [isActive, setIsActive] = useState(user.isActive);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/api/admin/user/${user._id}`, { credits, isAdmin, isActive });
      toast.success(`User ${user.name} updated!`);
      onSave();
      onClose();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white">{user.name}</h3>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Credits */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Credits</label>
            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-3 border border-white/10">
              <button onClick={() => setCredits(c => Math.max(0, c - 1))} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"><Minus className="w-4 h-4" /></button>
              <input
                type="number"
                value={credits}
                onChange={e => setCredits(Math.max(0, Number(e.target.value)))}
                className="flex-1 bg-transparent text-center text-xl font-bold text-white focus:outline-none"
                min="0"
              />
              <button onClick={() => setCredits(c => c + 1)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Role Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsAdmin(false)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${!isAdmin ? 'bg-white/10 text-white border-white/30' : 'bg-transparent text-gray-500 border-white/10 hover:bg-white/5'}`}
              >User</button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${isAdmin ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' : 'bg-transparent text-gray-500 border-white/10 hover:bg-white/5'}`}
              ><Shield className="w-4 h-4" /> Admin</button>
            </div>
          </div>

          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Account Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsActive(true)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${isActive ? 'bg-green-400/20 text-green-400 border-green-400/30' : 'bg-transparent text-gray-500 border-white/10 hover:bg-white/5'}`}
              ><CheckCircle className="w-4 h-4" /> Active</button>
              <button
                onClick={() => setIsActive(false)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${!isActive ? 'bg-red-400/20 text-red-400 border-red-400/30' : 'bg-transparent text-gray-500 border-white/10 hover:bg-white/5'}`}
              ><XCircle className="w-4 h-4" /> Suspended</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold text-sm transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Users View
const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/admin/users');
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="space-y-6">
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={fetchUsers} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading">Manage Users</h2>
        <span className="text-sm text-gray-400">{users.length} total users</span>
      </div>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No users found</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/profile/${encodeURIComponent(user.name)}`} className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 hover:opacity-80 transition-opacity">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </Link>
                      <div>
                        <Link to={`/profile/${encodeURIComponent(user.name)}`} className="font-medium text-white hover:text-[#EC4899] transition-colors">{user.name}</Link>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isAdmin 
                      ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center gap-1 w-fit"><Shield className="w-3 h-3" /> Admin</span>
                      : <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 w-fit block">User</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-bold text-lg">{user.credits ?? '—'}</span>
                    <span className="text-gray-500 text-xs ml-1">credits</span>
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive 
                      ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> Active</span>
                      : <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 border border-red-400/20 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Suspended</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setEditingUser(user)} 
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-[#EC4899]/10 hover:text-[#EC4899] transition-colors border border-white/10"
                      title="Edit User"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Edit Post Modal
const EditPostModal = ({ post, users, onClose, onSave }) => {
  const [prompt, setPrompt] = useState(post.Prompt || post.prompt || '');
  const [selectedUserId, setSelectedUserId] = useState(post.user?._id || post.user || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/api/admin/post/${post._id}`, {
        Prompt: prompt,
        user: selectedUserId,
      });
      toast.success('Post updated!');
      onSave();
      onClose();
    } catch {
      toast.error('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111118] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-lg">Edit Generation</h3>
            <p className="text-xs text-gray-500 mt-0.5">Modify prompt or reassign owner</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image Preview */}
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <img
              src={post.imageLink || post.imageUrl || post.image}
              alt="post"
              className="w-16 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">Current Image</p>
              <p className="text-sm text-gray-300 truncate">{post.imageLink || post.imageUrl || post.image}</p>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#EC4899]/50 focus:bg-white/8 transition-colors resize-none"
              placeholder="Enter prompt..."
            />
          </div>

          {/* Reassign Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Assigned To (Owner)</label>
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#EC4899]/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#111118]">Select a user...</option>
              {users.map(u => (
                <option key={u._id} value={u._id} className="bg-[#111118]">
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold text-sm transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirm Modal
const DeleteConfirmModal = ({ post, onClose, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-[#111118] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl">
      <div className="p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="font-bold text-white text-lg mb-2">Delete Generation?</h3>
        <p className="text-gray-400 text-sm mb-1">This action cannot be undone.</p>
        <p className="text-gray-500 text-xs truncate px-4">"{post.Prompt || post.prompt}"</p>
      </div>
      <div className="flex items-center gap-3 p-6 border-t border-white/10">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold">Cancel</button>
        <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// Generations View
const GenerationsView = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchPosts(); fetchUsers(); }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/admin/posts');
      setPosts(data);
    } catch {
      toast.error("Failed to load generations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/api/admin/users');
      setUsers(data);
    } catch {
      // silently fail
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/api/admin/post/${id}`, { isPublished: !currentStatus });
      setPosts(prev => prev.map(p => p._id === id ? { ...p, isPublished: !currentStatus } : p));
      toast.success("Visibility updated");
    } catch {
      toast.error("Error updating post");
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/api/admin/post/${deletingPost._id}`);
      setPosts(prev => prev.filter(p => p._id !== deletingPost._id));
      toast.success('Generation deleted!');
      setDeletingPost(null);
    } catch {
      toast.error('Failed to delete generation');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {editingPost && (
        <EditPostModal
          post={editingPost}
          users={users}
          onClose={() => setEditingPost(null)}
          onSave={fetchPosts}
        />
      )}
      {deletingPost && (
        <DeleteConfirmModal
          post={deletingPost}
          onClose={() => setDeletingPost(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-heading">Generations Log</h2>
        <span className="text-sm text-gray-400">{posts.length} total generations</span>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Prompt</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Likes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading generations...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">No generations found</td></tr>
              ) : posts.map((post) => (
                <tr key={post._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <img
                      src={post.imageLink || post.imageUrl || post.image}
                      alt={post.Prompt || post.prompt}
                      className="w-14 h-14 rounded-lg object-cover border border-white/10"
                    />
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-white text-sm truncate font-medium">{post.Prompt || post.prompt || 'No prompt'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {post.user?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-gray-300 text-sm">{post.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{post.likes?.length || 0}</td>
                  <td className="px-6 py-4">
                    {post.isPublished !== false
                      ? <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-400/10 text-green-400 border border-green-400/20 flex items-center gap-1 w-fit"><Eye className="w-3 h-3"/> Visible</span>
                      : <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-400/10 text-gray-400 border border-gray-400/20 flex items-center gap-1 w-fit"><EyeOff className="w-3 h-3"/> Hidden</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => togglePublish(post._id, post.isPublished !== false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${post.isPublished !== false ? 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}
                        title={post.isPublished !== false ? 'Hide Post' : 'Show Post'}
                      >
                        {post.isPublished !== false ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-[#EC4899]/10 hover:text-[#EC4899] transition-colors border border-white/10"
                        title="Edit Post"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setDeletingPost(post)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-white/10"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export function AdminPanel() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen fixed inset-0 z-50 flex bg-[#0A0A0F] text-white">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#111118]/80 backdrop-blur-md flex-shrink-0">
          <button className="lg:hidden text-gray-400 hover:text-white focus:outline-none" onClick={() => setIsMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block text-sm text-right">
              <p className="font-medium">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/users" element={<UsersView />} />
              <Route path="/generations" element={<GenerationsView />} />
              <Route path="*" element={<DashboardView />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
