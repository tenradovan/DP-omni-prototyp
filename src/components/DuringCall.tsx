import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  client, products, interactions, tickets, claims, calculations,
  companyClient, companyProducts, companyInteractions, companyTickets, companyClaims,
  brokerClient, brokerProducts, brokerInteractions,
  callQueue, voicebotClassification, unknownCallerPhone,
  hints,
} from '../data/mockData';
import type { Hint, Interaction, Product, BrokerProduct, Claim, Calculation, ClientStatus } from '../data/mockData';
import type { Screen } from '../App';

interface DuringCallProps {
  onNavigate: (screen: Screen) => void;
}

// ─── Product icons ────────────────────────────────────────────────────────────

const productIcons: Record<string, string> = {
  Vozidla: '🚗',
  Majetek: '🏠',
  Mazlíčci: '🐾',
  Cestovní: '✈️',
  Motorky: '🏍️',
  Odpovědnost: '🛡️',
  Flotila: '🚛',
  Budovy: '🏭',
  Zásoby: '📦',
  'Odpovědnost za újmu': '⚖️',
  'Přerušení provozu': '⚡',
  'Elektronika a vybavení': '💻',
  'Cestovní pro zaměstnance': '✈️',
};

// ─── Micro-components ─────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-lime-500 ml-0.5 shrink-0" title="Ověřeno">
      <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function statusAvatarBg(status: ClientStatus): string {
  if (status === 'aktivní') return 'bg-direct-800';
  if (status === 'bývalý')  return 'bg-gray-400';
  return 'bg-amber-500';
}

