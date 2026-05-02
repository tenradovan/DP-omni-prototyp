import { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { BeforeCall } from './components/BeforeCall';
import { DuringCall } from './components/DuringCall';
import { AfterCall } from './components/AfterCall';
import { QueueMapping } from './components/QueueMapping';
import { SkillMatrix } from './components/SkillMatrix';

export type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

// Re-export types that components still import from App
export type { Role, Team, ClientType } from './context/DashboardContext';

// ─── Inner app (has access to context) ───────────────────────────────────────

function AppInner() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const { role, setRole } = useDashboard();

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen);

  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
    setCurrentScreen(newRole === 'operator' ? 'before' : 'queue-mapping');
  };

  const showNav = currentScreen !== 'login';

  return (
    <div className="min-h-screen bg-surface">
      {showNav && (
        <Navigation
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onRoleChange={handleRoleChange}
        />
      )}

      <main key={currentScreen}>
        {currentScreen === 'login'         && <LoginScreen onNavigate={handleNavigate} />}
        {currentScreen === 'before'        && <BeforeCall  onNavigate={handleNavigate} />}
        {currentScreen === 'during'        && <DuringCall  onNavigate={handleNavigate} />}
        {currentScreen === 'after'         && <AfterCall   onNavigate={handleNavigate} />}
        {currentScreen === 'queue-mapping' && <QueueMapping />}
        {currentScreen === 'skill-matrix'  && <SkillMatrix />}
      </main>
    </div>
  );
}

// ─── Root (provides context) ──────────────────────────────────────────────────

function App() {
  return (
    <DashboardProvider>
      <AppInner />
    </DashboardProvider>
  );
}

export default App;
