
import React from 'react';
import { useHomeState } from '../hooks/useHomeState';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ImageUploader } from '../components/ImageUploader';
import { CatModeToggle } from '../components/CatModeToggle';
import { SkyLens } from '../components/SkyLens';
import { HomeEditorView } from './Home/HomeEditorView';
import { HomeResultView } from './Home/HomeResultView';
import { ProcessingStatus } from '../components/ProcessingStatus';
import { ErrorDisplay } from '../components/ErrorDisplay';

export const Home: React.FC = () => {
  const {
    originalImage,
    resizedOriginal,
    silhouetteMap,
    generatedImage,
    interpretation,
    backstory,
    isNarrating,
    state,
    userGuide,
    catMode,
    showSkyLens,
    detectedSegments,
    selectedSegments,
    hasScanned,
    fileInputRef,
    setCatMode,
    setUserGuide,
    setShowSkyLens,
    toggleSegment,
    reset,
    handleFileUpload,
    handlePasteImage,
    handleUrlSubmit,
    loadSample,
    processImage,
    runDetection,
    handleSkyLensCapture,
    narrateBackstory
  } = useHomeState();

  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-4">
      <Header onReset={reset} />

      {showSkyLens && (
        <SkyLens 
          onClose={() => setShowSkyLens(false)} 
          onCapture={handleSkyLensCapture}
        />
      )}

      {!originalImage ? (
        <div className="flex flex-col items-center gap-6 w-full max-w-md pt-2">
          <div className="w-full flex flex-col items-center gap-2 mb-2">
            <Button 
              onClick={() => setShowSkyLens(true)} 
              className="w-full py-4 text-sky-600 bg-white/80 hover:bg-white shadow-xl ring-2 ring-white/50"
            >
              <span className="text-xl mr-2">✨</span> Launch Sky Lens (Live)
            </Button>
            <p className="text-sky-800/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
              </svg>
              Best on mobile for real-time viewing
            </p>
          </div>
          
          <div className="relative flex items-center gap-3 w-full">
            <div className="flex-grow h-px bg-sky-900/10"></div>
            <span className="text-sky-800/30 text-[9px] font-bold uppercase tracking-[0.2em]">or capture a moment</span>
            <div className="flex-grow h-px bg-sky-900/10"></div>
          </div>

          <CatModeToggle enabled={catMode} onToggle={setCatMode} />
          
          <ImageUploader 
            onFileUpload={handleFileUpload}
            onUrlSubmit={handleUrlSubmit}
            onPasteImage={handlePasteImage}
            onLoadSample={loadSample}
            fileInputRef={fileInputRef}
          />
        </div>
      ) : (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {(state.status === 'idle' || state.status === 'detecting') && (
            <HomeEditorView 
              originalImage={originalImage}
              state={state}
              detectedSegments={detectedSegments}
              selectedSegments={selectedSegments}
              hasScanned={hasScanned}
              userGuide={userGuide}
              catMode={catMode}
              toggleSegment={toggleSegment}
              setUserGuide={setUserGuide}
              setCatMode={setCatMode}
              runDetection={runDetection}
              reset={reset}
              processImage={processImage}
            />
          )}

          {(state.status === 'interpreting' || state.status === 'scanning' || state.status === 'generating') && (
            <ProcessingStatus 
              message={state.message || ''} 
              isScanning={state.status === 'scanning'} 
              wireframePreview={silhouetteMap}
            />
          )}

          {state.status === 'error' && (
            <ErrorDisplay message={state.message || ''} onRetry={reset} />
          )}

          {state.status === 'completed' && generatedImage && resizedOriginal && (
            <HomeResultView 
              resizedOriginal={resizedOriginal}
              generatedImage={generatedImage}
              interpretation={interpretation}
              backstory={backstory}
              isNarrating={isNarrating}
              catMode={catMode}
              reset={reset}
              processImage={processImage}
              narrateBackstory={narrateBackstory}
            />
          )}
        </div>
      )}
    </div>
  );
};
