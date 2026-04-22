import { Sparkles, MessageSquare, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  const isAuthOrAdmin = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup') || location.pathname.startsWith('/admin');

  if (isAuthOrAdmin) return null;

  return (
    <footer className="bg-[#0A0A0F] py-12 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-gradient-primary p-1 rounded-md group-hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-gradient">
                ImaginEx
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Create stunning AI-generated visuals in seconds. Your imagination, our engine.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/generate" className="hover:text-white transition-colors">Generate</Link></li>
              <li><Link to="/feed" className="hover:text-white transition-colors">Feed</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/api" className="hover:text-white transition-colors">API Access</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ImaginEx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
