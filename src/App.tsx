import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { BeforeCall } from './components/BeforeCall';
import { DuringCall } from './components/DuringCall';
import { AfterCall } from './components/AfterCall';
import { QueueMapping } from './components/QueueMapping';
import { SkillMatrix } from './components/SkillMatrix';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const showNav = currentScreen !== 'login';

  return (
    <div className="min-h-screen bg-surface">
      {showNav && <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />}

      <main key={currentScreen}>
        {currentScreen === 'login' && <LoginScreen onNavigate={setCurrentScreen} />}
        {currentScreen === 'before' && <BeforeCall onNavigate={setCurrentScreen} />}
        {currentScreen === 'during' && <DuringCall onNavigate={setCurrentScreen} />}
        {currentScreen === 'after' && <AfterCall onNavigate={setCurrentScreen} />}
        {currentScreen === 'queue-mapping' && <QueueMapping />}
        {currentScreen === 'skill-matrix' && <SkillMatrix />}
      </main>
    </div>
  );
}

export default App;
