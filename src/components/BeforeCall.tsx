import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  client, products, interactions, tickets, claims, calculations,
  companyClient, companyProducts, companyInteractions, companyTickets, companyClaims,
  brokerClient, brokerProducts, brokerInteractions,
  standardNoEmailClient, standardAutoClient, autoCalculations,
  callDirection, callQueue, voicebotQuote, voicebotClassification,
  unknownCallerPhone, ambiguousCallers, AMBIGUOUS_PRODUCT_TYPES,
} from '../data/mockData';
import type { Product, BrokerProduct, Claim, Calculation, Interaction, Ticket, ClientStatus, RiskDetail } from '../data/mockData';
import type { Screen } from '../App';
import { CalculationsSection } from './shared/CalculationsSection';
import { ChangeClientButton } from './shared/ChangeClientButton';
import { ClientStatusBadge } from './shared/ClientStatusBadge';
import { NewCoreButton } from './shared/NewCoreButton';
import { InfoTooltip } from './ui/InfoTooltip';
import { glossary } from '../data/glossary';

interface BeforeCallProps {
  onNavigate:                  (screen: Screen) => void;
  onDisambiguationResolved:    (clientType: 'standard' | 'company' | 'unknown') => void;
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
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-lime-500 ml-1 shrink-0 cursor-help">
        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </InfoTooltip>
  );
}

