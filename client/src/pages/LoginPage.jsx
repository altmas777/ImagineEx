import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/generate');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex w-full absolute inset-0 z-50 bg-[#0A0A0F]">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden bg-[#111118] border-r border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#EC4899]/20 to-[#F97316]/20 mix-blend-overlay"></div>
          {/* Simulated floating images */}
          <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 opacity-20 filter blur-xl animate-[pulse_4s_infinite]"></div>
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 opacity-20 filter blur-2xl animate-[pulse_6s_infinite]"></div>
          {/* Noise overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="bg-gradient-primary p-2 rounded-xl group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all transform group-hover:scale-105">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="font-heading font-bold text-4xl tracking-tight text-white drop-shadow-lg">
              ImaginEx
            </span>
          </Link>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Welcome back to reality.</h2>
          <p className="text-gray-400 text-lg">Continue building your creative masterpiece where you left off.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="bg-gradient-primary p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                ImaginEx
              </span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 font-heading">Sign in</h1>
            <p className="text-gray-400">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="pl-11 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-sm font-medium text-[#06B6D4] hover:text-[#06B6D4]/80 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-11 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold mt-2" isLoading={isLoading}>
              Sign In
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-[#0A0A0F]">Or continue with</span>
              </div>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06B6D4] focus:ring-offset-[#0A0A0F]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#EC4899] hover:text-[#EC4899]/80 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
