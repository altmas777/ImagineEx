import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";

// Lazy load all pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const GeneratePage = lazy(() => import("./pages/GeneratePage").then(m => ({ default: m.GeneratePage })));
const GalleryPage = lazy(() => import("./pages/GalleryPage").then(m => ({ default: m.GalleryPage })));
const PricingPage = lazy(() => import("./pages/PricingPage").then(m => ({ default: m.PricingPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./pages/SignupPage").then(m => ({ default: m.SignupPage })));
const AdminPanel = lazy(() => import("./pages/AdminPanel").then(m => ({ default: m.AdminPanel })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(m => ({ default: m.ProfilePage })));

// Loading spinner component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-white/20 border-t-[#EC4899] rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="flex flex-col min-h-screen relative text-white">
      <div className="noise-bg" />
      <Navbar />
      <main className="flex-1 flex flex-col relative z-10 w-full pt-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected Routes */}
            <Route path="/generate" element={<PrivateRoute><GeneratePage /></PrivateRoute>} />
            <Route path="/feed" element={<PrivateRoute><GalleryPage /></PrivateRoute>} />
            <Route path="/profile/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
        </Suspense>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} 
      />
    </div>
  );
}

export default App;