function ClientTypeIcon({ type }: { type: string }) {
  if (type === 'company') return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
  if (type === 'broker') return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (type === 'unknown') return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

// ─── Expandable product card ──────────────────────────────────────────────────

function ProductCard({ p, showKAPU }: { p: Product; showKAPU: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const risks = p.risks ?? [];
  const shown = risks.slice(0, 4);
  const extra = risks.length - 4;

  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        p.platba === 'nezaplaceno'
          ? 'bg-err-container/30 border-red-200/50 hover:bg-err-container/50'
          : p.status === 'neaktivní'
          ? 'bg-gray-25 border-gray-100 opacity-60'
          : 'bg-gray-25 border-gray-100 hover:bg-gray-50'
      }`}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="text-lg shrink-0 mt-0.5">{productIcons[p.type] ?? productIcons[p.name] ?? '📄'}</span>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold leading-tight ${p.status === 'neaktivní' ? 'text-gray-400' : 'text-direct-800'}`}>
            {glossary[p.type] ? (
              <InfoTooltip content={glossary[p.type]}>
                <span className="cursor-help border-b border-dotted border-current/40">{p.type}</span>
              </InfoTooltip>
            ) : p.type}
            {p.contractNumber && <span className="font-normal text-gray-500 text-xs ml-2">{p.contractNumber}</span>}
          </p>
          <p className="text-xs text-gray-500 leading-tight mt-0.5 truncate">{p.description}</p>
          {risks.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {shown.map(r => (
                <span key={r} className="px-1.5 py-0.5 rounded-full bg-white/80 text-gray-500 text-[10px] font-medium border border-gray-200/70">{r}</span>
              ))}
              {extra > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-medium">+{extra} další</span>
              )}
            </div>
          )}
          {showKAPU && p.limitPlnění && (
            <p className="text-xs text-gray-500 mt-1">
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
        <div className="flex items-center gap-2 shrink-0">
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
              <span className="text-xs text-gray-400 font-medium cursor-help">Vypršelo</span>
            </InfoTooltip>
          )}
          <svg className={`w-4 h-4 text-gray-300 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded: risk details table */}
      {expanded && p.riskDetails && p.riskDetails.length > 0 && (
        <div className="px-4 pb-4 animate-fade-in" onClick={e => e.stopPropagation()}>
          <div className="border-t border-gray-200/60 pt-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 uppercase tracking-wider">
                  <th className="text-left pb-2 font-medium text-[10px]">Riziko</th>
                  <th className="text-right pb-2 font-medium text-[10px]">
                    <InfoTooltip content={glossary.limitPlnění}>
                      <span className="cursor-help border-b border-dotted border-current/40">Limit plnění</span>
                    </InfoTooltip>
                  </th>
                  <th className="text-right pb-2 font-medium text-[10px]">
                    <InfoTooltip content={glossary.spoluÚčast}>
                      <span className="cursor-help border-b border-dotted border-current/40">Spoluúčast</span>
                    </InfoTooltip>
                  </th>
                  <th className="text-right pb-2 font-medium text-[10px] hidden lg:table-cell">
                    <InfoTooltip content={glossary.datumSjednání}>
                      <span className="cursor-help border-b border-dotted border-current/40">Sjednáno</span>
                    </InfoTooltip>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {p.riskDetails.map((rd: RiskDetail, i: number) => (
                  <tr key={i} className="text-direct-800">
                    <td className="py-1.5 pr-2 font-medium">{rd.name}</td>
                    <td className="py-1.5 pr-2 text-right text-gray-600">{rd.limitPlnění ?? '—'}</td>
                    <td className="py-1.5 text-right text-gray-600">{rd.spoluÚčast ?? '—'}</td>
                    <td className="py-1.5 text-right text-gray-400 hidden lg:table-cell">{rd.datumSjednání ?? '—'}</td>
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

// ─── Claims section ────────────────────────────────────────────────────────────

function ClaimsSection({ claimList, isKAPU = false }: { claimList: Claim[]; isKAPU?: boolean }) {
  const active   = claimList.filter(c => c.status === 'aktivní');
  const inactive = claimList.filter(c => c.status === 'neaktivní');
  const rejected = claimList.filter(c => c.status === 'zamítnutá');
  const [expandedId, setExpandedId] = useState<string | null>(
    isKAPU && active.length > 0 ? active[0].id : null
  );

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Škody</p>
          {active.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{active.length}</span>
          )}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-direct-25 text-direct-600 text-xs font-medium hover:bg-direct-100 transition-colors">
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
              <div className="px-4 pt-3 pb-2.5">
                {/* Row 1: type (main title) + status badge + age */}
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{c.icon}</span>
                    <span className="text-sm font-bold text-direct-800 leading-tight">{c.type}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${claimStatusCls(c.statusBadge)}`}>{c.statusBadge}</span>
                    {c.relativeDays !== undefined && (
                      <InfoTooltip content={glossary.relativeDays}>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold cursor-help">{c.relativeDays} dní</span>
                      </InfoTooltip>
                    )}
                    <svg className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                {/* Row 2: ID · role · risk */}
                <div className="flex items-center gap-2 pl-9 flex-wrap">
                  <span className="text-xs font-semibold text-direct-600">{c.id}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{c.roleKlienta}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{c.risk}</span>
                </div>
                {/* Row 3: popis události */}
                {c.nehodovýDěj && (
                  <p className="text-xs text-gray-500 italic mt-1.5 pl-9 leading-relaxed">{c.nehodovýDěj}</p>
                )}
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-direct-100 px-4 pt-3 pb-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <InfoTooltip content={glossary.datumVzniku} side="bottom">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Datum vzniku</p>
                      </InfoTooltip>
                      <p className="text-sm font-semibold text-direct-800">{c.datumVzniku}</p>
                    </div>
                    <div>
                      <InfoTooltip content={glossary.datumHlášení} side="bottom">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Datum hlášení</p>
                      </InfoTooltip>
                      <p className="text-sm font-semibold text-direct-800">{c.datumHlášení}</p>
                    </div>
                    {c.datumUzavření && (
                      <div>
                        <InfoTooltip content={glossary.datumUzavření} side="bottom">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Uzavřeno</p>
                        </InfoTooltip>
                        <p className="text-sm font-semibold text-direct-800">{c.datumUzavření}</p>
                      </div>
                    )}
                  </div>
                  {c.limitPlnění && (
                    <div className="flex items-center gap-6 pt-3 border-t border-direct-100/60">
                      <div>
                        <InfoTooltip content={glossary.limitPlnění} side="bottom">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Limit plnění</p>
                        </InfoTooltip>
                        <p className="text-sm font-semibold text-direct-800">{c.limitPlnění}</p>
                      </div>
                      <div>
                        <InfoTooltip content={glossary.spoluÚčast} side="bottom">
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1 font-medium cursor-help inline-block border-b border-dotted border-gray-300">Spoluúčast</p>
                        </InfoTooltip>
                        <p className="text-sm font-semibold text-direct-800">{c.spoluÚčast}</p>
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
              <div key={c.id} className="rounded-xl px-4 py-2.5 bg-gray-25 hover:bg-gray-50 opacity-65 transition-all cursor-pointer">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base shrink-0">{c.icon}</span>
                    <span className="text-xs font-bold text-gray-600">{c.id}</span>
                    <span className="text-sm text-gray-500 font-medium">{c.type}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${claimStatusCls(c.statusBadge)}`}>{c.statusBadge}</span>
                  </div>
                  {c.datumVzniku && <span className="text-xs text-gray-400 shrink-0">{c.datumVzniku}</span>}
                </div>
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
              <div key={c.id} className="rounded-xl px-4 py-2.5 bg-err-container/20 hover:bg-err-container/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base shrink-0">{c.icon}</span>
                    <span className="text-xs font-bold text-err">{c.id}</span>
                    <span className="text-sm text-direct-800 font-medium">{c.type}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${claimStatusCls(c.statusBadge)}`}>{c.statusBadge}</span>
                  </div>
                  {c.datumVzniku && <span className="text-xs text-gray-400 shrink-0">{c.datumVzniku}</span>}
                </div>
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
    <svg className="w-4 h-4 text-direct-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  if (type === 'hovor') return <span className="text-sm">📞</span>;
  return <span className="text-sm">🌐</span>;
}