function ClientTypeIcon({ type }: { type: string }) {
  if (type === 'company') return (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
  if (type === 'broker') return (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (type === 'unknown') return (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  return (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

// ─── HintCard ────────────────────────────────────────────────────────────────

function HintCard({ hint, isNew }: { hint: Hint; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const cat: Record<string, { bg: string; text: string; strip: string }> = {
    compliance: { bg: 'bg-amber-50',  text: 'text-amber-700', strip: 'bg-amber-400' },
    objection:  { bg: 'bg-blue-50',   text: 'text-blue-700',  strip: 'bg-blue-400'  },
    product:    { bg: 'bg-direct-25', text: 'text-direct-700',strip: 'bg-direct-500'},
    info:       { bg: 'bg-purple-50', text: 'text-purple-700',strip: 'bg-purple-400'},
  };
  const c = cat[hint.category];

  return (
    <div
      className={`rounded-xl transition-all cursor-pointer ${c.bg} shadow-card ${isNew ? 'animate-fade-in ring-1 ring-lime-300' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex">
        <div className={`w-1 rounded-l-xl shrink-0 ${c.strip}`} />
        <div className="flex-1 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text} border border-current/10`}>
                  {hint.title}
                </span>
                {isNew && <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse shrink-0" />}
              </div>
              <p className="font-bold text-direct-800 text-[13px] leading-snug">{hint.subtitle}</p>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-gray-300 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {expanded && (
            <div className="mt-3 space-y-2.5 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="bg-white/80 rounded-xl p-3 border border-white/60">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Doporučený script</p>
                <p className="text-sm text-direct-800 italic leading-relaxed">„{hint.script}"</p>
              </div>
              <div className="flex justify-end gap-1.5 pt-0.5">
                <button
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                    feedback === 'up' ? 'bg-direct-800 text-white' : 'bg-white/60 text-gray-400 hover:bg-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill={feedback === 'up' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                  </svg>
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                    feedback === 'down' ? 'bg-err text-white' : 'bg-white/60 text-gray-400 hover:bg-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill={feedback === 'down' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Škody section (KC + KAPU) ────────────────────────────────────────────────

function ClaimsSection({ claimList }: { claimList: Claim[] }) {
  const active   = claimList.filter(c => c.status === 'aktivní');
  const inactive = claimList.filter(c => c.status === 'neaktivní');
  const rejected = claimList.filter(c => c.status === 'zamítnutá');

  return (
    <div className="bg-white rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Škody</p>
        <div className="relative group">
          <button className="w-5 h-5 rounded-full bg-direct-25 text-direct-600 flex items-center justify-center hover:bg-direct-100 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="absolute right-0 top-full mt-1 bg-direct-800 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Nová hlášenka
          </div>
        </div>
      </div>
      <div className="space-y-1">
        {active.map(c => (
          <div key={c.id} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-25 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="text-sm shrink-0 mt-0.5">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-bold text-direct-800">{c.id}</span>
                <span className="px-1 py-0.5 rounded-full bg-lime-50 text-direct-700 text-[9px] font-semibold">Aktivní</span>
              </div>
              <p className="text-xs text-direct-800 leading-tight">{c.type} · {c.risk}</p>
              {c.limitPlnění && (
                <p className="text-[10px] text-gray-400 mt-0.5">Limit: {c.limitPlnění} · Spoluúčast: {c.spoluÚčast}</p>
              )}
            </div>
            <svg className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}

        {inactive.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 py-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[9px] text-gray-300 shrink-0">Uzavřené</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {inactive.map(c => (
              <div key={c.id} className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-gray-25 opacity-60 cursor-pointer">
                <span className="text-xs shrink-0">{c.icon}</span>
                <span className="text-[11px] font-bold text-gray-500">{c.id}</span>
                <span className="text-xs text-gray-500">{c.type}</span>
              </div>
            ))}
          </>
        )}

        {rejected.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 py-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[9px] text-gray-300 shrink-0">Zamítnuté</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {rejected.map(c => (
              <div key={c.id} className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-err-container/20 cursor-pointer">
                <span className="text-xs shrink-0">{c.icon}</span>
                <span className="text-[11px] font-bold text-err">{c.id}</span>
                <span className="text-xs text-direct-800">{c.type}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Nedokončené kalkulace (Poradce, compact) ─────────────────────────────────

function CalculationsSection({ calcs }: { calcs: Calculation[] }) {
  const current    = calcs.find(c => c.isCurrent);
  const historical = calcs.filter(c => !c.isCurrent);

  return (
    <div className="bg-white rounded-xl p-4 shadow-card">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Nedokončené kalkulace</p>
      {current && (
        <div className="rounded-lg px-3 py-2.5 bg-direct-25 border border-direct-100 mb-1.5 cursor-pointer hover:bg-direct-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{productIcons[current.product] ?? '📄'}</span>
              <div>
                <span className="text-sm font-semibold text-direct-800">{current.product}</span>
                {current.detail && <span className="text-[11px] text-gray-400 ml-1.5">{current.detail}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {current.price && <span className="text-sm font-bold text-direct-800">{current.price}</span>}
              <svg className="w-3.5 h-3.5 text-direct-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {historical.map((c, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-gray-25 opacity-60 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs">{productIcons[c.product] ?? '📄'}</span>
            <span className="text-xs text-direct-800">{c.product}</span>
            {c.solver && <span className="text-[10px] text-gray-400">· {c.solver}</span>}
          </div>
          <span className="text-[10px] text-gray-400">{c.date}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DuringCall ───────────────────────────────────────────────────────────────

export function DuringCall({ onNavigate }: DuringCallProps) {
  const { team, clientType } = useDashboard();

  const [callTime, setCallTime] = useState(0);
  const [visibleHintIds, setVisibleHintIds] = useState<string[]>(
    hints.filter(h => h.appearsAt === 0).map(h => h.id)
  );
  const [newHintIds, setNewHintIds] = useState<Set<string>>(
    new Set(hints.filter(h => h.appearsAt === 0).map(h => h.id))
  );
  const [interactionFilter, setInteractionFilter] = useState<'all' | 'hovor' | 'email' | 'web'>('all');
  const [showAllInteractions, setShowAllInteractions] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const toAdd = hints
      .filter(h => h.appearsAt === callTime && !visibleHintIds.includes(h.id))
      .map(h => h.id);
    if (toAdd.length > 0) {
      setVisibleHintIds(prev => [...toAdd, ...prev]);
      setNewHintIds(prev => new Set([...prev, ...toAdd]));
      setTimeout(() => {
        setNewHintIds(prev => {
          const next = new Set(prev);
          toAdd.forEach(id => next.delete(id));
          return next;
        });
      }, 5000);
    }
  }, [callTime]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Select data ────────────────────────────────────────────────────────────
  const activeClient    = clientType === 'company' ? companyClient
                        : clientType === 'broker'  ? brokerClient
                        : clientType === 'unknown' ? null
                        : client;

  const activeProducts  = clientType === 'company' ? companyProducts
                        : clientType === 'broker'  ? [] as Product[]
                        : products;

  const activeInteractions: Interaction[] = clientType === 'company' ? companyInteractions
                        : clientType === 'broker'  ? brokerInteractions
                        : clientType === 'unknown' ? []
                        : interactions;

  const activeTickets   = clientType === 'company' ? companyTickets
                        : clientType === 'unknown' ? []
                        : clientType === 'broker'  ? []
                        : tickets;

  const activeClaims: Claim[]    = clientType === 'company' ? companyClaims
                        : clientType === 'unknown' ? []
                        : clientType === 'broker'  ? []
                        : claims;

  const activeCalcs: Calculation[] = clientType === 'standard' ? calculations : [];

  const showClaims = (team === 'KC' || team === 'KAPU') && clientType !== 'unknown';
  const showCalcs  = team === 'Poradce' && clientType === 'standard';
  const showKAPU   = team === 'KAPU';

  const filtered = activeInteractions.filter(
    (i: Interaction) => interactionFilter === 'all' || i.type === interactionFilter
  );
  const visible = showAllInteractions ? filtered : filtered.slice(0, 5);

  const orderedHints = visibleHintIds
    .map(id => hints.find(h => h.id === id))
    .filter(Boolean) as Hint[];

  // ── Unknown client ─────────────────────────────────────────────────────────
  const unknownBar = clientType === 'unknown';

  return (
    <div className="pt-14 h-screen flex flex-col animate-fade-in overflow-hidden">

      {/* ── Client + Timer bar ──────────────────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 shadow-card shrink-0">
        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full ${
            unknownBar ? 'bg-gray-300' : statusAvatarBg(activeClient!.status)
          } flex items-center justify-center shrink-0`}>
            <ClientTypeIcon type={unknownBar ? 'unknown' : activeClient!.type} />
          </div>

          {/* Name + number */}
          <div className="shrink-0">
            {unknownBar ? (
              <>
                <p className="text-base font-bold text-direct-800 leading-tight">Neznámý volající</p>
                <p className="text-[11px] text-gray-400">{unknownCallerPhone}</p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-direct-800 leading-tight">{activeClient!.name}</p>
                <p className="text-[11px] text-direct-600 font-semibold">
                  {activeClient!.type === 'broker'
                    ? (activeClient as typeof brokerClient).čísloBrokera
                    : activeClient!.čísloKlienta}
                </p>
              </>
            )}
          </div>

          <div className="h-7 w-px bg-gray-100 shrink-0" />

          {/* Contact fields */}
          {!unknownBar && (
            <div className="flex gap-4 flex-1 flex-wrap">
              {activeClient!.type === 'standard' && (() => {
                const c = activeClient as typeof client;
                return (<>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">RČ</p>
                    <p className="text-sm font-medium text-direct-800">{c.rodneČíslo}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Tel</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                      {c.telVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Email</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.email}</p>
                      {c.emailVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Adresa</p>
                    <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
                  </div>
                </>);
              })()}

              {activeClient!.type === 'company' && (() => {
                const c = activeClient as typeof companyClient;
                return (<>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">IČO</p>
                    <p className="text-sm font-medium text-direct-800">{c.ičo}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Kontakt</p>
                    <p className="text-sm font-medium text-direct-800">{c.kontaktníOsoba}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Tel</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                      {c.telVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Email</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.email}</p>
                      {c.emailVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Adresa</p>
                    <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
                  </div>
                </>);
              })()}

              {activeClient!.type === 'broker' && (() => {
                const c = activeClient as typeof brokerClient;
                return (<>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Tel</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                      {c.telVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Email</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.email}</p>
                      {c.emailVerified && <VerifiedBadge />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Adresa</p>
                    <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
                  </div>
                </>);
              })()}
            </div>
          )}

          {unknownBar && <div className="flex-1" />}

          <div className="h-7 w-px bg-gray-100 shrink-0" />

          {/* Queue + MAX voicebot */}
          <div className="flex gap-3 shrink-0">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-gray-400">Fronta</p>
              <p className="text-sm font-medium text-direct-800">{callQueue}</p>
            </div>
            {!unknownBar && (
              <div>
                <p className="text-[9px] uppercase tracking-wider text-gray-400">MAX voicebot</p>
                <p className="text-sm font-medium text-direct-800 truncate max-w-[160px]">{voicebotClassification}</p>
              </div>
            )}
          </div>

          <div className="h-7 w-px bg-gray-100 shrink-0" />

          {/* Timer */}
          <div className="flex items-center gap-2.5 shrink-0 bg-gray-25 rounded-xl px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-[11px] font-semibold text-gray-500">Hovor probíhá</span>
            <span className="text-xl font-extrabold text-direct-800 tabular-nums tracking-tight">{fmt(callTime)}</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────── */}
      <div className="flex-1 flex gap-4 px-6 pb-4 pt-4 overflow-hidden">

        {/* Left — context 50% */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">

            {/* Unknown client fallback */}
            {unknownBar && (
              <div className="bg-white rounded-xl p-8 shadow-card flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-direct-800 mb-1">Neidentifikovaný volající</p>
                <p className="text-sm text-gray-500 mb-1">{unknownCallerPhone}</p>
                <p className="text-xs text-gray-400 mb-6 max-w-xs">Číslo nebylo nalezeno v systému. Zeptejte se na jméno nebo číslo smlouvy pro vyhledání.</p>
                <div className="flex gap-2 w-full max-w-xs">
                  <button className="flex-1 py-2 px-4 rounded-full bg-direct-800 text-white text-sm font-semibold hover:bg-direct-700 transition-colors">
                    Vyhledat klienta
                  </button>
                  <button className="flex-1 py-2 px-4 rounded-full bg-gray-25 text-direct-800 text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Nový klient
                  </button>
                </div>
              </div>
            )}

            {/* Products */}
            {!unknownBar && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Produkty</p>

                {/* Standard / Company products grid */}
                {clientType !== 'broker' && (
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeProducts.map((p, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                          p.platba === 'nezaplaceno'
                            ? 'bg-err-container/40'
                            : p.status === 'neaktivní'
                              ? 'bg-gray-25 opacity-55'
                              : 'bg-gray-25'
                        }`}
                      >
                        <span className="text-sm shrink-0">{productIcons[p.name] ?? '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[12px] font-semibold block leading-tight ${p.status === 'neaktivní' ? 'text-gray-400' : 'text-direct-800'}`}>
                            {p.name}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate block leading-tight">{p.description}</span>
                          {showKAPU && p.limitPlnění && (
                            <span className="text-[9px] text-gray-400 block leading-tight">
                              {p.limitPlnění} / {p.spoluÚčast}
                            </span>
                          )}
                        </div>
                        <div className="shrink-0 ml-auto">
                          {p.platba === 'zaplaceno'   && <span className="px-1.5 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[9px] font-semibold">OK</span>}
                          {p.platba === 'nezaplaceno' && <span className="px-1.5 py-0.5 rounded-full bg-err-container text-err text-[9px] font-semibold">DLUH</span>}
                          {p.platba === 'vypršelo'    && <span className="text-[10px] text-gray-300">—</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Broker products list */}
                {clientType === 'broker' && (
                  <div className="space-y-1">
                    {brokerProducts.map((p, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                          p.platba === 'nezaplaceno' ? 'bg-err-container/40' : 'bg-gray-25'
                        } ${p.status === 'neaktivní' ? 'opacity-55' : ''}`}
                      >
                        <span className="text-sm shrink-0">{productIcons[p.name] ?? '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-semibold text-direct-800 block leading-tight truncate">{p.name}</span>
                          <span className="text-[10px] text-direct-600 font-medium">{p.clientName}</span>
                        </div>
                        <div className="shrink-0">
                          {p.platba === 'zaplaceno'   && <span className="px-1.5 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[9px] font-semibold">OK</span>}
                          {p.platba === 'nezaplaceno' && <span className="px-1.5 py-0.5 rounded-full bg-err-container text-err text-[9px] font-semibold">DLUH</span>}
                          {p.platba === 'vypršelo'    && <span className="text-[10px] text-gray-300">—</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Nedokončené kalkulace (Poradce) */}
            {showCalcs && <CalculationsSection calcs={activeCalcs} />}

            {/* Škody (KC + KAPU) */}
            {showClaims && <ClaimsSection claimList={activeClaims} />}

            {/* Tickets */}
            {activeTickets.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Tickety</p>
                  <span className="px-1.5 py-0.5 rounded-full bg-warn-container text-warn text-[10px] font-bold">{activeTickets.length}</span>
                </div>
                <div className="space-y-1.5">
                  {activeTickets.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-warn-container/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-warn shrink-0">{t.id}</span>
                        <span className="text-sm text-direct-800">{t.description}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-warn shrink-0">{t.age}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions */}
            {!unknownBar && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Interakce</p>
                  <div className="flex gap-1">
                    {([['all', 'Vše'], ['hovor', 'Hovory'], ['email', 'Emaily'], ['web', 'Web']] as const).map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => setInteractionFilter(k)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                          interactionFilter === k ? 'bg-direct-800 text-white' : 'bg-gray-25 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  {visible.map((int, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2 bg-gray-25 hover:bg-gray-50 transition-colors">
                      <span className="text-sm shrink-0">{int.icon}</span>
                      <span className="flex-1 text-sm text-direct-800 truncate">{int.description}</span>
                      <div className="text-right shrink-0">
                        {int.relativeDate && <p className="text-[10px] font-semibold text-direct-600">{int.relativeDate}</p>}
                        <p className="text-[10px] text-gray-400">{int.date}</p>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-gray-400 py-3 text-center">Žádné interakce</p>
                  )}
                </div>
                {filtered.length > 5 && (
                  <button
                    onClick={() => setShowAllInteractions(!showAllInteractions)}
                    className="w-full mt-2 py-1 text-[11px] text-direct-600 font-medium hover:underline"
                  >
                    {showAllInteractions ? 'Méně' : `Zobrazit vše (${filtered.length})`}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — Whisperer 50% */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl flex flex-col flex-1 overflow-hidden shadow-card">
            <div className="px-4 pt-4 pb-3 border-b border-gray-50 shrink-0 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-lime-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-direct-800">Whisperer</p>
              <span className="ml-auto flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-direct-500 animate-pulse" />
                Živě
              </span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
              {orderedHints.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">Whisperer čeká na průběh hovoru…</p>
                </div>
              )}
              {orderedHints.slice(0, 2).map(hint => (
                <HintCard key={hint.id} hint={hint} isNew={newHintIds.has(hint.id)} />
              ))}
              {orderedHints.length > 2 && (
                <>
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-gray-100" />
                    <p className="text-[10px] text-gray-300 font-medium shrink-0">Starší</p>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="space-y-2 opacity-50">
                    {orderedHints.slice(2).map(hint => (
                      <HintCard key={hint.id} hint={hint} isNew={false} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
