import { useState } from 'react';
import { useDashboard, TEAM_LABELS, CLIENT_TYPE_LABELS } from '../context/DashboardContext';
import type { Role, Team, ClientType } from '../context/DashboardContext';
import type { Screen } from '../App';

interface NavigationProps {
  currentScreen:               Screen;
  onNavigate:                  (screen: Screen) => void;
  onRoleChange:                (role: Role) => void;
  showClientSelection:         boolean;
  isClientSelectionActive:     boolean;
  onReturnToClientSelection:   () => void;
}

// Reusable segmented-control row used for role / team / clientType switching
function SegmentRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label:    string;
  options:  { value: T; label: string }[];
  value:    T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="px-4 py-2.5 border-b border-gray-50">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1.5">{label}</p>
      <div className="flex gap-1 flex-wrap">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-w-fit py-1.5 px-2 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
              value === opt.value
                ? 'bg-direct-800 text-white'
                : 'bg-gray-25 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Navigation({
  currentScreen,
  onNavigate,
  onRoleChange,
  showClientSelection,
  isClientSelectionActive,
  onReturnToClientSelection,
}: NavigationProps) {
  const { role, team, setTeam, clientType, setClientType } = useDashboard();
  const [userOpen, setUserOpen] = useState(false);

  const operatorScreens: { screen: Screen; label: string }[] = [
    { screen: 'before', label: 'Před hovorem' },
    { screen: 'during', label: 'Během hovoru' },
    { screen: 'after',  label: 'Po hovoru'    },
  ];

  const adminScreens: { screen: Screen; label: string }[] = [
    { screen: 'queue-mapping', label: 'Mapování front' },
    { screen: 'skill-matrix',  label: 'Skill Matice'   },
  ];

  const navItems = role === 'operator' ? operatorScreens : adminScreens;
  const phaseIndex = operatorScreens.findIndex(s => s.screen === currentScreen);

  // Subtitle shown under operator name
  const subtitle = role === 'admin'
    ? 'Admin'
    : `${team} · ${CLIENT_TYPE_LABELS[clientType]}`;

  const roleOptions:       { value: Role;       label: string }[] = [
    { value: 'operator', label: 'Operátor' },
    { value: 'admin',    label: 'Admin'    },
  ];
  const teamOptions:       { value: Team;       label: string }[] = (
    Object.entries(TEAM_LABELS) as [Team, string][]
  ).map(([v, l]) => ({ value: v, label: l }));
  const clientTypeOptions: { value: ClientType; label: string }[] = (
    Object.entries(CLIENT_TYPE_LABELS) as [ClientType, string][]
  ).map(([v, l]) => ({ value: v, label: l }));

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-card h-14 px-6 flex items-center justify-between">

      {/* Logo */}
      <div
        className="flex items-center gap-2.5 cursor-pointer shrink-0"
        onClick={() => onNavigate(role === 'operator' ? 'before' : 'queue-mapping')}
      >
        <div className="w-7 h-7 rounded-lg bg-lime-500 flex items-center justify-center">
          <span className="font-sans font-bold text-direct-800 text-sm">D</span>
        </div>
        <span className="font-sans font-bold text-direct-800 text-[15px]">Direct pojišťovna</span>
      </div>

      {/* Center nav — desktop only */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
        {showClientSelection && (
          <div className="absolute right-full mr-1 flex items-center gap-1">
            <button
              onClick={onReturnToClientSelection}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                isClientSelectionActive
                  ? 'bg-direct-800 text-white'
                  : 'bg-lime-50 text-direct-700 hover:bg-lime-100'
              }`}
            >
              Volba klienta
            </button>
            <div className={`w-5 h-px ${isClientSelectionActive ? 'bg-gray-100' : 'bg-lime-500'}`} />
          </div>
        )}
        {navItems.map((item, i) => {
          const isActive = currentScreen === item.screen && !isClientSelectionActive;
          const isPast   = role === 'operator' && phaseIndex > i;
          return (
            <div key={item.screen} className="flex items-center gap-1">
              {role === 'operator' && i > 0 && (
                <div className={`w-5 h-px ${isPast || isActive ? 'bg-lime-500' : 'bg-gray-100'}`} />
              )}
              {role === 'admin' && i > 0 && <div className="w-2" />}
              <button
                onClick={() => onNavigate(item.screen)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-direct-800 text-white'
                    : isPast
                      ? 'bg-lime-50 text-direct-700 hover:bg-lime-100'
                      : 'text-direct-800 hover:bg-gray-25'
                }`}
              >
                {item.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* User menu */}
      <div className="relative shrink-0">
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="text-right">
            <p className="text-sm text-direct-800 font-medium leading-tight">Petr Svoboda</p>
            <p className="text-[10px] text-gray-400 leading-tight">{subtitle}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-direct-800 flex items-center justify-center">
            <span className="font-sans font-semibold text-white text-xs">PS</span>
          </div>
        </button>

        {userOpen && (
          <div
            className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-float py-1 animate-fade-in"
            // Close when clicking outside
            onMouseLeave={() => {/* keep open on hover-off so user can click */}}
          >
            {/* Team — operator only */}
            {role === 'operator' && (
              <SegmentRow<Team>
                label="Tým"
                options={teamOptions}
                value={team}
                onChange={setTeam}
              />
            )}

            {/* Client type */}
            <SegmentRow<ClientType>
              label="Typ klienta"
              options={clientTypeOptions}
              value={clientType}
              onChange={setClientType}
            />

            {/* Sign out */}
            <button
              onClick={() => { onNavigate('login'); setUserOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-direct-800 hover:bg-gray-25 transition-colors"
            >
              Odhlásit se
            </button>
          </div>
        )}
      </div>

    </nav>

    {/* Mobile bottom nav — operator only */}
    {role === 'operator' && (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 px-2 pb-2 pt-1.5">
        <div className="flex justify-around">
          {operatorScreens.map((item, i) => {
            const isActive = currentScreen === item.screen;
            const isPast   = phaseIndex > i;
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
                  isActive ? 'text-direct-800' : isPast ? 'text-lime-600' : 'text-gray-300'
                }`}
              >
                <div className={`w-10 h-1 rounded-full transition-colors ${
                  isActive ? 'bg-direct-800' : isPast ? 'bg-lime-400' : 'bg-gray-100'
                }`} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    )}
    </>
  );
}
