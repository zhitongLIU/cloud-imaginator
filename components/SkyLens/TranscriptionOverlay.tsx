
import React from 'react';

interface TranscriptionOverlayProps {
  text: string;
}

export const TranscriptionOverlay: React.FC<TranscriptionOverlayProps> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="max-w-md bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-center animate-in fade-in slide-in-from-bottom-2 pointer-events-none">
      <p className="text-sky-100 text-sm font-medium leading-relaxed italic">
        "{text.trim()}"
      </p>
    </div>
  );
};
