import React, { useState } from 'react';
import { AppMode, VibeData } from './types';
import { VibeAnalyzer } from './components/VibeAnalyzer';
import { DateConcierge } from './components/DateConcierge';
import { MuseWriter } from './components/MuseWriter';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.VIBE);
  const [vibe, setVibe] = useState<VibeData | null>(null);

  const handleVibeDetected = (data: VibeData) => {
    setVibe(data);
    // Automatically move to Muse or Dates after analysis, or stay to show details
    // For flow, let's show the nav and let user choose.
  };

  return (
    <div className="min-h-screen bg-velvet-950 text-velvet-muted font-sans selection:bg-velvet-accent/20 selection:text-velvet-accent">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-velvet-950/80 border-b border-white/5">
        <h1 
          className="text-2xl font-serif tracking-tighter text-velvet-accent cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => { setMode(AppMode.VIBE); setVibe(null); }}
        >
          VELVET
        </h1>
        
        {vibe && (
          <nav className="flex gap-8">
            <button 
              onClick={() => setMode(AppMode.DATES)}
              className={`text-xs uppercase tracking-widest transition-colors ${mode === AppMode.DATES ? 'text-white' : 'text-velvet-muted hover:text-white'}`}
            >
              Concierge
            </button>
            <button 
              onClick={() => setMode(AppMode.MUSE)}
              className={`text-xs uppercase tracking-widest transition-colors ${mode === AppMode.MUSE ? 'text-white' : 'text-velvet-muted hover:text-white'}`}
            >
              Muse
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 container mx-auto">
        {!vibe ? (
          <VibeAnalyzer onVibeDetected={handleVibeDetected} />
        ) : (
          <>
            {/* Vibe Summary Bar */}
            <div className="flex flex-col items-center mb-12 animate-fade-in">
              <span className="text-[10px] uppercase tracking-[0.3em] text-velvet-accent/70 mb-2">Current Vibe</span>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 text-center">{vibe.summary}</h2>
              <div className="flex gap-2">
                {vibe.keywords.map((k, i) => (
                  <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-velvet-muted">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Routes */}
            {mode === AppMode.VIBE && (
              <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
                <p className="font-serif text-xl italic text-velvet-muted/80 leading-relaxed mb-12">
                  "{vibe.description}"
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    onClick={() => setMode(AppMode.DATES)}
                    className="group border border-velvet-800 p-8 hover:bg-velvet-900/50 transition-all text-left"
                   >
                     <span className="block text-velvet-accent font-serif text-xl mb-2 group-hover:translate-x-1 transition-transform">Atmosphere Concierge &rarr;</span>
                     <span className="text-xs text-velvet-muted uppercase tracking-wider">Find matched locations</span>
                   </button>
                   <button 
                    onClick={() => setMode(AppMode.MUSE)}
                    className="group border border-velvet-800 p-8 hover:bg-velvet-900/50 transition-all text-left"
                   >
                     <span className="block text-velvet-accent font-serif text-xl mb-2 group-hover:translate-x-1 transition-transform">The Muse &rarr;</span>
                     <span className="text-xs text-velvet-muted uppercase tracking-wider">Poetry, Stories & Connection</span>
                   </button>
                </div>
              </div>
            )}

            {mode === AppMode.DATES && <DateConcierge vibe={vibe} />}
            {mode === AppMode.MUSE && <MuseWriter vibe={vibe} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-4 text-center border-t border-white/5 bg-velvet-950">
        <p className="text-[10px] text-velvet-muted/40 uppercase tracking-[0.2em]">
          Powered by Gemini 2.5
        </p>
      </footer>
    </div>
  );
};

export default App;