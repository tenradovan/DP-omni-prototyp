import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  client, products, interactions, tickets, claims, calculations,
  companyClient, companyProducts, companyInteractions, companyTickets, companyClaims,
  brokerClient, brokerProducts, brokerInteractions,
  standardNoEmailClient, standardAutoClient, autoCalculations,
  callQueue, voicebotClassification, unknownCallerPhone,
  hints,
} from '../data/mockData';
import type { Hint, Interaction, Product, BrokerProduct, Claim, Calculation, ClientStatus, RiskDetail } from '../data/mockData';
import type { Screen } from '../App';
import { CalculationsSection } from './shared/CalculationsSection';
import { ChangeClientButton } from './shared/ChangeClientButton';
import { ClientStatusBadge } from './shared/ClientStatusBadge';
import { NewCoreButton } from './shared/NewCoreButton';
import { InfoTooltip } from './ui/InfoTooltip';
import { glossary } from '../data/glossary';

interface DuringCallProps {
  onNavigate:                  (screen: Screen) => void;
  showClientSelection:         boolean;
  onReturnToClientSelection:   () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const productIcons: Record<string, string> = {
  AUTO:    '🚗', Vozidla: '🚗',
  MAJ:     '🏠', Majetek: '🏠',
  MAZL:    '🐾', Mazlíčci: '🐾',
  TRAVEL:  '✈️', Cestovní: '✈️',
  FLEET:   '🚛', Flotila: '🚛',
  BUD:     '🏭', Budovy: '🏭',
  ZÁS:     '📦', Zásoby: '📦',
  ODP:     '⚖️', 'Odpovědnost za újmu': '⚖️',
  BI:      '⚡', 'Přerušení provozu': '⚡',
  EL:      '💻', 'Elektronika a vybavení': '💻',
  'Cestovní pro zaměstnance': '✈️',
};

function statusAvatarBg(status: ClientStatus): string {
  if (status === 'aktivní') return 'bg-direct-800';
  if (status === 'bývalý')  return 'bg-gray-400';
  return 'bg-amber-500';
}

function claimStatusCls(s: string): string {
  if (s === 'Otevřená')           return 'bg-lime-50 text-direct-700';
  if (s === 'Čeká na dokumenty')  return 'bg-amber-50 text-amber-700';
  if (s === 'Doložená')           return 'bg-blue-50 text-blue-700';
  if (s === 'Uzavřená')           return 'bg-gray-100 text-gray-500';
  if (s === 'Zamítnutá')          return 'bg-err-container text-err';
  return 'bg-gray-100 text-gray-500';
}

// ─── Micro-components ─────────────────────────────────────────────────────────

function VerifiedBadge({ type = 'generic' }: { type?: 'tel' | 'email' | 'generic' }) {
  const msg = type === 'tel' ? glossary.verifiedTel : type === 'email' ? glossary.verifiedEmail : glossary.verified;
  return (
    <InfoTooltip content={msg}>
      <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-lime-500 ml-0.5 shrink-0 cursor-help">
        <svg className="w-1.5 h-1.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </InfoTooltip>
  );
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

// ─── HintCard ─────────────────────────────────────────────────────────────────

function HintCard({
  hint,
  isNew,
  isPinned,
  isExpanded,
  onExpandToggle,
  onPin,
}: {
  hint: Hint;
  isNew: boolean;
  isPinned: boolean;
  isExpanded: boolean;
  onExpandToggle: (id: string) => void;
  onPin: (id: string) => void;
}) {
  const expanded = isExpanded;
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
      className={`rounded-xl transition-all cursor-pointer ${c.bg} shadow-card ${isNew ? 'animate-fade-in ring-1 ring-lime-300' : ''} ${isPinned ? 'ring-1 ring-lime-400' : ''}`}
      onClick={() => onExpandToggle(hint.id)}
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
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              {/* Pin button */}
              <button
                onClick={e => { e.stopPropagation(); onPin(hint.id); }}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                  isPinned ? 'bg-lime-500 text-direct-800' : 'bg-white/50 text-gray-300 hover:bg-white/80 hover:text-gray-500'
                }`}
                title={isPinned ? 'Odepnout' : 'Připnout'}
              >
                <svg className="w-3 h-3" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <svg
                className={`w-3.5 h-3.5 text-gray-300 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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

// ─── Expandable product card (compact for DuringCall) ─────────────────────────

function ProductCard({ p, showKAPU }: { p: Product; showKAPU: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const risks = p.risks ?? [];
  const shown = risks.slice(0, 4);
  const extra = risks.length - 4;

  return (
    <div
      className={`cursor-pointer rounded-xl border transition-all ${
        p.platba === 'nezaplaceno'
          ? 'bg-err-container/30 border-red-200/50 hover:bg-err-container/50'
          : p.status === 'neaktivní'
          ? 'bg-gray-25 border-gray-100 opacity-55'
          : 'bg-gray-25 border-gray-100 hover:bg-gray-50'
      }`}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start gap-2.5 px-3.5 py-2.5">
        <span className="text-base shrink-0 mt-0.5">{productIcons[p.type] ?? productIcons[p.name] ?? '📄'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold leading-tight ${p.status === 'neaktivní' ? 'text-gray-400' : 'text-direct-800'}`}>
                {glossary[p.type] ? (
                  <InfoTooltip content={glossary[p.type]}>
                    <span className="cursor-help border-b border-dotted border-current/40">{p.type}</span>
                  </InfoTooltip>
                ) : p.type}
                {p.contractNumber && <span className="font-normal text-gray-500 text-xs ml-1.5">{p.contractNumber}</span>}
              </p>
              <p className="text-xs text-gray-500 leading-tight mt-0.5 truncate">{p.description}</p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5">
              {p.platba === 'zaplaceno'   && (
                <InfoTooltip content={glossary.OK}>
                  <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-xs font-semibold cursor-help">OK</span>
                </InfoTooltip>
              )}
              {p.platba === 'nezaplaceno' && (
                <InfoTooltip content={glossary.DLUH}>
                  <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-xs font-semibold cursor-help">DLUH</span>
                </InfoTooltip>
              )}
              {p.platba === 'vypršelo'    && (
                <InfoTooltip content={glossary.Vypršelo}>
                  <span className="text-xs text-gray-300 font-medium cursor-help">Vypršelo</span>
                </InfoTooltip>
              )}
              <svg className={`w-3.5 h-3.5 text-gray-300 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {risks.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {shown.map(r => (
                <span key={r} className="px-1.5 py-0.5 rounded-full bg-white/70 text-gray-500 text-[10px] font-medium border border-gray-200/60">{r}</span>
              ))}
              {extra > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-medium">+{extra} další</span>
              )}
            </div>
          )}
          {showKAPU && p.limitPlnění && (
            <p className="text-[11px] text-gray-500 mt-1">
              <InfoTooltip content={glossary.limitPlnění}>
                <span className="cursor-help border-b border-dotted border-current/40">Limit</span>
              </InfoTooltip>
              : {p.limitPlnění} ·{' '}
              <InfoTooltip content={glossary.spoluÚčast}>
                <span className="cursor-help border-b border-dotted border-current/40">Spoluúčast</span>
              </InfoTooltip>
              : {p.spoluÚčast}
            </p>
          )}
        </div>
      </div>

      {/* Expanded risk details */}
      {expanded && p.riskDetails && p.riskDetails.length > 0 && (
        <div className="px-3.5 pb-3 animate-fade-in" onClick={e => e.stopPropagation()}>
          <div className="border-t border-gray-200/50 pt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider">
                  <th className="text-left pb-1.5 font-medium text-[10px]">Riziko</th>
                  <th className="text-right pb-1.5 font-medium text-[10px]">
                    <InfoTooltip content={glossary.limitPlnění}>
                      <span className="cursor-help border-b border-dotted border-current/40">Limit plnění</span>
                    </InfoTooltip>
                  </th>
                  <th className="text-right pb-1.5 font-medium text-[10px]">
                    <InfoTooltip content={glossary.spoluÚčast}>
                      <span className="cursor-help border-b border-dotted border-current/40">Spoluúčast</span>
                    </InfoTooltip>
                  </th>
                  <th className="text-right pb-1.5 font-medium text-[10px] hidden lg:table-cell">
                    <InfoTooltip content={glossary.datumSjednání}>
                      <span className="cursor-help border-b border-dotted border-current/40">Sjednáno</span>
                    </InfoTooltip>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {p.riskDetails.map((rd: RiskDetail, i: number) => (
                  <tr key={i} className="text-direct-800">
                    <td className="py-1 pr-2 font-medium">{rd.name}</td>
                    <td className="py-1 pr-2 text-right text-gray-600">{rd.limitPlnění ?? '—'}</td>
                    <td className="py-1 text-right text-gray-600">{rd.spoluÚčast ?? '—'}</td>
                    <td className="py-1 text-right text-gray-400 hidden lg:table-cell">{rd.datumSjednání ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Škody section ────────────────────────────────────────────────────────────

function ClaimsSection({ claimList, isKAPU = false }: { claimList: Claim[]; isKAPU?: boolean }) {
  const active   = claimList.filter(c => c.status === 'aktivní');
  const inactive = claimList.filter(c => c.status === 'neaktivní');
  const rejected = claimList.filter(c => c.status === 'zamítnutá');
  const [expandedId, setExpandedId] = useState<string | null>(
    isKAPU && active.length > 0 ? active[0].id : null
  );

  return (
    <div className="bg-white rounded-xl p-4 shadow-card">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Škody</p>
          {active.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{active.length}</span>
          )}
        </div>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-direct-25 text-direct-600 text-xs font-medium hover:bg-direct-100 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nová hlášenka
        </button>
      </div>

      <div className="space-y-2">
        {active.map(c => {
          const isExpanded = expandedId === c.id;
          return (
            <div
              key={c.id}
              className={`rounded-xl border transition-all cursor-pointer ${
                isExpanded
                  ? 'border-direct-200 bg-direct-25/40'
                  : 'border-gray-100 bg-gray-25 hover:bg-gray-50'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : c.id)}
            >
              <div className="px-3.5 pt-2.5 pb-2">
                {/* Row 1: type (main title) + status badge + age */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">{c.icon}</span>
                    <span className="text-sm font-bold text-direct-800 leading-tight">{c.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${claimStatusCls(c.statusBadge)}`}>{c.statusBadge}</span>
                    {c.relativeDays !== undefined && (
                      <InfoTooltip content={glossary.relativeDays}>
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold cursor-help">{c.relativeDays}d</span>
                      </InfoTooltip>
                    )}
                    <svg className={`w-3.5 h-3.5 text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                {/* Row 2: ID · role · risk */}
                <div className="flex items-center gap-1.5 pl-7 flex-wrap">
                  <span className="text-xs font-semibold text-direct-600">{c.id}</span>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-xs text-gray-500">{c.roleKlienta}</span>
                  <span className="text-gray-300 text-xs">·</span>
                  <span className="text-xs text-gray-500">{c.risk}</span>
                </div>
                {/* Row 3: popis události */}
                {c.nehodovýDěj && (
                  <p className="text-xs text-gray-500 italic mt-1 pl-7 leading-relaxed line-clamp-2">{c.nehodovýDěj}</p>
                )}
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-direct-100 px-3.5 pt-2.5 pb-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                  <div className="grid grid-cols-3 gap-3 mb-2">
                    <div>
                      <InfoTooltip content={glossary.datumVzniku} side="bottom">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Datum vzniku</p>
                      </InfoTooltip>
                      <p className="text-xs font-semibold text-direct-800">{c.datumVzniku}</p>
                    </div>
                    <div>
                      <InfoTooltip content={glossary.datumHlášení} side="bottom">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Datum hlášení</p>
                      </InfoTooltip>
                      <p className="text-xs font-semibold text-direct-800">{c.datumHlášení}</p>
                    </div>
                    {c.datumUzavření && (
                      <div>
                        <InfoTooltip content={glossary.datumUzavření} side="bottom">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Uzavřeno</p>
                        </InfoTooltip>
                        <p className="text-xs font-semibold text-direct-800">{c.datumUzavření}</p>
                      </div>
                    )}
                  </div>
                  {c.limitPlnění && (
                    <div className="flex items-center gap-4 pt-2 border-t border-direct-100/60">
                      <div>
                        <InfoTooltip content={glossary.limitPlnění} side="bottom">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Limit plnění</p>
                        </InfoTooltip>
                        <p className="text-xs font-semibold text-direct-800">{c.limitPlnění}</p>
                      </div>
                      <div>
                        <InfoTooltip content={glossary.spoluÚčast} side="bottom">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Spoluúčast</p>
                        </InfoTooltip>
                        <p className="text-xs font-semibold text-direct-800">{c.spoluÚčast}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {inactive.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider shrink-0">Uzavřené</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {inactive.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2 bg-gray-25 opacity-65 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">{c.icon}</span>
                  <span className="text-xs font-bold text-gray-600">{c.id}</span>
                  <span className="text-xs text-gray-500">{c.type}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${claimStatusCls(c.statusBadge)}`}>{c.statusBadge}</span>
                </div>
                {c.datumVzniku && <span className="text-xs text-gray-400 shrink-0">{c.datumVzniku}</span>}
              </div>
            ))}
          </>
        )}

        {rejected.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-px bg-red-100" />
              <p className="text-[10px] text-red-400 font-medium uppercase tracking-wider shrink-0">Zamítnuté</p>
              <div className="flex-1 h-px bg-red-100" />
            </div>
            {rejected.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2 bg-err-container/20 hover:bg-err-container/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">{c.icon}</span>
                  <span className="text-xs font-bold text-err">{c.id}</span>
                  <span className="text-xs text-direct-800 font-medium">{c.type}</span>
                </div>
                {c.datumVzniku && <span className="text-xs text-gray-400 shrink-0">{c.datumVzniku}</span>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Interaction icon ─────────────────────────────────────────────────────────

function InteractionIcon({ type }: { type: 'hovor' | 'email' | 'web' }) {
  if (type === 'email') return (
    <svg className="w-3.5 h-3.5 text-direct-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (type === 'hovor') return <span className="text-sm">📞</span>;
  return <span className="text-sm">🌐</span>;
}

// ─── DuringCall ───────────────────────────────────────────────────────────────

export function DuringCall({
  onNavigate,
  showClientSelection,
  onReturnToClientSelection,
}: DuringCallProps) {
  const { team, clientType, mockClientId } = useDashboard();

  const [callTime, setCallTime] = useState(0);
  const [visibleHintIds, setVisibleHintIds] = useState<string[]>(
    hints.filter(h => h.appearsAt === 0).map(h => h.id)
  );
  const [newHintIds, setNewHintIds] = useState<Set<string>>(
    new Set(hints.filter(h => h.appearsAt === 0).map(h => h.id))
  );
  const [pinnedHintIds, setPinnedHintIds] = useState<Set<string>>(new Set());
  const [expandedHintIds, setExpandedHintIds] = useState<Set<string>>(new Set());
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
      // Auto-pin: for every expanded hint that will be pushed out of top-2 non-pinned slots
      if (expandedHintIds.size > 0) {
        const currentNonPinned = visibleHintIds.filter(id => !pinnedHintIds.has(id));
        const displacedFromIndex = Math.max(0, 2 - toAdd.length);
        const aboutToBeDisplaced = currentNonPinned.slice(displacedFromIndex, 2);
        const toPin = aboutToBeDisplaced.filter(id => expandedHintIds.has(id));
        if (toPin.length > 0) {
          setPinnedHintIds(prev => new Set([...prev, ...toPin]));
        }
      }
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

  const togglePin = (id: string) => {
    setPinnedHintIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedHintIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Manually add the next unshown hint (for demo purposes)
  const addNextHint = () => {
    const nextHint = hints.find(h => !visibleHintIds.includes(h.id));
    if (!nextHint) return;
    // Auto-pin any expanded hint that will be displaced from top-2 non-pinned
    if (expandedHintIds.size > 0) {
      const currentNonPinned = visibleHintIds.filter(id => !pinnedHintIds.has(id));
      const aboutToBeDisplaced = currentNonPinned.slice(1, 2);
      const toPin = aboutToBeDisplaced.filter(id => expandedHintIds.has(id));
      if (toPin.length > 0) {
        setPinnedHintIds(prev => new Set([...prev, ...toPin]));
      }
    }
    setVisibleHintIds(prev => [nextHint.id, ...prev]);
    setNewHintIds(prev => new Set([...prev, nextHint.id]));
    setTimeout(() => {
      setNewHintIds(prev => { const n = new Set(prev); n.delete(nextHint.id); return n; });
    }, 5000);
  };

  // ── Select data ────────────────────────────────────────────────────────────
  const isUnknown = clientType === 'unknown' || clientType === 'ambiguous';

  const activeClient    = mockClientId === 'standardNoEmail' ? standardNoEmailClient
                        : mockClientId === 'standardAuto'    ? standardAutoClient
                        : clientType === 'company' ? companyClient
                        : clientType === 'broker'  ? brokerClient
                        : isUnknown ? null
                        : client;

  const activeProducts  = clientType === 'company' ? companyProducts
                        : clientType === 'broker'  ? [] as Product[]
                        : products;

  const activeInteractions: Interaction[] = clientType === 'company' ? companyInteractions
                        : clientType === 'broker'  ? brokerInteractions
                        : isUnknown ? []
                        : interactions;

  const activeTickets   = clientType === 'company' ? companyTickets
                        : isUnknown ? []
                        : clientType === 'broker'  ? []
                        : tickets;

  const activeClaims: Claim[] = clientType === 'company' ? companyClaims
                        : isUnknown ? []
                        : clientType === 'broker' ? []
                        : claims;

  const activeCalcs: Calculation[] = mockClientId === 'standardAuto' ? autoCalculations
                        : (clientType === 'standard') ? calculations : [];

  const showClaims = (team === 'KC' || team === 'KAPU') && !isUnknown && clientType !== 'broker';
  const showCalcs  = team === 'Poradce' && activeCalcs.length > 0;
  const showKAPU   = team === 'KAPU';

  const filtered = activeInteractions.filter(
    (i: Interaction) => interactionFilter === 'all' || i.type === interactionFilter
  );
  const visible = showAllInteractions ? filtered : filtered.slice(0, 5);

  const orderedHints = visibleHintIds
    .map(id => hints.find(h => h.id === id))
    .filter(Boolean) as Hint[];

  // Whisperer grouping: recent (top 2 non-pinned), pinned, older
  const nonPinned = orderedHints.filter(h => !pinnedHintIds.has(h.id));
  const recentHints = nonPinned.slice(0, 2);
  const olderHints  = nonPinned.slice(2);
  const pinnedHints = orderedHints.filter(h => pinnedHintIds.has(h.id));

  return (
    <div className="pt-14 pb-16 lg:pb-0 min-h-screen lg:h-screen flex flex-col animate-fade-in lg:overflow-hidden">

      {/* ── Client + Timer bar ──────────────────────────────────────── */}
      <div className="px-4 lg:px-6 py-2 lg:py-3 bg-white border-b border-gray-100 shadow-card shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">

          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full ${
            isUnknown ? 'bg-gray-300' : statusAvatarBg(activeClient!.status)
          } flex items-center justify-center shrink-0`}>
            <ClientTypeIcon type={isUnknown ? 'unknown' : activeClient!.type} />
          </div>

          {/* Name + number */}
          <div className="shrink-0">
            {isUnknown ? (
              <>
                <p className="text-base font-bold text-direct-800 leading-tight">Neznámý volající</p>
                <p className="text-[11px] text-gray-400">{unknownCallerPhone}</p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-direct-800 leading-tight">{activeClient!.name}</p>
                <div className="flex items-center gap-0.5">
                  <ClientStatusBadge status={activeClient!.status} compact />
                  {/* App/zone indicators */}
                  {activeClient!.type !== 'broker' && (() => {
                    const c = activeClient as (typeof client | typeof companyClient);
                    return (
                      <div className="flex items-center gap-0.5">
                        <InfoTooltip content={c.aktivníApp ? glossary.aktivníApp : 'Mobilní aplikace Moje Direct — klient ji nemá aktivní'}>
                          <span className={`w-5 h-5 rounded flex items-center justify-center cursor-help ${c.aktivníApp ? 'bg-lime-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </span>
                        </InfoTooltip>
                        <InfoTooltip content={c.klientskáZóna ? glossary.klientskáZóna : 'Klientská zóna direct.cz — klient nemá aktivní přihlášení'}>
                          <span className={`w-5 h-5 rounded flex items-center justify-center cursor-help ${c.klientskáZóna ? 'bg-lime-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </span>
                        </InfoTooltip>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-start gap-1">
            {showClientSelection && <ChangeClientButton compact onClick={onReturnToClientSelection} />}
            {!isUnknown && <NewCoreButton compact />}
          </div>

          <div className="hidden lg:block h-7 w-px bg-gray-100 shrink-0" />

          {/* Contact fields — desktop only */}
          {!isUnknown && (
            <div className="hidden lg:flex gap-4 flex-1 flex-wrap">
              {activeClient!.type === 'standard' && (() => {
                const c = activeClient as typeof client;
                return (<>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Narozen/a</p>
                    <p className="text-sm font-medium text-direct-800">{c.datumNarození}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">RČ</p>
                    <p className="text-sm font-medium text-direct-800">{c.rodneČíslo}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Tel</p>
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                      {c.telVerified && <VerifiedBadge type="tel" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Email</p>
                    {c.email ? (
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.email}</p>
                        {c.emailVerified && <VerifiedBadge type="email" />}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">— (neuveden)</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Trvalé bydliště</p>
                    <p className="text-sm font-medium text-direct-800">{c.trvaléBydliště}</p>
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
                      {c.telVerified && <VerifiedBadge type="tel" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Email</p>
                    {c.email ? (
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.email}</p>
                        {c.emailVerified && <VerifiedBadge type="email" />}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">— (neuveden)</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Trvalé bydliště</p>
                    <p className="text-sm font-medium text-direct-800">{c.trvaléBydliště}</p>
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
                      {c.telVerified && <VerifiedBadge type="tel" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Email</p>
                    {c.email ? (
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.email}</p>
                        {c.emailVerified && <VerifiedBadge type="email" />}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">— (neuveden)</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Trvalé bydliště</p>
                    <p className="text-sm font-medium text-direct-800">{c.trvaléBydliště}</p>
                  </div>
                </>);
              })()}
            </div>
          )}

          {!isUnknown && <div className="flex-1 lg:hidden" />}
          {isUnknown && <div className="flex-1" />}

          <div className="hidden lg:block h-7 w-px bg-gray-100 shrink-0" />

          {/* Queue + Důvod hovoru — desktop only, compact vertical stack */}
          <div className="hidden lg:flex flex-col gap-1 shrink-0 max-w-[140px]">
            <div className="flex items-center gap-1 min-w-0">
              <p className="text-[9px] text-gray-400 shrink-0 font-medium">Fronta</p>
              <InfoTooltip content={glossary.fronta} side="bottom">
                <span className="px-1.5 py-0.5 rounded-full bg-direct-700 text-white text-[9px] font-semibold truncate cursor-help">{callQueue}</span>
              </InfoTooltip>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <p className="text-[9px] text-gray-400 shrink-0 font-medium">Důvod</p>
              <InfoTooltip content={glossary.duvodHovoru} side="bottom">
                <span className="px-1.5 py-0.5 rounded-full bg-direct-100 text-direct-700 text-[9px] font-medium truncate min-w-0 cursor-help">
                  {voicebotClassification}
                </span>
              </InfoTooltip>
            </div>
          </div>

          <div className="h-7 w-px bg-gray-100 shrink-0" />

          {/* Timer */}
          <div className="flex items-center gap-1.5 lg:gap-2.5 shrink-0 bg-gray-25 rounded-xl px-2.5 lg:px-4 py-1.5 lg:py-2">
            <span className="relative flex h-2 w-2 lg:h-2.5 lg:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 lg:h-2.5 lg:w-2.5 bg-red-500" />
            </span>
            <span className="hidden lg:inline text-[11px] font-semibold text-gray-500">Hovor probíhá</span>
            <span className="text-base lg:text-xl font-extrabold text-direct-800 tabular-nums tracking-tight">{fmt(callTime)}</span>
          </div>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 lg:px-6 pb-4 pt-4 lg:overflow-hidden">

        {/* Left — context */}
        <div className="w-full lg:w-1/2 flex flex-col lg:overflow-hidden">
          <div className="flex-1 lg:overflow-y-auto no-scrollbar space-y-3">

            {/* Unknown client fallback */}
            {isUnknown && (
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

            {/* Nedokončené kalkulace (Poradce) */}
            {showCalcs && <CalculationsSection calcs={activeCalcs} />}

            {/* KAPU: Škody first */}
            {showClaims && showKAPU && <ClaimsSection claimList={activeClaims} isKAPU={true} />}

            {/* Smlouvy */}
            {!isUnknown && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Smlouvy</p>

                {/* Standard / Company products – 1 per row */}
                {clientType !== 'broker' && (
                  <div className="space-y-2">
                    {activeProducts.map((p, i) => (
                      <ProductCard key={i} p={p} showKAPU={showKAPU} />
                    ))}
                  </div>
                )}

                {/* Broker products list */}
                {clientType === 'broker' && (
                  <div className="space-y-1">
                    {brokerProducts.map((p: BrokerProduct, i: number) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 ${
                          p.platba === 'nezaplaceno' ? 'bg-err-container/40' : 'bg-gray-25'
                        } ${p.status === 'neaktivní' ? 'opacity-55' : ''}`}
                      >
                        <span className="text-sm shrink-0 mt-0.5">{productIcons[p.type] ?? productIcons[p.name] ?? '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold block leading-tight ${p.status === 'neaktivní' ? 'text-gray-400' : 'text-direct-800'}`}>
                            {p.type}
                            {p.contractNumber && <span className="font-normal text-gray-500 text-xs ml-1.5">{p.contractNumber}</span>}
                          </p>
                          <span className="text-xs text-gray-500 truncate block mt-0.5">{p.description}</span>
                          <span className="text-xs text-direct-600 font-medium">{p.clientName} · {p.clientNumber}</span>
                        </div>
                        <div className="shrink-0 text-right">
                          <div>
                            {p.platba === 'zaplaceno'   && <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-xs font-semibold">OK</span>}
                            {p.platba === 'nezaplaceno' && <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-xs font-semibold">DLUH</span>}
                            {p.platba === 'vypršelo'    && <span className="text-xs text-gray-400">Vypršelo</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{p.začátekSmlouvy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* KC: Škody after products */}
            {showClaims && !showKAPU && <ClaimsSection claimList={activeClaims} isKAPU={false} />}

            {/* Tickets */}
            {activeTickets.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tickety</p>
                  <span className="px-1.5 py-0.5 rounded-full bg-warn-container text-warn text-xs font-bold">{activeTickets.length}</span>
                </div>
                <div className="space-y-1.5">
                  {activeTickets.map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-warn-container/30 rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-warn shrink-0">{t.id}</span>
                        <span className="text-sm text-direct-800">{t.description}</span>
                      </div>
                      <span className="text-xs font-bold text-warn shrink-0">{t.age}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactions */}
            {!isUnknown && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Interakce</p>
                  <div className="flex gap-1">
                    {([['all', 'Vše'], ['hovor', 'Hovory'], ['email', 'Emaily'], ['web', 'Web']] as const).map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => setInteractionFilter(k)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          interactionFilter === k ? 'bg-direct-800 text-white' : 'bg-gray-25 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  {visible.map((int, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-25 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <InteractionIcon type={int.type} />
                        {int.direction === 'in'
                          ? <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Příchozí</span>
                          : <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">Odchozí</span>
                        }
                      </div>
                      <span className="flex-1 text-sm text-direct-800 truncate">{int.description}</span>
                      <div className="text-right shrink-0">
                        {int.relativeDate && <p className="text-xs font-semibold text-direct-600">{int.relativeDate}</p>}
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

        {/* Right — Whisperer */}
        <div className="w-full lg:w-1/2 flex flex-col lg:overflow-hidden">
          <div className="bg-white rounded-xl flex flex-col lg:flex-1 lg:overflow-hidden shadow-card">
            <div className="px-4 pt-4 pb-3 border-b border-gray-50 shrink-0 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-lime-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-direct-800">Whisperer</p>
              <div className="ml-auto flex items-center gap-2">
                {hints.some(h => !visibleHintIds.includes(h.id)) && (
                  <button
                    onClick={addNextHint}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-medium hover:bg-gray-200 transition-colors"
                    title="Simulovat příchod nového hintu"
                  >
                    + hint
                  </button>
                )}
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-direct-500 animate-pulse" />
                  Živě
                </span>
              </div>
            </div>

            <div className="lg:flex-1 lg:overflow-y-auto no-scrollbar p-3 space-y-2">
              {orderedHints.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">Whisperer čeká na průběh hovoru…</p>
                </div>
              )}

              {/* Recent hints (top 2 non-pinned) */}
              {recentHints.map(hint => (
                <HintCard
                  key={hint.id}
                  hint={hint}
                  isNew={newHintIds.has(hint.id)}
                  isPinned={false}
                  isExpanded={expandedHintIds.has(hint.id)}
                  onExpandToggle={toggleExpand}
                  onPin={togglePin}
                />
              ))}

              {/* Pinned hints */}
              {pinnedHints.length > 0 && (
                <>
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-lime-200" />
                    <p className="text-[10px] text-lime-600 font-semibold shrink-0 flex items-center gap-1">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Připnuté
                    </p>
                    <div className="flex-1 h-px bg-lime-200" />
                  </div>
                  {pinnedHints.map(hint => (
                    <HintCard
                      key={hint.id}
                      hint={hint}
                      isNew={false}
                      isPinned={true}
                      isExpanded={expandedHintIds.has(hint.id)}
                      onExpandToggle={toggleExpand}
                      onPin={togglePin}
                    />
                  ))}
                </>
              )}

              {/* Older hints */}
              {olderHints.length > 0 && (
                <>
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-gray-100" />
                    <p className="text-[10px] text-gray-300 font-medium shrink-0">Starší</p>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    {olderHints.map(hint => (
                      <div key={hint.id} className={expandedHintIds.has(hint.id) ? '' : 'opacity-50'}>
                        <HintCard
                          hint={hint}
                          isNew={false}
                          isPinned={false}
                          isExpanded={expandedHintIds.has(hint.id)}
                          onExpandToggle={toggleExpand}
                          onPin={togglePin}
                        />
                      </div>
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
