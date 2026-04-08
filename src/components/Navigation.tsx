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
    <nav className="fixed top-4 left-4 right-4 z-50 glass-white rounded-xl ghost-border shadow-ambient px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('before')}>
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
          <span className="font-display font-bold text-brand-on-primary text-sm">D</span>
        </div>
        <span className="font-display font-bold text-on-surface text-lg">Direct pojišťovna</span>
      </div>

      {/* Nav Items */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => onNavigate('before')}
          className="relative py-2 font-body font-medium text-on-surface transition-colors hover:text-brand-on-primary"
        >
          Dashboard
          {isDashboard && (
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-primary rounded-full" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setAdminOpen(!adminOpen)}
            className="relative py-2 font-body font-medium text-on-surface transition-colors hover:text-brand-on-primary flex items-center gap-1"
          >
            Admin
            <svg className={`w-4 h-4 transition-transform ${adminOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isAdmin && (
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-primary rounded-full" />
            )}
          </button>

          {adminOpen && (
            <div className="absolute top-full mt-2 right-0 w-52 bg-surface-container-lowest rounded-xl ghost-border shadow-ambient py-2 animate-fade-in">
              <button
                onClick={() => { onNavigate('queue-mapping'); setAdminOpen(false); }}
                className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors ${currentScreen === 'queue-mapping' ? 'bg-surface-container-low text-brand-on-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'}`}
              >
                Mapování front
              </button>
              <button
                onClick={() => { onNavigate('skill-matrix'); setAdminOpen(false); }}
                className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors ${currentScreen === 'skill-matrix' ? 'bg-surface-container-low text-brand-on-primary font-semibold' : 'text-on-surface hover:bg-surface-container-low'}`}
              >
                Skill Matice
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phase Indicator (shown during dashboard) */}
      {isDashboard && (
        <div className="flex items-center gap-2">
          {(['before', 'during', 'after'] as const).map((phase, i) => {
            const labels = { before: 'Před hovorem', during: 'Během hovoru', after: 'Po hovoru' };
            const isActive = currentScreen === phase;
            const isPast = ['before', 'during', 'after'].indexOf(currentScreen) > i;
            return (
              <div key={phase} className="flex items-center gap-2">
                {i > 0 && <div className={`w-6 h-0.5 rounded-full ${isPast || isActive ? 'bg-brand-primary' : 'bg-surface-container'}`} />}
                <button
                  onClick={() => onNavigate(phase)}
                  className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all ${
                    isActive
                      ? 'bg-brand-primary text-brand-on-primary'
                      : isPast
                        ? 'bg-surface-container-low text-brand-on-primary'
                        : 'bg-surface-container-low text-on-surface-variant'
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
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-brand-secondary-container flex items-center justify-center">
            <span className="font-display font-semibold text-brand-on-secondary text-sm">PS</span>
          </div>
          <span className="font-body font-medium text-on-surface text-sm">Petr Svoboda</span>
        </button>

        {userOpen && (
          <div className="absolute top-full mt-2 right-0 w-44 bg-surface-container-lowest rounded-xl ghost-border shadow-ambient py-2 animate-fade-in">
            <div className="px-4 py-2 font-body text-xs text-on-surface-variant">Tým: KC</div>
            <button
              onClick={() => { onNavigate('login'); setUserOpen(false); }}
              className="w-full text-left px-4 py-2.5 font-body text-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              Odhlásit se
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
