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

type CycleEntry = { clientType: import('./context/DashboardContext').ClientType; mockClientId: string };
const CLIENT_CYCLE: CycleEntry[] = [
  { clientType: 'standard',  mockClientId: 'standard' },
  { clientType: 'standard',  mockClientId: 'standardNoEmail' },
  { clientType: 'standard',  mockClientId: 'standardAuto' },
  { clientType: 'company',   mockClientId: 'company' },
  { clientType: 'broker',    mockClientId: 'broker' },
  { clientType: 'unknown',   mockClientId: 'unknown' },
  { clientType: 'ambiguous', mockClientId: 'ambiguous' },
];

function AppInner() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [cycleIndex, setCycleIndex] = useState(0);
  const { role, setRole, setClientType, setMockClientId } = useDashboard();

  const handleNavigate = (screen: Screen) => {
    // Cycle to next client whenever returning to BeforeCall from AfterCall
    if (screen === 'before' && currentScreen === 'after') {
      const next = (cycleIndex + 1) % CLIENT_CYCLE.length;
      setCycleIndex(next);
      const entry = CLIENT_CYCLE[next];
      setClientType(entry.clientType);
      setMockClientId(entry.mockClientId);
    }
    setCurrentScreen(screen);
  };

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
