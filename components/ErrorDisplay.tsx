
import React from 'react';
import { Button } from './Button';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  // Simple heuristic to determine error type for contextual tips
  const isFetchError = message.toLowerCase().includes('fetch') || message.toLowerCase().includes('url');
  const isSafetyError = message.toLowerCase().includes('safety') || message.toLowerCase().includes('content');
  const isAiError = message.toLowerCase().includes('engine') || message.toLowerCase().includes('imagination');

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Abstract background shape for visual interest */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            {isFetchError ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            ) : isAiError ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ) : (
              <span className="text-4xl">⛈️</span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-sky-950 mb-3 tracking-tight">
            Sky's a bit cloudy...
          </h3>
          
          <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-4 mb-8 w-full">
            <p className="text-red-800 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <div className="w-full text-left bg-white/30 rounded-3xl p-6 border border-white/40 mb-8">
            <h4 className="text-sky-900 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Troubleshooting Tips
            </h4>
            <ul className="space-y-3">
              {isFetchError && (
                <>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Check if the URL ends in .jpg, .png, or .webp
                  </li>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Some sites (like Google Drive or social media) block direct image links
                  </li>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Try saving the image and uploading it instead
                  </li>
                </>
              )}
              {isAiError && (
                <>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Try an image where the clouds are more distinct against the blue
                  </li>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Shorten your guide prompt to be more specific (e.g., "a giant turtle")
                  </li>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Check your internet connection and try again
                  </li>
                </>
              )}
              {isSafetyError && (
                <>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Ensure your image doesn't contain sensitive content
                  </li>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Avoid prompt words that might trigger safety filters
                  </li>
                </>
              )}
              {!isFetchError && !isAiError && !isSafetyError && (
                <>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Refresh the page and try a different photo
                  </li>
                  <li className="flex gap-3 text-sky-800 text-sm">
                    <span className="text-sky-400 font-bold">•</span>
                    Try using one of our sample clouds to test functionality
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button variant="danger" onClick={onRetry} className="sm:flex-1">
              Reset & Try Again
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} className="sm:flex-1">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
