
import React from 'react';

interface UserGuideInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserGuideInput: React.FC<UserGuideInputProps> = ({ value, onChange }) => (
  <div className="w-full max-w-lg space-y-2 bg-white/40 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/50 shadow-md">
    <label htmlFor="userGuide" className="block text-sky-900 font-bold text-xs tracking-tight mb-0.5">
      Guide the imagination (optional)
    </label>
    <input 
      id="userGuide"
      type="text"
      placeholder="I see a dragon... a ship... a puppy..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sky-900 text-sm placeholder-sky-400/60 shadow-inner"
    />
    <p className="text-[9px] text-sky-700/60 uppercase font-bold tracking-widest text-center">
      Leave empty for AI interpretation
    </p>
  </div>
);
