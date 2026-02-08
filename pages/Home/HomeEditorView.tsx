
import React from 'react';
import { Button } from '../../components/Button';
import { UserGuideInput } from '../../components/UserGuideInput';
import { CatModeToggle } from '../../components/CatModeToggle';
import { CloudSegment, ProcessingState } from '../../types';

interface HomeEditorViewProps {
  originalImage: string;
  state: ProcessingState;
  detectedSegments: CloudSegment[];
  selectedSegments: CloudSegment[];
  hasScanned: boolean;
  userGuide: string;
  catMode: boolean;
  toggleSegment: (seg: CloudSegment) => void;
  setUserGuide: (guide: string) => void;
  setCatMode: (enabled: boolean) => void;
  runDetection: () => void;
  reset: () => void;
  processImage: () => void;
}

export const HomeEditorView: React.FC<HomeEditorViewProps> = ({
  originalImage,
  state,
  detectedSegments,
  selectedSegments,
  hasScanned,
  userGuide,
  catMode,
  toggleSegment,
  setUserGuide,
  setCatMode,
  runDetection,
  reset,
  processImage
}) => {
  const isScanning = state.status === 'detecting';
  const hasMultipleSelection = selectedSegments.length > 1;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      {/* Main Selection Stage */}
      <div className="relative w-full rounded-[2.5rem] p-4 bg-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-white/30 overflow-hidden">
        <div className="relative rounded-[2rem] overflow-hidden group">
          <img 
            src={originalImage} 
            alt="Original Sky" 
            className={`w-full h-auto max-h-[60vh] object-contain mx-auto transition-all duration-1000 ${isScanning ? 'blur(12px) brightness(0.8)' : ''}`} 
          />
          
          {/* Unscanned Prompt Overlay */}
          {!hasScanned && !isScanning && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-sky-900/5 backdrop-blur-[2px]">
              <button 
                onClick={runDetection}
                className="bg-white/90 hover:bg-white text-sky-600 px-6 py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 border-b-4 border-sky-200"
              >
                ✨ Scan for Cloud Parts
              </button>
            </div>
          )}

          {/* Interaction Layer: Cloud Segments */}
          {!isScanning && detectedSegments.map((seg) => {
            const isSelected = selectedSegments.some(s => s.id === seg.id);
            return (
              <button
                key={seg.id}
                onClick={() => toggleSegment(seg)}
                className={`absolute z-20 rounded-2xl transition-all duration-500 group/seg
                  ${isSelected 
                    ? 'border-[3px] border-sky-400 bg-sky-400/10 shadow-[0_0_30px_rgba(56,189,248,0.4)] ring-2 ring-white/50' 
                    : 'border border-white/40 bg-white/5 hover:bg-white/15 hover:border-white/80'}
                `}
                style={{
                  top: `${seg.box2d[0] / 10}%`,
                  left: `${seg.box2d[1] / 10}%`,
                  height: `${(seg.box2d[2] - seg.box2d[0]) / 10}%`,
                  width: `${(seg.box2d[3] - seg.box2d[1]) / 10}%`,
                }}
              >
                <div className={`
                  absolute top-4 left-4 flex flex-col items-start gap-1 transition-transform duration-300
                  ${isSelected ? 'scale-105' : 'group-hover/seg:scale-105'}
                `}>
                  <div className="flex items-center gap-2">
                    <span className={`
                      px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2
                      ${isSelected 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-black/60 text-white/90 backdrop-blur-md group-hover/seg:bg-black/80'}
                    `}>
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                      )}
                      {seg.label}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <>
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white rounded-br-lg" />
                  </>
                )}
              </button>
            );
          })}

          {/* Loading Overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-sky-950/20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-white/20 border-t-sky-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 blur-xl bg-sky-400/30 animate-pulse rounded-full"></div>
              </div>
              <p className="text-white font-black uppercase tracking-[0.4em] text-xs drop-shadow-lg">{state.message}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Focus Indicator */}
      <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700 min-h-[4rem]">
        {hasScanned && (
          <>
            <p className="text-sky-900/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
              {selectedSegments.length > 0 ? `Current Focus (${selectedSegments.length})` : 'Full Atmosphere View'}
            </p>
            <h3 className="text-sky-900 font-black uppercase text-sm tracking-widest max-w-lg">
              {selectedSegments.length > 0 
                ? selectedSegments.map(s => s.label).join(' + ') 
                : 'Transforming the whole sky'}
            </h3>
          </>
        )}
      </div>

      {/* Controls & Inputs */}
      <div className="w-full flex flex-col items-center gap-6">
        <UserGuideInput value={userGuide} onChange={setUserGuide} />
        <CatModeToggle enabled={catMode} onToggle={setCatMode} />
      </div>

      {/* Actions */}
      <div className="flex gap-4 w-full max-w-lg">
        <Button 
          variant="secondary" 
          onClick={reset}
          className="flex-1 py-4 text-xs font-black uppercase tracking-widest"
        >
          Reset
        </Button>
        <Button 
          onClick={() => processImage()} 
          disabled={isScanning}
          className="flex-[2] py-4 text-xs font-black uppercase tracking-widest shadow-2xl bg-white text-sky-600 hover:scale-[1.02]"
        >
          {selectedSegments.length > 0 
            ? `Reimagine ${hasMultipleSelection ? 'Combined' : selectedSegments[0].label}` 
            : 'Reimagine Entire Sky'}
        </Button>
      </div>
    </div>
  );
};
