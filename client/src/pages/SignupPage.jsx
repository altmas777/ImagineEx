import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, User, Phone } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOTP } from "../redux/slices/authSlice";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, pendingVerificationEmail } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/generate');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(registerUser({ name, email, password, phone, bio: 'AI Enthusiast' }));
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp) return;
    dispatch(verifyOTP({ email: pendingVerificationEmail, otp }));
  };

  return (
    <div className="min-h-screen flex w-full absolute inset-0 z-50 bg-[#0A0A0F]">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center overflow-hidden bg-[#111118] border-r border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/20 via-[#7C3AED]/20 to-[#EC4899]/20 mix-blend-overlay"></div>
          {/* Simulated floating images */}
          <div className="absolute top-[20%] right-[15%] w-72 h-72 rounded-2xl bg-gradient-to-tr from-[#06B6D4] to-blue-500 opacity-20 filter blur-2xl animate-[pulse_5s_infinite]"></div>
          <div className="absolute bottom-[10%] left-[10%] w-64 h-64 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] opacity-20 filter blur-xl animate-[pulse_7s_infinite]"></div>
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
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Start your creative journey.</h2>
          <p className="text-gray-400 text-lg">Join thousands of creators turning their imagination into reality.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-10 mt-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="bg-gradient-primary p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                ImaginEx
              </span>
            </Link>
          </div>

          {pendingVerificationEmail ? (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 font-heading">Verify your email</h1>
              <p className="text-gray-400">We've sent a 6-digit code to <b className="text-white">{pendingVerificationEmail}</b>.</p>
              
              <form onSubmit={handleVerifyOTP} className="space-y-4 mt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
                  <Input 
                    type="text" 
                    placeholder="123456" 
                    className="text-center tracking-widest text-2xl h-14"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold" isLoading={isLoading}>
                  Verify & Join
                </Button>
              </form>
              
              <p className="mt-8 text-center text-sm text-gray-400">
                Didn't receive the email?{" "}
                <button type="button" onClick={handleSignup} className="font-semibold text-[#EC4899] hover:text-[#EC4899]/80 transition-colors">
                  Resend Code
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 font-heading">Create an account</h1>
                <p className="text-gray-400">Get 10 free generations every day.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="pl-11 h-12"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input 
                      type="tel" 
                      placeholder="9876543210" 
                      className="pl-11 h-12"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-11 h-12"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center pt-2 pb-4">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#EC4899] focus:ring-[#EC4899] focus:ring-offset-[#0A0A0F]"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                    I agree to the <a href="#" className="text-white hover:text-[#EC4899] transition-colors">Terms of Service</a> and <a href="#" className="text-white hover:text-[#EC4899] transition-colors">Privacy Policy</a>
                  </label>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold" isLoading={isLoading}>
                  Create Account
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[#EC4899] hover:text-[#EC4899]/80 transition-colors">
                  Sign in Instead
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
