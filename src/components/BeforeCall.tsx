import { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  client, products, interactions, tickets, claims, calculations,
  companyClient, companyProducts, companyInteractions, companyTickets, companyClaims,
  brokerClient, brokerProducts, brokerInteractions,
  callDirection, callQueue, voicebotQuote, voicebotClassification,
  unknownCallerPhone,
} from '../data/mockData';
import type { Product, BrokerProduct, Claim, Calculation, Interaction, Ticket, ClientStatus } from '../data/mockData';
import type { Screen } from '../App';

interface BeforeCallProps {
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

// ─── Shared micro-components ──────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-lime-500 ml-1 shrink-0" title="Ověřeno">
      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function statusAvatarBg(status: ClientStatus): string {
  if (status === 'aktivní') return 'bg-direct-800';
  if (status === 'bývalý')  return 'bg-gray-400';
  return 'bg-amber-500'; // neklient
}

function statusLabel(status: ClientStatus): { text: string; cls: string } {
  if (status === 'aktivní') return { text: 'Aktivní klient',  cls: 'bg-lime-50 text-direct-700' };
  if (status === 'bývalý')  return { text: 'Bývalý klient',   cls: 'bg-gray-100 text-gray-500'  };
  return                           { text: 'Neklient',        cls: 'bg-amber-50 text-amber-700' };
}

// Client type icon SVG (returns inner SVG path elements)
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
  // standard — person
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

// ─── Product row (shared for standard + company) ──────────────────────────────

function ProductRow({ p, showKAPU }: { p: Product; showKAPU: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
      p.platba === 'nezaplaceno' ? 'bg-err-container/40 hover:bg-err-container/60' : 'bg-gray-25 hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-2.5">
        <span className="text-base">{productIcons[p.name] ?? '📄'}</span>
        <div>
          <span className="text-sm font-semibold text-direct-800 block leading-tight">{p.name}</span>
          <span className="text-[11px] text-gray-400">{p.description}</span>
          {showKAPU && p.limitPlnění && (
            <span className="text-[10px] text-gray-400 block leading-tight mt-0.5">
              Limit: {p.limitPlnění} · Spoluúčast: {p.spoluÚčast}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] text-gray-400">{p.výročí}</span>
        {p.platba === 'zaplaceno'   && <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold">OK</span>}
        {p.platba === 'nezaplaceno' && <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-[10px] font-semibold">DLUH</span>}
      </div>
    </div>
  );
}

// ─── Škody section (KC + KAPU) ────────────────────────────────────────────────

function ClaimsSection({ claimList }: { claimList: Claim[] }) {
  const active   = claimList.filter(c => c.status === 'aktivní');
  const inactive = claimList.filter(c => c.status === 'neaktivní');
  const rejected = claimList.filter(c => c.status === 'zamítnutá');

  const statusStyle = {
    aktivní:    { dot: 'bg-lime-500',  label: '',              row: 'bg-gray-25 hover:bg-gray-50' },
    neaktivní:  { dot: 'bg-gray-300',  label: 'text-gray-400', row: 'bg-gray-25 hover:bg-gray-50 opacity-60' },
    zamítnutá:  { dot: 'bg-err',       label: 'text-err',      row: 'bg-err-container/20 hover:bg-err-container/30' },
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Škody</p>
        <div className="relative group">
          <button className="w-6 h-6 rounded-full bg-direct-25 text-direct-600 flex items-center justify-center hover:bg-direct-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className="absolute right-0 top-full mt-1.5 bg-direct-800 text-white text-[10px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Nová hlášenka
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {active.map(c => (
          <div key={c.id} className={`rounded-xl px-4 py-2.5 transition-colors cursor-pointer ${statusStyle.aktivní.row}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-base shrink-0">{c.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-direct-800">{c.id}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-lime-50 text-direct-700 text-[9px] font-semibold">Aktivní</span>
                  </div>
                  <p className="text-sm font-medium text-direct-800 leading-tight">{c.type}</p>
                  <p className="text-[11px] text-gray-400">{c.risk}</p>
                  {c.limitPlnění && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Limit: {c.limitPlnění} · Spoluúčast: {c.spoluÚčast}
                    </p>
                  )}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}

        {inactive.length > 0 && (
          <>
            <div className="flex items-center gap-2 py-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[9px] text-gray-300 font-medium shrink-0 uppercase tracking-wide">Uzavřené</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {inactive.map(c => (
              <div key={c.id} className={`rounded-xl px-4 py-2 transition-colors cursor-pointer ${statusStyle.neaktivní.row}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">{c.icon}</span>
                  <span className="text-[11px] font-bold text-gray-500">{c.id}</span>
                  <span className="text-sm text-gray-500">{c.type}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {rejected.length > 0 && (
          <>
            <div className="flex items-center gap-2 py-0.5">
              <div className="flex-1 h-px bg-gray-100" />
              <p className="text-[9px] text-gray-300 font-medium shrink-0 uppercase tracking-wide">Zamítnuté</p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            {rejected.map(c => (
              <div key={c.id} className={`rounded-xl px-4 py-2 transition-colors cursor-pointer ${statusStyle.zamítnutá.row}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">{c.icon}</span>
                  <span className="text-[11px] font-bold text-err">{c.id}</span>
                  <span className="text-sm text-direct-800">{c.type}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Nedokončené kalkulace (Poradce) ──────────────────────────────────────────

function CalculationsSection({ calcs }: { calcs: Calculation[] }) {
  const current    = calcs.find(c => c.isCurrent);
  const historical = calcs.filter(c => !c.isCurrent);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Nedokončené kalkulace</p>

      {current && (
        <div className="rounded-xl px-4 py-3 bg-direct-25 border border-direct-100 hover:bg-direct-50 transition-colors cursor-pointer mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-base">{productIcons[current.product] ?? '📄'}</span>
              <div>
                <span className="text-sm font-semibold text-direct-800 block leading-tight">{current.product}</span>
                {current.detail && <span className="text-[11px] text-gray-400">{current.detail}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              {current.price && <p className="text-sm font-bold text-direct-800">{current.price}</p>}
              <p className="text-[10px] text-gray-400">{current.date}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-direct-800 text-white text-[10px] font-semibold">Aktuální</span>
            <svg className="w-3 h-3 text-direct-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-[10px] text-direct-600 font-medium">Otevřít sjednávač</span>
          </div>
        </div>
      )}

      {historical.length > 0 && (
        <div className="space-y-1">
          {historical.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2 bg-gray-25 hover:bg-gray-50 transition-colors cursor-pointer opacity-70">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{productIcons[c.product] ?? '📄'}</span>
                <span className="text-sm text-direct-800">{c.product}</span>
                {c.solver && <span className="text-[11px] text-gray-400">· {c.solver}</span>}
              </div>
              <span className="text-[10px] text-gray-400 shrink-0">{c.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BeforeCall ───────────────────────────────────────────────────────────────

export function BeforeCall({ onNavigate }: BeforeCallProps) {
  const { team, clientType } = useDashboard();
  const [brokerSearch, setBrokerSearch] = useState('');

  // ── Select data based on clientType ───────────────────────────────────────
  const activeClient    = clientType === 'company' ? companyClient
                        : clientType === 'broker'  ? brokerClient
                        : clientType === 'unknown' ? null
                        : client;

  const activeProducts  = clientType === 'company' ? companyProducts
                        : clientType === 'broker'  ? [] // broker uses brokerProducts
                        : products;

  const activeInteractions: Interaction[] = clientType === 'company' ? companyInteractions
                        : clientType === 'broker'  ? brokerInteractions
                        : clientType === 'unknown' ? []
                        : interactions;

  const activeTickets: Ticket[]   = clientType === 'company' ? companyTickets
                        : clientType === 'unknown' ? []
                        : clientType === 'broker'  ? []
                        : tickets;

  const activeClaims: Claim[]    = clientType === 'company' ? companyClaims
                        : clientType === 'unknown' ? []
                        : clientType === 'broker'  ? []
                        : claims;

  const activeCalcs: Calculation[] = clientType === 'standard' ? calculations : [];

  // Only show active products (+ nezaplaceno) for before-call context
  const visibleProducts = activeProducts.filter(
    (p) => p.status === 'aktivní' || p.platba === 'nezaplaceno'
  );

  // Broker search filter
  const filteredBrokerProducts = brokerProducts.filter(p =>
    !brokerSearch ||
    p.clientName.toLowerCase().includes(brokerSearch.toLowerCase()) ||
    p.clientNumber.toLowerCase().includes(brokerSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(brokerSearch.toLowerCase())
  );

  const showClaims = (team === 'KC' || team === 'KAPU') && clientType !== 'unknown';
  const showCalcs  = team === 'Poradce' && clientType === 'standard';
  const showKAPU   = team === 'KAPU';

  // ── Unknown client fallback ───────────────────────────────────────────────
  if (clientType === 'unknown') {
    return (
      <div className="pt-14 pb-6 animate-fade-in">
        {/* Banner */}
        <div className="bg-direct-800 px-8 py-5 mb-0">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-lime-500 rounded-full px-4 py-1.5">
                <svg className="w-4 h-4 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-extrabold text-direct-800 text-sm tracking-wide uppercase">{callDirection} hovor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-direct-300 text-[12px] font-medium">Fronta:</span>
                <span className="px-3 py-1 rounded-full bg-direct-700 text-white text-[12px] font-semibold">{callQueue}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-xl font-bold leading-snug">
                Číslo <span className="text-lime-400">{unknownCallerPhone}</span> nebylo nalezeno v systému
              </p>
            </div>
          </div>
        </div>

        {/* Unknown client body */}
        <div className="px-6 pt-5 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4">
            {/* Client card — unknown */}
            <div className="col-span-3">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-4">Klient</p>
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mb-3">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-direct-800 mb-0.5">Neznámý volající</p>
                  <p className="text-sm text-gray-500 font-medium mb-4">{unknownCallerPhone}</p>
                  <p className="text-xs text-gray-400 mb-4">Číslo nenalezeno v systému. Zeptejte se klienta na jméno nebo číslo smlouvy.</p>
                  <button className="w-full px-4 py-2 rounded-full bg-direct-800 text-white text-sm font-semibold hover:bg-direct-700 transition-colors mb-2">
                    Vyhledat klienta
                  </button>
                  <button className="w-full px-4 py-2 rounded-full bg-gray-25 text-direct-800 text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Nový klient
                  </button>
                </div>
              </div>
            </div>

            {/* Middle — empty */}
            <div className="col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Produkty</p>
                <div className="flex flex-col items-center py-8 text-gray-300">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Žádné smlouvy k zobrazení</p>
                </div>
              </div>
            </div>

            {/* Right — empty tickets + hint */}
            <div className="col-span-4 space-y-4">
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
  const sl       = statusLabel(activeClient!.status);

  return (
    <div className="pt-14 pb-6 animate-fade-in">
      {/* ── Incoming call banner ─────────────────────────────────────────── */}
      <div className="bg-direct-800 px-8 py-5 mb-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 bg-lime-500 rounded-full px-4 py-1.5">
              <svg className="w-4 h-4 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-extrabold text-direct-800 text-sm tracking-wide uppercase">{callDirection} hovor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-direct-300 text-[12px] font-medium">Fronta:</span>
              <span className="px-3 py-1 rounded-full bg-direct-700 text-white text-[12px] font-semibold">{callQueue}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-direct-400 text-[11px]">MAX voicebot →</span>
              <span className="px-3 py-1 rounded-full bg-direct-600 text-white text-[12px] font-medium">{voicebotClassification}</span>
            </div>
          </div>
          {clientType !== 'broker' && clientType !== 'company' && (
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-lime-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-white text-xl font-bold leading-snug tracking-tight">{voicebotQuote}</p>
            </div>
          )}
          {(clientType === 'company' || clientType === 'broker') && (
            <p className="text-direct-300 text-base font-medium">
              {clientType === 'company' ? 'Příchozí hovor od firemního klienta' : 'Příchozí hovor od makléře'}
            </p>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-5 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">

          {/* ── Client card ────────────────────────────────────────────── */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Klient</p>

              {/* Avatar + name header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${avatarBg} flex items-center justify-center shrink-0`}>
                  <ClientTypeIcon type={activeClient!.type} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-direct-800 leading-tight truncate">{activeClient!.name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <p className="text-[11px] text-direct-600 font-semibold">
                      {activeClient!.type === 'broker' ? (activeClient as typeof brokerClient).čísloBrokera : activeClient!.čísloKlienta}
                    </p>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${sl.cls}`}>{sl.text}</span>
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
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Rodné číslo</p>
                      <p className="text-sm font-medium text-direct-800">{c.rodneČíslo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Telefon</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.telefon}</p>
                        {c.telVerified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.email}</p>
                        {c.emailVerified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Adresa</p>
                      <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
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
                        {c.telVerified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.email}</p>
                        {c.emailVerified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Adresa</p>
                      <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
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
                        {c.telVerified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Email</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-direct-800">{c.email}</p>
                        {c.emailVerified && <VerifiedBadge />}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Adresa</p>
                      <p className="text-sm font-medium text-direct-800">{c.adresa}</p>
                    </div>
                  </>);
                })()}
              </div>
            </div>
          </div>

          {/* ── Products + Interactions ───────────────────────────────── */}
          <div className="col-span-5 space-y-4">

            {/* Nedokončené kalkulace (Poradce only) */}
            {showCalcs && <CalculationsSection calcs={activeCalcs} />}

            {/* Products */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Produkty</p>

              {/* Standard / Company products */}
              {clientType !== 'broker' && (
                <div className="space-y-1.5">
                  {visibleProducts.map((p, i) => (
                    <ProductRow key={i} p={p} showKAPU={showKAPU} />
                  ))}
                  {visibleProducts.length === 0 && (
                    <p className="text-sm text-gray-400 py-4 text-center">Žádné aktivní produkty</p>
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
                      placeholder="Hledat klienta nebo produkt…"
                      value={brokerSearch}
                      onChange={e => setBrokerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-full bg-gray-25 border border-gray-100 text-sm text-direct-800 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-direct-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    {filteredBrokerProducts.map((p, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
                          p.platba === 'nezaplaceno' ? 'bg-err-container/40 hover:bg-err-container/60' : 'bg-gray-25 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{productIcons[p.name] ?? '📄'}</span>
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-direct-800 block leading-tight truncate">{p.name}</span>
                            <span className="text-[11px] text-gray-400 truncate block">{p.description}</span>
                            <span className="text-[10px] text-direct-600 font-medium">{p.clientName} · {p.clientNumber}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-[11px] text-gray-400">{p.výročí}</span>
                          {p.platba === 'zaplaceno'   && <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold">OK</span>}
                          {p.platba === 'nezaplaceno' && <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-[10px] font-semibold">DLUH</span>}
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

            {/* Škody (KC + KAPU) */}
            {showClaims && <ClaimsSection claimList={activeClaims} />}

            {/* Interactions */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Poslední interakce</p>
              <div className="space-y-1.5">
                {activeInteractions.slice(0, 3).map((int, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-gray-25 hover:bg-gray-50 transition-colors">
                    <span className="text-sm shrink-0">{int.icon}</span>
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

          {/* ── Tickets + Stats ───────────────────────────────────────── */}
          <div className="col-span-4 space-y-4">
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

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Přehled</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  [clientType === 'broker' ? brokerProducts.length : visibleProducts.length, 'Aktivní smlouvy', 'text-direct-800'],
                  [activeInteractions.length,  'Interakcí celkem', 'text-direct-800'],
                  [activeTickets.length,        'Otevřené tickety', activeTickets.length > 0 ? 'text-warn' : 'text-direct-800'],
                  [clientType === 'broker'
                    ? brokerProducts.filter(p => p.platba === 'nezaplaceno').length
                    : activeProducts.filter(p => p.platba === 'nezaplaceno').length,
                    'Nezaplacené', 'text-err'],
                ] as [number, string, string][]).map(([val, label, color]) => (
                  <div key={label} className="bg-gray-25 rounded-xl p-3 text-center">
                    <p className={`text-2xl font-bold ${color}`}>{val}</p>
                    <p className="text-[10px] text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
