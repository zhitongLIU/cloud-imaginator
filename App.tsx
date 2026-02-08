
import React from 'react';
import { Home } from './pages/Home';
import { BackgroundDecor } from './components/BackgroundDecor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <Home />
      <BackgroundDecor />
    </div>
  );
};

export default App;
