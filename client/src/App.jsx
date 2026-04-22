import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// We will create these pages next
import { LandingPage } from "./pages/LandingPage";
import { GeneratePage } from "./pages/GeneratePage";
import { GalleryPage } from "./pages/GalleryPage";
import { PricingPage } from "./pages/PricingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AdminPanel } from "./pages/AdminPanel";
import { ProfilePage } from "./pages/ProfilePage";

import { PrivateRoute } from "./components/PrivateRoute";
import { AdminRoute } from "./components/AdminRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen relative text-white">
      <div className="noise-bg" />
      <Navbar />
      <main className="flex-1 flex flex-col relative z-10 w-full pt-16">
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
