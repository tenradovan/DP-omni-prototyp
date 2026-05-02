/**
 * DashboardContext
 *
 * Central store for all session-level settings that control which UI
 * features are shown and how data is presented. Any component can call
 * `useDashboard()` to read or update these values — no prop drilling needed.
 *
 * Values:
 *   role        — 'operator' | 'admin'         (which nav/screens are visible)
 *   team        — 'Poradce' | 'KC' | 'KAPU'   (operator-team-specific UI variants)
 *   clientType  — 'standard' | 'company' | 'broker'  (client-type-specific info/layout)
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role       = 'operator' | 'admin';
export type Team       = 'Poradce' | 'KC' | 'KAPU';
export type ClientType = 'standard' | 'company' | 'broker';

export const TEAM_LABELS: Record<Team, string> = {
  Poradce: 'Poradce',
  KC:      'KC',
  KAPU:    'KAPU',
};

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  standard: 'Standardní klient',
  company:  'Firma',
  broker:   'Makléř',
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface DashboardContextValue {
  role:            Role;
  team:            Team;
  clientType:      ClientType;
  setRole:         (r: Role) => void;
  setTeam:         (t: Team) => void;
  setClientType:   (ct: ClientType) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role,       setRole]       = useState<Role>('operator');
  const [team,       setTeam]       = useState<Team>('KC');
  const [clientType, setClientType] = useState<ClientType>('standard');

  return (
    <DashboardContext.Provider value={{ role, team, clientType, setRole, setTeam, setClientType }}>
      {children}
    </DashboardContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside <DashboardProvider>');
  return ctx;
}
