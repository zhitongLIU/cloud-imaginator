
import React from 'react';
import { Button } from '../Button';

interface GuideOverlayProps {
  onStart: () => void;
}

export const GuideOverlay: React.FC<GuideOverlayProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 z-50 pointer-events-auto">
      <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-sky-400/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-400/30">
          <span className="text-3xl">🔭</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Sky Lens Guide</h3>
        <ul className="text-left space-y-4 mb-8">
          <li className="flex gap-4 text-sky-100 text-sm">
            <span className="text-lg">☁️</span>
            <span>Point your camera at the clouds and let the atmosphere settle.</span>
          </li>
          <li className="flex gap-4 text-sky-100 text-sm">
            <span className="text-lg">🎙️</span>
            <span>Gemini will observe in real-time and <b>speak to you</b> about what it sees.</span>
          </li>
          <li className="flex gap-4 text-sky-100 text-sm">
            <span className="text-lg">🎨</span>
            <span>Once you find a shape you love, tap <b>Capture</b> to turn it into solid art.</span>
          </li>
        </ul>
        <Button onClick={onStart} className="w-full py-4 text-sky-900 bg-white font-black uppercase tracking-widest text-xs">
          I'm Ready to Observe
        </Button>
      </div>
    </div>
  );
};
