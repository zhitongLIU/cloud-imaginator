
import React, { useEffect } from 'react';
import { Button } from './Button';

interface ImageUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlSubmit: (url: string) => void;
  onPasteImage: (base64: string) => void;
  onLoadSample: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onFileUpload, 
  onUrlSubmit, 
  onPasteImage,
  onLoadSample, 
  fileInputRef 
}) => {
  const [url, setUrl] = React.useState('');

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              onPasteImage(result);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onPasteImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-[16/10] border-3 border-dashed border-white/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-white hover:bg-white/10 group bg-sky-300/20 backdrop-blur-sm shadow-lg"
      >
        <div className="p-3 bg-white rounded-full shadow-md mb-2 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-sky-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <p className="text-sky-900 font-semibold text-sm">Upload a Cloud Photo</p>
        <p className="text-sky-700/60 text-[10px] text-center px-4">
          Or tap to choose file • <span className="font-bold text-sky-900/40">Paste (Ctrl+V)</span>
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileUpload} 
          className="hidden" 
          accept="image/*"
        />
      </div>
      
      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-grow h-px bg-white/30"></div>
        <span className="text-sky-800/40 text-[9px] font-bold uppercase tracking-widest">or</span>
        <div className="flex-grow h-px bg-white/30"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input 
          type="url"
          placeholder="Paste image URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sky-900 text-xs placeholder-sky-400 transition-all"
        />
        <Button type="submit" variant="secondary" disabled={!url.trim()} className="w-full py-1.5 text-xs">
          Fetch from URL
        </Button>
      </form>

      <div className="text-center pt-1">
        <button 
          onClick={onLoadSample}
          className="text-sky-700 hover:text-sky-900 text-[10px] font-bold underline underline-offset-4 decoration-sky-300/40 transition-colors"
        >
          Try a sample cloud
        </button>
      </div>
    </div>
  );
};
