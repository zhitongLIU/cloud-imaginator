
import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => (
  <header 
    className="text-center space-y-0.5 cursor-pointer group select-none"
    onClick={onReset}
    title="Return to home"
  >
    <h1 className="text-4xl md:text-6xl font-bold text-sky-900 tracking-tight transition-all duration-300 group-hover:scale-105 active:scale-95">
      Cloud <span className="text-white drop-shadow-md">Imaginator</span>
    </h1>
    <p className="text-sky-700 font-light text-base md:text-lg transition-opacity group-hover:opacity-80">
      What do you see in the sky today?
    </p>
  </header>
);
