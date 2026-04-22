import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";
import { Zap, Image as ImageIcon, Layers, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export function LandingPage() {
  const [previewPosts, setPreviewPosts] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/posts/preview')
      .then(r => setPreviewPosts(r.data || []))
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#EC4899]" />,
      title: "Fast Generation",
      description: "Get stunning, high-definition AI images generated in under 3 seconds using our optimized inference model."
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-[#06B6D4]" />,
      title: "High Quality",
      description: "Output resolutions up to 4K. Crisp details, accurate textures, and perfect lighting every time."
    },
    {
      icon: <Layers className="w-6 h-6 text-[#7C3AED]" />,
      title: "Multiple Styles",
      description: "From photorealistic to anime, oil painting to cinematic. We support 20+ fine-tuned visual styles."
    },
    {
      icon: <Terminal className="w-6 h-6 text-[#F97316]" />,
      title: "API Access",
      description: "Easily integrate our powerful generation engine into your own apps with our developer-friendly REST API."
    }
  ];

  return (
    <div className="w-full flex-col flex overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-24 flex flex-col items-center text-center">
        {/* Abstract floating shapes behind hero */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#7C3AED] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse pointer-events-none" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-[#EC4899] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#06B6D4] animate-ping"></span>
            <span className="text-xs font-medium text-gray-300">ImaginEx Engine v2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 mt-0 font-heading">
            Turn your imagination into <br className="hidden md:block"/>
            <span className="text-gradient drop-shadow-sm">vibrant reality.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The next-generation AI image generator that turns your words into breathtaking art, photorealistic portraits, and stunning designs.
          </p>

          <div className="max-w-xl mx-auto w-full relative sm:flex flex-row items-center gap-2 p-2 rounded-2xl bg-[#111118]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
            <input 
              type="text" 
              placeholder="A futuristic cyberpunk city at sunset..."
              className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 px-4 py-3 h-12 flex-1"
            />
            <Link to="/generate" className="w-full sm:w-auto mt-2 sm:mt-0 inline-block">
              <Button className="w-full sm:w-auto h-12">
                Generate <Zap className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-[#0f0f15] py-24 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Unleash Creative Power</h2>
            <p className="text-gray-400">Everything you need to create spectacular imagery.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-6 h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How It Works</h2>
          <p className="text-gray-400">Creating masterpieces is as easy as 1-2-3.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="flex-1 text-center p-6 relative">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_30px_rgba(124,58,237,0.3)]">1</div>
            <h3 className="text-xl font-bold text-white mb-2">Type Prompt</h3>
            <p className="text-gray-400 text-sm">Describe what you want to see in the prompt box.</p>
            <div className="hidden md:block w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent absolute top-14 left-[50%]"></div>
          </div>
          <div className="flex-1 text-center p-6 relative">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_30px_rgba(236,72,153,0.3)]">2</div>
            <h3 className="text-xl font-bold text-white mb-2">Generate</h3>
            <p className="text-gray-400 text-sm">Our AI engine processes your request in seconds.</p>
            <div className="hidden md:block w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent absolute top-14 left-[50%]"></div>
          </div>
          <div className="flex-1 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)]">3</div>
            <h3 className="text-xl font-bold text-white mb-2">Download</h3>
            <p className="text-gray-400 text-sm">Save your high-res masterpiece or share it with the world.</p>
          </div>
        </div>
      </section>

      {/* Community Feed Teaser */}
      <section className="bg-[#0f0f15] py-24 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Made with ImaginEx</h2>
          <p className="text-gray-400 text-sm mb-12">Real creations from our community.</p>

          {previewPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {previewPosts.map((post, i) => (
                <div
                  key={post._id}
                  className={`rounded-2xl overflow-hidden border border-white/10 relative group ${
                    i === 0 || i === 5 ? 'md:col-span-2 h-64' : 'h-48 md:h-56'
                  }`}
                >
                  <img
                    src={post.imageLink || post.imageUrl || post.image}
                    alt={post.Prompt || post.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-xs text-white font-medium line-clamp-2 text-left">{post.Prompt || post.prompt}</p>
                    {post.user?.name && (
                      <p className="text-xs text-gray-400 mt-1 text-left">by {post.user.name}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-gradient-to-tr from-[#1a1a24] to-[#2a2a35] border border-white/5 animate-pulse ${
                    i === 0 || i === 5 ? 'md:col-span-2 h-64' : 'h-48 md:h-56'
                  }`}
                />
              ))}
            </div>
          )}

          <Link to="/feed">
            <Button variant="outline">Explore the Feed</Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-4xl mx-auto px-4 text-center">
        <div className="relative rounded-3xl p-1 bg-gradient-primary">
          <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-30"></div>
          <div className="bg-[#111118] relative px-8 py-16 rounded-[22px] flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">Ready to Create?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">Plans starting at Free. Upgrade anytime for higher resolutions and faster generation times.</p>
            <div className="flex gap-4">
              <Link to="/pricing">
                <Button variant="outline">View Pricing</Button>
              </Link>
              <Link to="/signup">
                <Button>Start for Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
