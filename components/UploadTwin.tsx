import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2, Wand2, CheckCircle, ScanLine, AlertTriangle, RefreshCw, Zap, TrendingUp, BrainCircuit, Play, Film } from 'lucide-react';
import { analyzeTwinImage, generateTwinBio, getMockTwinAnalysis, getTrendingCastingThemes, generateCareerStrategy, generateMotionTest } from '../services/geminiService';
import { TwinAttributes } from '../types';
import { Hologram } from './Hologram';

interface UploadTwinProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export const UploadTwin: React.FC<UploadTwinProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{ attributes: TwinAttributes; suggestedGenres: string[] } | null>(null);
  const [generatedBio, setGeneratedBio] = useState<string>("");
  const [trendingThemes, setTrendingThemes] = useState<string[]>([]);
  const [careerStrategy, setCareerStrategy] = useState<string | null>(null);
  const [motionVideoUrl, setMotionVideoUrl] = useState<string | null>(null);
  
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when entering upload
  useEffect(() => {
    if (step === 'upload') {
      setAnalysis(null);
      setGeneratedBio("");
      setTrendingThemes([]);
      setCareerStrategy(null);
      setMotionVideoUrl(null);
    }
  }, [step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        const base64 = result.split(',')[1];
        setImageBase64(base64);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!imageBase64) return;
    
    setStep('analyzing');
    setError(null);
    
    try {
      // Parallel execution: Analyze Image AND Fetch Trending Themes (Search Grounding)
      const [analysisResult, themes] = await Promise.all([
        analyzeTwinImage(imageBase64),
        getTrendingCastingThemes(),
        new Promise(resolve => setTimeout(resolve, 2500)) // Min animation time
      ]);
      
      setAnalysis(analysisResult);
      setTrendingThemes(themes);
      
      const bio = await generateTwinBio(analysisResult.attributes, "New Twin");
      setGeneratedBio(bio);
      
      setStep('review');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during neural scanning.");
      setStep('upload');
    }
  };

  const handleUseDemoData = async () => {
    setStep('analyzing');
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData = getMockTwinAnalysis();
    setAnalysis(mockData);
    setTrendingThemes(["Cyberpunk", "Neo-Noir", "Ethereal", "Post-Human", "Retro-Futurism"]);
    setGeneratedBio("A high-fidelity digital twin generated from demo parameters, ready for immediate deployment in cyberpunk narratives. This construct features optimized topology for real-time rendering.");
    setStep('review');
  };

  const handleGenerateStrategy = async () => {
    if (!analysis) return;
    setIsThinking(true);
    try {
      const strategy = await generateCareerStrategy(analysis.attributes);
      setCareerStrategy(strategy);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleGenerateMotion = async () => {
    if (!imageBase64) return;
    
    // Check for API key selection for Veo models (Paid feature)
    if ((window as any).aistudio) {
       const hasKey = await (window as any).aistudio.hasSelectedApiKey();
       if (!hasKey) {
          const success = await (window as any).aistudio.openSelectKey();
          if (!success) return; 
       }
    }

    setIsGeneratingVideo(true);
    try {
      const videoUrl = await generateMotionTest(imageBase64);
      setMotionVideoUrl(videoUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to generate motion test. Please try again.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleConfirm = () => {
    onSuccess({
      image: imagePreview,
      ...analysis,
      bio: generatedBio,
      // Pass these along if the main app supports them, or just use them for display here
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-space-grotesk text-white mb-2">Initialize Digital Twin</h2>
        <p className="text-slate-400">Upload a high-resolution scan. Spectra AI will analyze attributes and market fit.</p>
      </div>

      <div className="relative bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl overflow-hidden shadow-2xl min-h-[500px]">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-900/20 rounded-full blur-[120px] -z-10" />

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center text-red-200"
                  >
                    <AlertTriangle className="text-red-400 shrink-0" size={24} />
                    <div className="flex-1">
                      <p className="font-bold text-red-100">Scanning Failed</p>
                      <p className="text-sm opacity-80">{error}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleUseDemoData}
                        className="px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 flex items-center gap-1"
                      >
                        <Zap size={12} />
                        Demo Mode
                      </button>
                      <button 
                        onClick={() => setError(null)}
                        className="px-3 py-1.5 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/20 flex items-center gap-1"
                      >
                        <RefreshCw size={12} />
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div 
                className={`relative border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden ${
                  error ? 'border-red-500/30 bg-red-500/5' : 'border-white/20 hover:border-violet-500/50 hover:bg-slate-800/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                   <div className="relative w-full h-full">
                     <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-4 z-10 relative" />
                     <div className="absolute inset-0 bg-slate-900/50 z-0" />
                     
                     <div className="absolute bottom-4 right-4 z-20">
                        <button 
                          className="p-2 bg-slate-800 rounded-full border border-white/20 hover:bg-slate-700 text-white shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageBase64(null);
                          }}
                        >
                          <RefreshCw size={16} />
                        </button>
                     </div>
                   </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                      <Upload className={error ? "text-red-400" : "text-violet-400"} size={32} />
                    </div>
                    <p className="text-xl font-medium text-white">Drop scan file here</p>
                    <p className="text-sm text-slate-500 mt-2">Supports OBJ, STL, JPG, PNG (Max 50MB)</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={startAnalysis}
                  disabled={!imagePreview}
                  className="px-8 py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                >
                  <ScanLine size={20} />
                  Initiate Neural Scan
                </button>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="relative w-64 h-64 mb-8">
                <Hologram type="scan" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-emerald-400 text-xs font-mono tracking-widest animate-pulse">
                    ANALYZING TOPOLOGY...
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Processing Neural Data</h3>
              <p className="text-slate-400 max-w-md mb-2">Gemini is extracting facial keypoints and generating mesh metadata...</p>
              <div className="flex items-center gap-2 text-violet-400 text-sm">
                <TrendingUp size={14} />
                <span>Cross-referencing global casting trends...</span>
              </div>
            </motion.div>
          )}

          {step === 'review' && analysis && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex gap-8 flex-col lg:flex-row">
                <div className="w-full lg:w-1/3 space-y-4">
                  <div className="relative h-64 lg:h-80 w-full rounded-2xl overflow-hidden border border-white/10 bg-black group">
                     {motionVideoUrl ? (
                        <video 
                          src={motionVideoUrl} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline
                          className="w-full h-full object-cover" 
                        />
                     ) : (
                        <>
                          <Hologram type="preview" color="#10b981" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/60 backdrop-blur-sm">
                              {!isGeneratingVideo ? (
                                <button 
                                  onClick={handleGenerateMotion}
                                  className="px-4 py-2 bg-white text-slate-950 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                  <Film size={16} /> Generate Motion Test
                                </button>
                              ) : (
                                <div className="text-emerald-400 flex flex-col items-center gap-2">
                                   <Loader2 className="animate-spin" />
                                   <span className="text-xs font-mono">RENDERING VEO...</span>
                                </div>
                              )}
                          </div>
                        </>
                     )}
                     
                     {!motionVideoUrl && !isGeneratingVideo && (
                       <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
                             MESH VERIFIED
                          </span>
                       </div>
                     )}
                  </div>
                  
                  {/* Veo Description */}
                  {!motionVideoUrl && (
                     <div className="text-center text-xs text-slate-500">
                        Hover to generate a cinematic motion test powered by Veo.
                     </div>
                  )}
                </div>

                <div className="w-full lg:w-2/3 space-y-6">
                  {/* Analysis Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500 block mb-1">Age</span>
                        <span className="text-md font-bold text-white">{analysis.attributes.ageRange}</span>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500 block mb-1">Gender</span>
                        <span className="text-md font-bold text-white">{analysis.attributes.gender}</span>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500 block mb-1">Phenotype</span>
                        <span className="text-md font-bold text-white">{analysis.attributes.ethnicity}</span>
                      </div>
                      <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-500 block mb-1">Hair</span>
                        <span className="text-md font-bold text-white">{analysis.attributes.hairStyle}</span>
                      </div>
                  </div>

                  {/* Market Intelligence (Search Grounding) */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest">Market Intelligence</h3>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
                        <TrendingUp size={12} />
                        <span>LIVE SEARCH DATA</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingThemes.length > 0 ? trendingThemes.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-emerald-900/30 to-emerald-800/10 text-emerald-200 text-xs rounded-lg border border-emerald-500/20">
                          {tag}
                        </span>
                      )) : (
                         <span className="text-xs text-slate-500 italic">Analyzing market trends...</span>
                      )}
                      <div className="w-px h-6 bg-white/10 mx-2" />
                      {analysis.suggestedGenres.map((genre, i) => (
                        <span key={i} className="px-3 py-1.5 bg-violet-900/20 text-violet-200 text-xs rounded-lg border border-violet-500/20">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Insight (Thinking Mode) */}
                  <div className="bg-slate-800/30 rounded-2xl p-5 border border-white/5">
                     <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest flex items-center gap-2">
                           <BrainCircuit size={14} /> Strategic Projection
                        </h3>
                        {!careerStrategy && !isThinking && (
                           <button 
                              onClick={handleGenerateStrategy}
                              className="text-xs bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 px-3 py-1 rounded transition-colors"
                           >
                              Generate Strategy
                           </button>
                        )}
                     </div>
                     
                     {isThinking ? (
                        <div className="flex items-center gap-3 text-fuchsia-300/50 text-sm animate-pulse">
                           <div className="w-2 h-2 bg-fuchsia-500 rounded-full" />
                           Thinking... (Budget: 32k tokens)
                        </div>
                     ) : careerStrategy ? (
                        <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-fuchsia-500/50 pl-4">
                           {careerStrategy}
                        </p>
                     ) : (
                        <p className="text-sm text-slate-500 italic">
                           Unlock deep strategic insights for this digital twin's career path.
                        </p>
                     )}
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Generated Bio</h3>
                    <p className="text-slate-300 italic text-sm">"{generatedBio}"</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                 <button 
                  onClick={() => {
                    setStep('upload');
                  }}
                  className="px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={handleConfirm}
                  className="px-10 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-200"
                >
                  Mint Digital Asset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};