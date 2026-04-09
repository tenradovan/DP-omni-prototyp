import { useState } from 'react';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const [adminOpen, setAdminOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isDashboard = ['before', 'during', 'after'].includes(currentScreen);
  const isAdmin = ['queue-mapping', 'skill-matrix'].includes(currentScreen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-card h-14 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('before')}>
        <div className="w-7 h-7 rounded-lg bg-lime-500 flex items-center justify-center">
          <span className="font-sans font-bold text-direct-800 text-sm">D</span>
        </div>
        <span className="font-sans font-bold text-direct-800 text-[15px]">Direct pojišťovna</span>
      </div>

      {/* Center: Nav Items */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        <button
          onClick={() => onNavigate('before')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            isDashboard ? 'bg-direct-800 text-white' : 'text-direct-800 hover:bg-gray-25'
          }`}
        >
          Dashboard
        </button>

        <div className="relative">
          <button
            onClick={() => setAdminOpen(!adminOpen)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              isAdmin ? 'bg-direct-800 text-white' : 'text-direct-800 hover:bg-gray-25'
            }`}
          >
            Admin
            <svg className={`w-3.5 h-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {adminOpen && (
            <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-float py-1.5 animate-fade-in">
              <button
                onClick={() => { onNavigate('queue-mapping'); setAdminOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentScreen === 'queue-mapping' ? 'bg-lime-50 text-direct-800 font-semibold' : 'text-direct-800 hover:bg-gray-25'}`}
              >
                Mapování front
              </button>
              <button
                onClick={() => { onNavigate('skill-matrix'); setAdminOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${currentScreen === 'skill-matrix' ? 'bg-lime-50 text-direct-800 font-semibold' : 'text-direct-800 hover:bg-gray-25'}`}
              >
                Skill Matice
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phase Indicator (dashboard only) */}
      {isDashboard && (
        <div className="flex items-center gap-1 mr-4">
          {(['before', 'during', 'after'] as const).map((phase, i) => {
            const labels = { before: 'Před hovorem', during: 'Během hovoru', after: 'Po hovoru' };
            const isActive = currentScreen === phase;
            const isPast = ['before', 'during', 'after'].indexOf(currentScreen) > i;
            return (
              <div key={phase} className="flex items-center gap-1">
                {i > 0 && <div className={`w-4 h-px ${isPast || isActive ? 'bg-lime-500' : 'bg-gray-100'}`} />}
                <button
                  onClick={() => onNavigate(phase)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-lime-500 text-direct-800'
                      : isPast
                        ? 'bg-lime-50 text-direct-700'
                        : 'bg-gray-25 text-gray-400'
                  }`}
                >
                  {labels[phase]}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* User */}
      <div className="relative">
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm text-gray-500 font-medium">Petr Svoboda</span>
          <div className="w-8 h-8 rounded-full bg-direct-800 flex items-center justify-center">
            <span className="font-sans font-semibold text-white text-xs">PS</span>
          </div>
        </button>

        {userOpen && (
          <div className="absolute top-full mt-2 right-0 w-40 bg-white rounded-xl shadow-float py-1.5 animate-fade-in">
            <div className="px-4 py-1.5 text-[11px] text-gray-400 font-medium">Tým: KC</div>
            <button
              onClick={() => { onNavigate('login'); setUserOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-direct-800 hover:bg-gray-25 transition-colors"
            >
              Odhlásit se
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