// ─── Disambiguation modal ─────────────────────────────────────────────────────

function DisambiguationView({
  onResolved,
}: {
  onResolved: (clientType: 'standard' | 'company' | 'unknown') => void;
}) {
  return (
    <div className="pt-14 animate-fade-in">
      {/* Same banner as normal calls — voicebot quote first */}
      <div className="bg-direct-800 px-4 lg:px-8 py-4 lg:py-5">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex items-center gap-2 bg-lime-500 rounded-full px-4 py-1.5">
              <svg className="w-4 h-4 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-extrabold text-direct-800 text-sm tracking-wide uppercase">{callDirection} hovor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-direct-300 text-[12px] font-medium">Fronta:</span>
              <InfoTooltip content={glossary.fronta} side="bottom">
                <span className="px-3 py-1 rounded-full bg-direct-700 text-white text-[12px] font-semibold cursor-help">{callQueue}</span>
              </InfoTooltip>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-direct-300 text-[12px] font-medium">Důvod hovoru:</span>
              <InfoTooltip content={glossary.duvodHovoru} side="bottom">
                <span className="px-3 py-1 rounded-full bg-direct-100 text-direct-700 text-[12px] font-medium cursor-help">{voicebotClassification}</span>
              </InfoTooltip>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-lime-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p className="text-white text-base lg:text-xl font-bold leading-snug tracking-tight">{voicebotQuote}</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 pt-6 pb-20 lg:pb-6 max-w-[900px] mx-auto">
        {/* Disambiguation notice */}
        <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200">
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-amber-800">
            Číslo <span className="font-extrabold">+420 731 987 654</span> je evidováno u více osob — vyberte správnou identitu
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ambiguousCallers.map((c, i) => (
            <button
              key={i}
              onClick={() => onResolved(c.type === 'company' ? 'company' : 'standard')}
              className="text-left bg-white rounded-2xl p-5 shadow-card hover:shadow-float transition-all hover:-translate-y-0.5 border-2 border-transparent hover:border-direct-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-direct-800 flex items-center justify-center shrink-0">
                  {c.type === 'company' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-direct-800">{c.name}</h3>
                  <span className="text-[11px] text-direct-600 font-semibold">{c.čísloKlienta}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-400">{c.type === 'company' ? 'IČO' : 'Datum narození'}</p>
                  <p className="text-sm font-medium text-direct-800">{c.type === 'company' ? c.ičo : c.datumNarození}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-400">Adresa</p>
                  <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
                </div>
                <div className="pt-3">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-2">Pojištění</p>
                  <div className="flex flex-wrap gap-2">
                    {c.productTypes.map(productType => {
                      const product = AMBIGUOUS_PRODUCT_TYPES[productType];
                      return (
                        <span key={productType} className="inline-flex items-center gap-2 rounded-xl bg-direct-25 px-3 py-2 text-xs font-semibold text-direct-800">
                          <span className="text-base leading-none">{product.icon}</span>
                          {product.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-direct-600">
                <span className="text-sm font-semibold">Vybrat tohoto klienta</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Není zde správná osoba? <button onClick={() => onResolved('unknown')} className="text-direct-600 underline">Pokračovat jako neznámý volající</button></p>
      </div>
    </div>
  );
}

// ─── BeforeCall ───────────────────────────────────────────────────────────────

export function BeforeCall({
  onNavigate,
  onDisambiguationResolved,
  showClientSelection,
  onReturnToClientSelection,
}: BeforeCallProps) {
  const { team, clientType, mockClientId } = useDashboard();
  const [brokerSearch, setBrokerSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const isUnknown = clientType === 'unknown' || clientType === 'ambiguous';

  // ── Select data based on mockClientId / clientType ────────────────────────
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

  const activeTickets: Ticket[] = clientType === 'company' ? companyTickets
                        : isUnknown ? []
                        : clientType === 'broker'  ? []
                        : tickets;

  const activeClaims: Claim[] = clientType === 'company' ? companyClaims
                        : isUnknown ? []
                        : clientType === 'broker'  ? []
                        : claims;

  const activeCalcs: Calculation[] = mockClientId === 'standardAuto' ? autoCalculations
                        : (clientType === 'standard') ? calculations : [];

  // Visible products: only active or nezaplaceno (for before-call context)
  const visibleProducts = activeProducts.filter(
    (p) => p.status === 'aktivní' || p.platba === 'nezaplaceno'
  );

  // Broker search filter
  const filteredBrokerProducts = brokerProducts.filter(p =>
    !brokerSearch ||
    p.clientName.toLowerCase().includes(brokerSearch.toLowerCase()) ||
    (p.clientNumber ?? '').toLowerCase().includes(brokerSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(brokerSearch.toLowerCase())
  );

  const showClaims = (team === 'KC' || team === 'KAPU') && !isUnknown && clientType !== 'broker';
  const showCalcs  = team === 'Poradce' && activeCalcs.length > 0;
  const showKAPU   = team === 'KAPU';

  // Stats for Přehled widget
  const statContracts    = clientType === 'broker' ? brokerProducts.length : visibleProducts.length;
  const statInteractions = activeInteractions.length;
  const statTickets      = activeTickets.length;
  const statDebt         = clientType === 'broker'
    ? brokerProducts.filter(p => p.platba === 'nezaplaceno').length
    : activeProducts.filter(p => p.platba === 'nezaplaceno').length;
  const statClaims       = activeClaims.length;

  // ── Disambiguation view ───────────────────────────────────────────────────
  if (clientType === 'ambiguous') {
    return <DisambiguationView onResolved={onDisambiguationResolved} />;
  }

  // ── Unknown client fallback ───────────────────────────────────────────────
  if (isUnknown) {
    return (
      <div className="pt-14 pb-6 animate-fade-in">
        {/* Banner */}
        <div className="bg-direct-800 px-4 lg:px-8 py-4 lg:py-5 mb-0">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex items-center gap-2 bg-lime-500 rounded-full px-4 py-1.5">
                <svg className="w-4 h-4 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-extrabold text-direct-800 text-sm tracking-wide uppercase">{callDirection} hovor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-direct-300 text-[12px] font-medium">Fronta:</span>
                <InfoTooltip content={glossary.fronta} side="bottom">
                <span className="px-3 py-1 rounded-full bg-direct-700 text-white text-[12px] font-semibold cursor-help">{callQueue}</span>
              </InfoTooltip>
              </div>
              {/* Důvod hovoru — shown even for unknown */}
              <div className="flex items-center gap-1.5">
                <span className="text-direct-300 text-[12px] font-medium">Důvod hovoru:</span>
                <InfoTooltip content={glossary.duvodHovoru} side="bottom">
                <span className="px-3 py-1 rounded-full bg-direct-100 text-direct-700 text-[12px] font-medium cursor-help">{voicebotClassification}</span>
              </InfoTooltip>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-lime-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-white text-base lg:text-xl font-bold leading-snug tracking-tight">{voicebotQuote}</p>
            </div>
          </div>
        </div>

        {/* Unknown client body */}
        <div className="px-4 lg:px-6 pt-4 lg:pt-5 pb-20 lg:pb-6 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Identifikace klienta</p>
                  {showClientSelection && <ChangeClientButton onClick={onReturnToClientSelection} />}
                </div>
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-direct-800 mb-0.5">Neznámý volající</p>
                  <p className="text-sm text-gray-500 font-medium mb-4">{unknownCallerPhone}</p>
                </div>
                {/* Search bar */}
                <div className="relative mb-3">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="ID klienta, smlouva, jméno, tel., email…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-25 border border-gray-100 text-sm text-direct-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-direct-500/30"
                  />
                </div>
                {searchQuery.length > 0 && (
                  <div className="rounded-xl bg-gray-25 px-4 py-3 text-center text-sm text-gray-400">
                    Žádný výsledek pro „{searchQuery}"
                  </div>
                )}
                <button className="w-full mt-2 px-4 py-2 rounded-full bg-gray-25 text-direct-800 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Nový klient
                </button>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Smlouvy</p>
                <div className="flex flex-col items-center py-8 text-gray-300">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Žádné smlouvy k zobrazení</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Stav</p>
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Bez dat</p>
                  <p className="text-xs text-gray-400">Po identifikaci klienta se zobrazí tickety, interakce a statistiky.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal client render ──────────────────────────────────────────────────
  const avatarBg = statusAvatarBg(activeClient!.status);

  return (
    <div className="pt-14 animate-fade-in">
      {/* ── Incoming call banner ─────────────────────────────────────────── */}
      <div className="bg-direct-800 px-4 lg:px-8 py-4 lg:py-5 mb-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex items-center gap-2 bg-lime-500 rounded-full px-4 py-1.5">
              <svg className="w-4 h-4 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-extrabold text-direct-800 text-sm tracking-wide uppercase">{callDirection} hovor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-direct-300 text-[12px] font-medium">Fronta:</span>
              <InfoTooltip content={glossary.fronta} side="bottom">
                <span className="px-3 py-1 rounded-full bg-direct-700 text-white text-[12px] font-semibold cursor-help">{callQueue}</span>
              </InfoTooltip>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-direct-300 text-[12px] font-medium">Důvod hovoru:</span>
              <InfoTooltip content={glossary.duvodHovoru} side="bottom">
                <span className="px-3 py-1 rounded-full bg-direct-100 text-direct-700 text-[12px] font-medium cursor-help">{voicebotClassification}</span>
              </InfoTooltip>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-lime-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p className="text-white text-base lg:text-xl font-bold leading-snug tracking-tight">{voicebotQuote}</p>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="px-4 lg:px-6 pt-4 lg:pt-5 pb-20 lg:pb-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">

          {/* ── Client card ────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Klient</p>
                <div className="flex flex-wrap justify-end gap-2">
                  {showClientSelection && <ChangeClientButton onClick={onReturnToClientSelection} />}
                  <NewCoreButton />
                </div>
              </div>

              {/* Avatar + name header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}>
                  <ClientTypeIcon type={activeClient!.type} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-direct-800 leading-tight truncate">{activeClient!.name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <p className="text-[11px] text-direct-600 font-semibold">
                      {activeClient!.type === 'broker'
                        ? (activeClient as typeof brokerClient).čísloBrokera
                        : activeClient!.čísloKlienta}
                    </p>
                  </div>
                  {/* Status, app & Klientská zóna indicators */}
                  <div className="flex items-center gap-1 mt-1">
                    <ClientStatusBadge status={activeClient!.status} />
                    {activeClient!.type !== 'broker' && (() => {
                      const c = activeClient as (typeof client | typeof companyClient);
                      return (
                        <>
                        <InfoTooltip content={c.aktivníApp ? glossary.aktivníApp : 'Mobilní aplikace Moje Direct — klient ji nemá aktivní'}>
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center cursor-help ${c.aktivníApp ? 'bg-lime-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </span>
                        </InfoTooltip>
                        <InfoTooltip content={c.klientskáZóna ? glossary.klientskáZóna : 'Klientská zóna direct.cz — klient nemá aktivní přihlášení'}>
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center cursor-help ${c.klientskáZóna ? 'bg-lime-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </span>
                        </InfoTooltip>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {/* Standard */}
                {activeClient!.type === 'standard' && (() => {
                  const c = activeClient as typeof client;
                  return (<>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Datum narození</p>
                      <p className="text-sm font-medium text-direct-800">{c.datumNarození}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Rodné číslo</p>
                      <p className="text-sm font-medium text-direct-800">{c.rodneČíslo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Telefon</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                        {c.telVerified && <VerifiedBadge type="tel" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
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
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Trvalé bydliště</p>
                      <p className="text-sm font-medium text-direct-800">{c.trvaléBydliště}</p>
                    </div>
                  </>);
                })()}

                {/* Company */}
                {activeClient!.type === 'company' && (() => {
                  const c = activeClient as typeof companyClient;
                  return (<>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">IČO</p>
                      <p className="text-sm font-medium text-direct-800">{c.ičo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Kontaktní osoba</p>
                      <p className="text-sm font-medium text-direct-800">{c.kontaktníOsoba}</p>
                      <p className="text-[11px] text-gray-400">{c.roleKontaktu}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Telefon</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                        {c.telVerified && <VerifiedBadge type="tel" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
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
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Trvalé bydliště</p>
                      <p className="text-sm font-medium text-direct-800">{c.trvaléBydliště}</p>
                    </div>
                  </>);
                })()}

                {/* Broker */}
                {activeClient!.type === 'broker' && (() => {
                  const c = activeClient as typeof brokerClient;
                  return (<>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Číslo makléře</p>
                      <p className="text-sm font-medium text-direct-800">{c.čísloBrokera}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Telefon</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                        {c.telVerified && <VerifiedBadge type="tel" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
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
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Trvalé bydliště</p>
                      <p className="text-sm font-medium text-direct-800">{c.trvaléBydliště}</p>
                    </div>
                  </>);
                })()}
              </div>
            </div>

            {/* ── Přehled ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Přehled</p>
              <div className="space-y-2">
                {/* Aktivní smlouvy */}
                <div className="flex items-center gap-3 rounded-xl px-3 py-3 bg-lime-50">
                  <div className="w-9 h-9 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-direct-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-direct-800 leading-none">{statContracts}</p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Aktivní smlouvy</p>
                  </div>
                </div>
                {/* Počet škod celkem */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${statClaims > 0 ? 'bg-purple-50' : 'bg-gray-25'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statClaims > 0 ? 'bg-purple-100' : 'bg-gray-50'}`}>
                    <svg className={`w-4 h-4 ${statClaims > 0 ? 'text-purple-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-2xl font-extrabold leading-none ${statClaims > 0 ? 'text-purple-700' : 'text-gray-300'}`}>{statClaims}</p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Škod celkem</p>
                  </div>
                </div>
                {/* Otevřené tickety */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${statTickets > 0 ? 'bg-warn-container/40' : 'bg-gray-25'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statTickets > 0 ? 'bg-warn-container' : 'bg-gray-50'}`}>
                    <svg className={`w-4 h-4 ${statTickets > 0 ? 'text-warn' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-2xl font-extrabold leading-none ${statTickets > 0 ? 'text-warn' : 'text-gray-300'}`}>{statTickets}</p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Otevřené tickety</p>
                  </div>
                </div>
                {/* Počet interakcí celkem */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${statInteractions > 0 ? 'bg-blue-50' : 'bg-gray-25'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statInteractions > 0 ? 'bg-blue-100' : 'bg-gray-50'}`}>
                    <svg className={`w-4 h-4 ${statInteractions > 0 ? 'text-blue-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-2xl font-extrabold leading-none ${statInteractions > 0 ? 'text-blue-700' : 'text-gray-300'}`}>{statInteractions}</p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Interakcí celkem</p>
                  </div>
                </div>
                {/* Nezaplacené */}
                <div className={`flex items-center gap-3 rounded-xl px-3 py-3 ${statDebt > 0 ? 'bg-err-container/30' : 'bg-gray-25'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${statDebt > 0 ? 'bg-err-container' : 'bg-gray-50'}`}>
                    <svg className={`w-4 h-4 ${statDebt > 0 ? 'text-err' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-2xl font-extrabold leading-none ${statDebt > 0 ? 'text-err' : 'text-gray-300'}`}>{statDebt}</p>
                    <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Nezaplacené</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Smlouvy + Team sections ──────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            {showCalcs && <CalculationsSection calcs={activeCalcs} />}

            {/* KAPU: Škody first */}
            {showClaims && showKAPU && <ClaimsSection claimList={activeClaims} isKAPU={true} />}

            {/* Smlouvy */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4">Smlouvy</p>

              {/* Standard / Company products */}
              {clientType !== 'broker' && (
                <div className="space-y-1.5">
                  {visibleProducts.map((p, i) => (
                    <ProductCard key={i} p={p} showKAPU={showKAPU} />
                  ))}
                  {visibleProducts.length === 0 && (
                    <p className="text-sm text-gray-400 py-4 text-center">Žádné aktivní smlouvy</p>
                  )}
                </div>
              )}

              {/* Broker products with search */}
              {clientType === 'broker' && (
                <>
                  <div className="relative mb-3">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Hledat klienta nebo smlouvu…"
                      value={brokerSearch}
                      onChange={e => setBrokerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-full bg-gray-25 border border-gray-100 text-sm text-direct-800 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-direct-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    {filteredBrokerProducts.map((p: BrokerProduct, i: number) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
                          p.platba === 'nezaplaceno' ? 'bg-err-container/40 hover:bg-err-container/60' : 'bg-gray-25 hover:bg-gray-50'
                        } ${p.status === 'neaktivní' ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{productIcons[p.type] ?? productIcons[p.name] ?? '📄'}</span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-direct-800 leading-tight">
                              {p.type}
                              {p.contractNumber && <span className="font-normal text-gray-400"> · {p.contractNumber}</span>}
                            </p>
                            <span className="text-[11px] text-gray-400 truncate block">{p.description}</span>
                            <span className="text-[10px] text-direct-600 font-medium">{p.clientName} · {p.clientNumber}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <InfoTooltip content={glossary.začátekSmlouvy}>
                            <span className="text-[11px] text-gray-400 cursor-help">{p.začátekSmlouvy}</span>
                          </InfoTooltip>
                          {p.platba === 'zaplaceno'   && (
                            <InfoTooltip content={glossary.OK}>
                              <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold cursor-help">OK</span>
                            </InfoTooltip>
                          )}
                          {p.platba === 'nezaplaceno' && (
                            <InfoTooltip content={glossary.DLUH}>
                              <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-[10px] font-semibold cursor-help">DLUH</span>
                            </InfoTooltip>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredBrokerProducts.length === 0 && (
                      <p className="text-sm text-gray-400 py-4 text-center">Žádné výsledky</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* KC: Škody after products */}
            {showClaims && !showKAPU && <ClaimsSection claimList={activeClaims} isKAPU={false} />}
          </div>

          {/* ── Tickets + Interactions ────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {activeTickets.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Otevřené tickety</p>
                  <span className="px-2 py-0.5 rounded-full bg-warn-container text-warn text-[10px] font-bold">{activeTickets.length}</span>
                </div>
                <div className="space-y-1.5">
                  {activeTickets.map((t) => (
                    <div key={t.id} className="rounded-xl px-4 py-3 bg-warn-container/40 hover:bg-warn-container/60 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-warn">{t.id}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-gray-500">{t.source}</span>
                          <span className="text-[10px] font-bold text-warn">{t.age}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-direct-800">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Poslední interakce */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Poslední interakce</p>
              <div className="space-y-1.5">
                {activeInteractions.slice(0, 5).map((int, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-gray-25 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <InteractionIcon type={int.type} />
                      {int.direction === 'in'
                        ? <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Příchozí</span>
                        : <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">Odchozí</span>
                      }
                    </div>
                    <span className="flex-1 text-sm text-direct-800 truncate">{int.description}</span>
                    <div className="text-right shrink-0">
                      {int.relativeDate && <p className="text-[10px] font-semibold text-direct-600">{int.relativeDate}</p>}
                      <p className="text-[10px] text-gray-400">{int.date}</p>
                    </div>
                  </div>
                ))}
                {activeInteractions.length === 0 && (
                  <p className="text-sm text-gray-400 py-3 text-center">Žádné interakce</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
