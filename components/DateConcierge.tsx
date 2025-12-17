import React, { useState } from 'react';
import { VibeData, DateSpot } from '../types';
import { findDateSpots } from '../services/geminiService';
import { Button } from './Button';

interface DateConciergeProps {
  vibe: VibeData;
}

export const DateConcierge: React.FC<DateConciergeProps> = ({ vibe }) => {
  const [location, setLocation] = useState('');
  const [spots, setSpots] = useState<DateSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const results = await findDateSpots(location, vibe.keywords);
      setSpots(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-velvet-accent mb-2">Atmosphere Concierge</h2>
        <p className="text-velvet-muted font-sans text-sm tracking-wide">
          Curating locations matching your <span className="text-white italic">"{vibe.summary}"</span> vibe.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto mb-16">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your city (e.g. New York, Paris)"
          className="flex-1 bg-transparent border-b border-velvet-accent/30 py-3 text-white font-serif placeholder-velvet-muted/50 focus:outline-none focus:border-velvet-accent transition-colors text-center md:text-left"
        />
        <Button type="submit" disabled={loading || !location}>
          {loading ? 'Curating...' : 'Find Spots'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {spots.map((spot, index) => (
          <div 
            key={index} 
            className="group relative p-8 border border-velvet-800 bg-velvet-900/30 hover:bg-velvet-900/50 transition-all duration-500"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-velvet-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="text-xl font-serif text-white mb-3 tracking-wide">{spot.name}</h3>
            <p className="text-velvet-muted text-sm leading-relaxed font-sans font-light mb-4">
              {spot.description}
            </p>
            {spot.mapLink && (
               <a href={spot.mapLink} target="_blank" rel="noreferrer" className="text-xs text-velvet-accent hover:underline uppercase tracking-widest">
                 View on Maps
               </a>
            )}
          </div>
        ))}
      </div>

      {searched && !loading && spots.length === 0 && (
        <div className="text-center text-velvet-muted italic font-serif">
          No spots found. Try a broader location name.
        </div>
      )}
    </div>
  );
};