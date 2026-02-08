
import React, { useState } from 'react';
import { useSkyLens } from '../hooks/useSkyLens';
import { GuideOverlay } from './SkyLens/GuideOverlay';
import { TranscriptionOverlay } from './SkyLens/TranscriptionOverlay';
import { Button } from './Button';

interface SkyLensProps {
  onClose: () => void;
  onCapture: (image: string, aiPrompt: string) => void;
}

export const SkyLens: React.FC<SkyLensProps> = ({ onClose, onCapture }) => {
  const [showGuide, setShowGuide] = useState(true);
  const {
    isActive,
    error,
    transcription,
    lastFullTranscription,
    zoom,
    zoomCapabilities,
    videoRef,
    canvasRef,
    startLens,
    stopAll,
    handleZoomChange,
    handleCapture
  } = useSkyLens(onCapture);

  const handleStart = () => {
    setShowGuide(false);
    startLens();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Viewfinder Layer */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Interface Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col p-6 pointer-events-none">
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="bg-sky-500/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 pointer-events-auto">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Sky Lens {isActive && 'Live'}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 pointer-events-auto transition-all"
          >
            ✕
          </button>
        </div>

        {/* Start Guide Overlay */}
        {showGuide && !isActive && (
          <GuideOverlay onStart={handleStart} />
        )}

        {/* Zoom Control Sidebar */}
        {isActive && zoomCapabilities && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 pointer-events-auto">
            <div className="h-48 flex items-center justify-center bg-black/30 backdrop-blur-md p-3 rounded-full border border-white/10">
              <input 
                type="range"
                min={zoomCapabilities.min}
                max={zoomCapabilities.max}
                step={zoomCapabilities.step}
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-32 -rotate-90 origin-center accent-sky-400 cursor-pointer"
                style={{ appearance: 'slider-vertical' } as any}
              />
            </div>
            <div className="text-[10px] text-white font-black bg-black/40 px-2 py-1 rounded border border-white/10">
              {zoom.toFixed(1)}x
            </div>
          </div>
        )}

        {/* Bottom Actions Area */}
        <div className="mt-auto mb-12 flex flex-col items-center gap-6">
          <TranscriptionOverlay text={transcription || lastFullTranscription} />

          {error && (
            <div className="bg-red-500/20 backdrop-blur-md p-3 rounded-xl border border-red-500/40 text-red-200 text-xs text-center mb-4">
              {error}
            </div>
          )}

          {!isActive ? (
            !showGuide && (
              <Button 
                onClick={startLens} 
                variant="primary" 
                className="px-12 py-4 text-lg shadow-2xl pointer-events-auto"
              >
                Open Your Sky Eyes
              </Button>
            )
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
               <Button 
                onClick={handleCapture} 
                variant="primary" 
                className="px-12 py-4 text-lg shadow-2xl pointer-events-auto bg-sky-400/90 text-white hover:bg-sky-400"
              >
                📸 Reimagine this Moment
              </Button>
              <div className="flex flex-col items-center gap-2">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Observing Atmosphere...</p>
                <Button 
                  onClick={stopAll} 
                  variant="danger" 
                  className="px-10 pointer-events-auto scale-75 opacity-60 hover:opacity-100"
                >
                  Close Lens
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full opacity-20 pointer-events-none" />
    </div>
  );
};
