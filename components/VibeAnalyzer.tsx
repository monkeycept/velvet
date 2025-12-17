import React, { useState, useRef } from 'react';
import { VibeData } from '../types';
import { analyzeImageVibe } from '../services/geminiService';
import { Button } from './Button';

interface VibeAnalyzerProps {
  onVibeDetected: (data: VibeData) => void;
}

export const VibeAnalyzer: React.FC<VibeAnalyzerProps> = ({ onVibeDetected }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Convert to base64 for API
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      analyze(base64String);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async (base64: string) => {
    setLoading(true);
    try {
      const data = await analyzeImageVibe(base64);
      onVibeDetected(data);
    } catch (err) {
      console.error(err);
      alert("Could not analyze the vibe. Please try a different image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
      <h2 className="text-3xl font-serif text-velvet-accent mb-6 italic">
        "Define your shared aesthetic."
      </h2>
      
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-md aspect-[4/5] border border-dashed border-velvet-accent/30 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-velvet-accent/60 hover:bg-velvet-accent/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-full border border-velvet-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-velvet-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-velvet-muted font-sans text-sm tracking-widest uppercase">Upload a photo of you two</p>
        </div>
      ) : (
        <div className="relative w-full max-w-md aspect-[4/5] rounded-sm overflow-hidden mb-8 group">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            {loading ? (
              <div className="text-velvet-accent font-serif text-xl animate-pulse">Analyzing Vibe...</div>
            ) : (
              <div className="text-white/80 font-sans text-xs tracking-widest uppercase">Analysis Complete</div>
            )}
          </div>
        </div>
      )}

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </div>
  );
};