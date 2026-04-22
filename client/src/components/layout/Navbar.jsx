import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Sparkles, Menu, X, LogOut, User, Shield } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { cn } from "../../lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin === true;

  const navLinks = [
    { name: "Generate", path: "/generate" },
    { name: "Feed", path: "/feed" },
    { name: "Pricing", path: "/pricing" },
  ];

  // Hide navbar on login/signup/admin pages (admin has its own sidebar layout)
  const isHiddenPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup') || location.pathname.startsWith('/admin');

  if (isHiddenPage) return null;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-gradient">
              ImaginEx
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-white",
                    location.pathname === link.path ? "text-white" : "text-gray-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              {isAuthenticated ? (
                <>
                  <Link to={`/profile/${encodeURIComponent(user?.name)}`} className="flex items-center gap-2 text-sm text-white font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <User className="w-4 h-4 text-[#EC4899]" />
                    {user?.name || "User"}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-1.5 text-xs text-yellow-400 font-medium bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors">
                      <Shield className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={() => dispatch(logout())}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#111118] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${encodeURIComponent(user?.name)}`} onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 font-medium hover:text-white transition-colors">
                  <User className="w-4 h-4 text-[#EC4899]" />
                  {user?.name || "User"}
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-yellow-400 font-medium hover:text-yellow-300 transition-colors">
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <Button variant="outline" className="w-full text-left justify-start" onClick={() => { dispatch(logout()); setIsOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
