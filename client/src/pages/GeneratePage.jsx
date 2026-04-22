import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input, Textarea } from "../components/ui/Input";
import { Download, Share2, Bookmark, Settings2, Image as ImageIcon, Loader2, Sparkles, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createPost } from "../redux/slices/postSlice";

export function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("Standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const dispatch = useDispatch();

  const handleDownload = async (imageUrl, promptText) => {
    try {
      toast.loading("Downloading...", { id: 'download' });
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imaginex_${promptText?.slice(0, 15).replace(/\s+/g, '_') || 'art'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download complete!", { id: 'download' });
    } catch (error) {
      toast.error("Failed to download image", { id: 'download' });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsGenerating(true);

    try {
      const actionResult = await dispatch(createPost({ prompt })).unwrap();

      setIsGenerating(false);
      setGeneratedImage({
        url: actionResult.imageLink || actionResult.imageUrl || actionResult.image,
        prompt: actionResult.prompt || actionResult.Prompt
      });
      toast.success("Image generated successfully!");
    } catch (err) {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col xl:flex-row gap-8">
      
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#EC4899] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none" />

      {/* Left Panel - Controls (Glassmorphic) */}
      <div className="w-full xl:w-[450px] flex flex-col gap-6 relative z-10">
        
        {/* Header Widget */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles className="w-20 h-20" />
           </div>
           <h1 className="text-3xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
             AI Generator
           </h1>
           <p className="text-gray-400 text-sm">Forge reality from imagination.</p>
        </div>

        {/* Form Panel */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
          
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3 group-hover:text-purple-400 transition-colors">
              <Zap className="w-4 h-4" /> The Prompt
            </label>
            <div className="relative">
              <Textarea
                placeholder="A futuristic city with flying cars at sunset, vivid cyberpunk colors, 8k..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full min-h-[140px] bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all custom-scrollbar resize-none"
              />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
            </div>
          </div>

          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-300 hover:text-white transition-colors select-none">
              <Settings2 className="w-4 h-4" />
              Advanced Matrix Parameters
            </summary>
            <div className="mt-4 p-4 rounded-xl bg-black/30 border border-white/5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Negative Variables</label>
                <Input
                  placeholder="blurry, low tech, distorted..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="bg-black/40 border-white/10 focus:border-pink-500 text-sm rounded-lg"
                />
              </div>
            </div>
          </details>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Aesthetic Matrix</label>
            <div className="flex flex-wrap gap-2">
              {['photorealistic', 'cyberpunk', 'anime', 'digital art', 'cinematic'].map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 backdrop-blur-md ${style === s ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-3">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {['1:1', '16:9', '9:16', '4:3'].map(ar => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={`text-xs py-2 rounded-lg border transition-all duration-300 ${aspectRatio === ar ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          className="relative w-full overflow-hidden rounded-xl font-bold text-white shadow-2xl group"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
           <div className={`absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] ${isGenerating ? 'opacity-80' : 'group-hover:opacity-90 transition-opacity duration-300'}`} />
           
           {/* Animated shine effect */}
           <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />

           <div className="relative py-4 px-6 flex items-center justify-center gap-3">
             {isGenerating ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                 Synthesizing Reality...
               </>
             ) : (
               <>
                 <Sparkles className="w-5 h-5" />
                 Initialize Generation
               </>
             )}
           </div>
        </button>
      </div>

      {/* Right Panel - Result Display */}
      <div className="flex-1 flex flex-col h-[600px] xl:h-[auto] min-h-[600px] relative z-10 w-full">
        <div className="w-full h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col relative overflow-hidden group/canvas">
          
          {/* Dynamic Border Glow specific to result panel */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center">
            
            {/* Corner Decorative Elements */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gray-600 opacity-50 m-4 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gray-600 opacity-50 m-4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gray-600 opacity-50 m-4 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gray-600 opacity-50 m-4 pointer-events-none" />

            {isGenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-transparent relative">
                
                {/* Holographic Scanner Effect */}
                <div className="absolute inset-0 bg-cyan-500/5" />
                <div className="absolute left-0 top-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_2px_rgba(34,211,238,0.7)] animate-[scan_2s_ease-in-out_infinite]" />
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                   <div className="relative">
                      <div className="absolute -inset-4 bg-pink-500/20 blur-xl rounded-full animate-pulse" />
                      <Loader2 className="w-16 h-16 text-pink-500 animate-spin relative z-10" />
                   </div>
                   <div className="text-center">
                      <p className="text-xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 tracking-wider">
                        ASSEMBLING PIXELS
                      </p>
                      <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase font-mono">
                        Neural Network Connected
                      </p>
                   </div>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="relative w-full h-full flex flex-col group/image">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  className="w-full h-full object-contain bg-black/50 backdrop-blur-3xl transition-transform duration-1000 ease-out group-hover/image:scale-[1.01]"
                />
                
                {/* Sleek Toolbelt over Image */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 opacity-0 group-hover/image:opacity-100 transition-all duration-300 translate-y-4 group-hover/image:translate-y-0 shadow-2xl">
                  
                  <button onClick={() => handleDownload(generatedImage.url, generatedImage.prompt)} className="p-3 rounded-full hover:bg-white/10 text-white transition-colors relative group/btn" title="Save to File">
                    <Download className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-black px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">Download</span>
                  </button>
                  
                  <div className="w-[1px] h-6 bg-white/20 mx-1" />

                  <button className="p-3 rounded-full hover:bg-pink-500/20 text-gray-200 hover:text-pink-400 transition-colors relative group/btn" title="Save Post" onClick={() => toast.success("Saved to feed!")}>
                    <Bookmark className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-black px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">Save</span>
                  </button>
                  
                  <div className="w-[1px] h-6 bg-white/20 mx-1" />

                  <button className="p-3 rounded-full hover:bg-blue-500/20 text-gray-200 hover:text-blue-400 transition-colors relative group/btn" title="Share" onClick={() => toast.success("Link copied to clipboard")}>
                    <Share2 className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-black px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity">Share</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center opacity-30">
                <ImageIcon className="w-24 h-24 mb-6 stroke-[1]" />
                <p className="text-2xl font-heading tracking-wider">AWAITING INPUT</p>
                <div className="w-12 h-1 bg-white/30 mt-4 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
