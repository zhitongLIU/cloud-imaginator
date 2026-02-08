
import React from 'react';

interface CatModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

/**
 * Re-implemented CatModeToggle using a semantic button element.
 * Fixed non-standard Tailwind height/spacing classes that were preventing interaction.
 * Improved visual feedback and animation.
 */
export const CatModeToggle: React.FC<CatModeToggleProps> = ({ enabled, onToggle, className = '' }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(!enabled)}
      className={`
        flex items-center gap-4 
        bg-white/90 backdrop-blur-md 
        px-6 py-3 rounded-full 
        border-2 border-white 
        shadow-lg hover:shadow-xl hover:bg-white 
        transition-all duration-300 active:scale-95 
        cursor-pointer
        relative z-50
        ${className}
      `}
      title={enabled ? "Cat Mode is ON" : "Turn on Cat Mode"}
    >
      <span className={`
        text-sky-900 font-black text-xs uppercase tracking-widest select-none 
        flex items-center gap-2 transition-colors duration-300
        ${enabled ? 'text-sky-600' : 'text-slate-500'}
      `}>
        Cat Mode 🐱
      </span>
      
      <div className={`
        relative w-12 h-6 rounded-full transition-colors duration-500 ease-in-out shadow-inner
        ${enabled ? 'bg-sky-500' : 'bg-slate-200'}
      `}>
        <div className={`
          absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md
          transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${enabled ? 'translate-x-6' : 'translate-x-0'}
        `} />
      </div>
    </button>
  );
};
