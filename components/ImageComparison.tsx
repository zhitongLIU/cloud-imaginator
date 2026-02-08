
import React, { useState } from 'react';

interface ImageComparisonProps {
  originalSrc: string;
  transformedSrc: string;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({ originalSrc, transformedSrc }) => {
  const [alpha, setAlpha] = useState(0.5);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-sky-200/50 backdrop-blur-sm ring-1 ring-white/20">
        {/* Original Image (Sets the natural height of the container) */}
        <img 
          src={originalSrc} 
          alt="Original Cloud" 
          className="w-full h-auto block pointer-events-none object-cover"
        />
        
        {/* Transformed Image (Overlaid perfectly) */}
        <img 
          src={transformedSrc} 
          alt="Imagined Cloud" 
          className="absolute inset-0 w-full h-full object-cover block transition-opacity duration-300 pointer-events-none"
          style={{ opacity: alpha }}
        />

        {/* Labels Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md text-white text-[10px] md:text-xs px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider font-bold">
            Original Sky
          </span>
          <span className="bg-white/40 backdrop-blur-md text-sky-900 text-[10px] md:text-xs px-3 py-1 rounded-full border border-sky-200/50 uppercase tracking-wider font-bold">
            AI Imagination
          </span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/40 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sky-900 font-bold text-sm tracking-tight">Magic intensity</label>
          <span className="text-sky-600 font-mono text-xs font-bold">{Math.round(alpha * 100)}%</span>
        </div>
        <div className="relative px-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500 transition-all hover:accent-sky-600"
          />
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-sky-400 font-bold uppercase tracking-widest px-1">
          <span>Real World</span>
          <span>Dream World</span>
        </div>
      </div>
    </div>
  );
};
