
import React from 'react';

interface ProcessingStatusProps {
  message: string;
  isScanning?: boolean;
  wireframePreview?: string | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ message, isScanning, wireframePreview }) => (
  <div className="flex flex-col items-center py-20 space-y-8 w-full max-w-lg mx-auto">
    <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden bg-black/90 border border-white/20 flex items-center justify-center shadow-2xl">
      {wireframePreview ? (
        <img 
          src={wireframePreview} 
          alt="Solid mask preview" 
          className="w-full h-full object-contain opacity-80 animate-pulse"
        />
      ) : (
        <div className="w-24 h-24 border-8 border-white/10 border-t-sky-400 rounded-full animate-spin"></div>
      )}
      
      {isScanning && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-1 bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,1)] animate-scan"></div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
        <span className="text-[10px] text-sky-400 font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-ping"></span>
          Solid Mask Engine
        </span>
        <span className="text-[10px] text-white/40 font-mono tracking-tighter">
          ADAPTIVE_GEOMETRY_LOCK
        </span>
      </div>
    </div>

    <div className="text-center px-4">
      <h3 className="text-2xl font-bold text-sky-900 mb-2 transition-all">{message}</h3>
      <p className="text-sky-600/60 font-medium">Binding pixels to cloud boundaries...</p>
    </div>

    <style>{`
      @keyframes scan {
        0% { transform: translateY(-10%); }
        50% { transform: translateY(110%); }
        100% { transform: translateY(-10%); }
      }
      .animate-scan {
        animation: scan 1.5s ease-in-out infinite;
      }
    `}</style>
  </div>
);
