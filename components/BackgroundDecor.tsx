
import React from 'react';

export const BackgroundDecor: React.FC = () => (
  <>
    <div className="fixed top-20 left-10 opacity-20 pointer-events-none -z-10 animate-float-slow">
      <svg width="100" height="60" viewBox="0 0 24 24" fill="white">
        <path d="M17.5,19c-0.2,0-0.3,0-0.5,0c-1.3,0-2.4-0.9-2.7-2.1c-1-0.2-1.9-0.8-2.6-1.5c-0.7,0.8-1.7,1.3-2.7,1.5 c-0.3,1.3-1.4,2.2-2.7,2.2c-0.1,0-0.3,0-0.4,0c-1.6-0.1-2.8-1.4-2.8-3c0-0.3,0-0.5,0.1-0.8C2.5,14.6,2,13.7,2,12.7 c0-1.7,1.2-3.2,2.9-3.4c0-0.1,0-0.3,0-0.4c0-2.2,1.8-4,4-4c1.1,0,2.1,0.5,2.9,1.2c0.7-0.7,1.8-1.2,2.9-1.2c2.2,0,4,1.8,4,4 c0,0.1,0,0.3,0,0.4c1.6,0.2,2.9,1.7,2.9,3.4c0,1-0.5,1.9-1.2,2.5c0.1,0.3,0.1,0.5,0.1,0.8C20.4,17.6,19.1,18.9,17.5,19z"/>
      </svg>
    </div>
    <div className="fixed bottom-20 right-10 opacity-10 pointer-events-none -z-10 animate-float">
      <svg width="150" height="90" viewBox="0 0 24 24" fill="white">
        <path d="M17.5,19c-0.2,0-0.3,0-0.5,0c-1.3,0-2.4-0.9-2.7-2.1c-1-0.2-1.9-0.8-2.6-1.5c-0.7,0.8-1.7,1.3-2.7,1.5 c-0.3,1.3-1.4,2.2-2.7,2.2c-0.1,0-0.3,0-0.4,0c-1.6-0.1-2.8-1.4-2.8-3c0-0.3,0-0.5,0.1-0.8C2.5,14.6,2,13.7,2,12.7 c0-1.7,1.2-3.2,2.9-3.4c0-0.1,0-0.3,0-0.4c0-2.2,1.8-4,4-4c1.1,0,2.1,0.5,2.9,1.2c0.7-0.7,1.8-1.2,2.9-1.2c2.2,0,4,1.8,4,4 c0,0.1,0,0.3,0,0.4c1.6,0.2,2.9,1.7,2.9,3.4c0,1-0.5,1.9-1.2,2.5c0.1,0.3,0.1,0.5,0.1,0.8C20.4,17.6,19.1,18.9,17.5,19z"/>
      </svg>
    </div>
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-20px) translateX(10px); }
      }
      @keyframes float-slow {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-30px) translateX(-15px); }
      }
      .animate-float { animation: float 8s ease-in-out infinite; }
      .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
    `}</style>
  </>
);
