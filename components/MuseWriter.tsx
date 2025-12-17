import React, { useState } from 'react';
import { VibeData } from '../types';
import { generateMuseContent } from '../services/geminiService';
import { Button } from './Button';

interface MuseWriterProps {
  vibe: VibeData;
}

export const MuseWriter: React.FC<MuseWriterProps> = ({ vibe }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<'poem' | 'story' | 'question' | null>(null);

  const generate = async (type: 'poem' | 'story' | 'question') => {
    setLoading(true);
    setActiveType(type);
    try {
      const result = await generateMuseContent(type, vibe);
      setContent(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-velvet-accent italic mb-4">The Muse</h2>
        <p className="text-velvet-muted font-sans text-sm tracking-wide max-w-md mx-auto">
          Let AI articulate the unspoken bond of your <span className="text-white">"{vibe.summary}"</span> aesthetic.
        </p>
      </div>

      <div className="flex gap-4 mb-12">
        <button 
          onClick={() => generate('poem')}
          className={`text-xs uppercase tracking-[0.2em] py-2 px-4 transition-colors ${activeType === 'poem' ? 'text-velvet-accent border-b border-velvet-accent' : 'text-velvet-muted hover:text-white'}`}
        >
          Poetry
        </button>
        <button 
          onClick={() => generate('story')}
          className={`text-xs uppercase tracking-[0.2em] py-2 px-4 transition-colors ${activeType === 'story' ? 'text-velvet-accent border-b border-velvet-accent' : 'text-velvet-muted hover:text-white'}`}
        >
          Flash Fiction
        </button>
        <button 
          onClick={() => generate('question')}
          className={`text-xs uppercase tracking-[0.2em] py-2 px-4 transition-colors ${activeType === 'question' ? 'text-velvet-accent border-b border-velvet-accent' : 'text-velvet-muted hover:text-white'}`}
        >
          Deep Question
        </button>
      </div>

      <div className="min-h-[200px] flex items-center justify-center w-full">
        {loading ? (
          <div className="flex space-x-2">
            <div className="w-1.5 h-1.5 bg-velvet-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 bg-velvet-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-1.5 bg-velvet-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : content ? (
          <div className="text-center animate-fade-in w-full">
            <p className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed whitespace-pre-line italic">
              {content}
            </p>
            <div className="w-12 h-[1px] bg-velvet-accent/30 mx-auto mt-8"></div>
          </div>
        ) : (
          <div className="text-velvet-muted/30 font-serif italic text-lg">
            Select a muse to begin...
          </div>
        )}
      </div>
    </div>
  );
};