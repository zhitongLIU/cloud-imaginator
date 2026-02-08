
import React from 'react';
import { Button } from '../../components/Button';
import { ImageComparison } from '../../components/ImageComparison';
import { CloudInterpretation } from '../../types';

interface HomeResultViewProps {
  resizedOriginal: string;
  generatedImage: string;
  interpretation: CloudInterpretation | null;
  backstory: string | null;
  isNarrating: boolean;
  catMode: boolean;
  reset: () => void;
  processImage: () => void;
  narrateBackstory: () => void;
}

export const HomeResultView: React.FC<HomeResultViewProps> = ({
  resizedOriginal,
  generatedImage,
  interpretation,
  backstory,
  isNarrating,
  catMode,
  reset,
  processImage,
  narrateBackstory
}) => (
  <div className="space-y-8 pb-10">
    <div className="text-center max-w-3xl mx-auto px-4">
      <div className="inline-block bg-sky-950/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-sky-800 uppercase tracking-[0.2em] mb-2 border border-sky-950/5">
        Reimagined {catMode && '• Feline Bias'}
      </div>
      <h2 className="text-3xl font-black text-sky-950 mb-2 tracking-tight">
        {interpretation?.objectName}
      </h2>
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/40 mb-6">
         <p className="text-sky-900 font-medium italic">
          &ldquo;{interpretation?.description}&rdquo;
        </p>
      </div>

      {/* Atmospheric Narrator Button */}
      <div className="flex justify-center mb-8">
        <Button 
          onClick={narrateBackstory} 
          isLoading={isNarrating}
          className="bg-sky-600 text-white hover:bg-sky-700 px-8 py-3 ring-4 ring-sky-500/20"
        >
          {isNarrating ? 'Narrating Legend...' : '✨ Hear the Legend'}
        </Button>
      </div>

      {/* Backstory Display */}
      {backstory && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 max-w-2xl mx-auto bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl mb-8">
          <h4 className="text-sky-900 font-black uppercase text-[10px] tracking-[0.3em] mb-4">The Ancient Sky Lore</h4>
          <p className="text-sky-800 font-serif text-lg leading-relaxed italic">
            {backstory}
          </p>
        </div>
      )}
    </div>
    
    <ImageComparison 
      originalSrc={resizedOriginal} 
      transformedSrc={generatedImage} 
    />

    <div className="flex flex-wrap justify-center gap-4">
      <Button variant="secondary" onClick={reset}>New Sky</Button>
      <Button variant="secondary" onClick={() => processImage()}>Regenerate</Button>
      <a 
        href={generatedImage} 
        download={`reimagined-${interpretation?.objectName.toLowerCase().replace(/\s+/g, '-')}.png`}
        className="no-underline"
      >
        <Button>Download Art</Button>
      </a>
    </div>
  </div>
);
