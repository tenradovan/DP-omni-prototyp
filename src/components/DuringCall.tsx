import { useState, useEffect } from 'react';
import { client, products, interactions, tickets, hints } from '../data/mockData';
import type { Hint, Interaction } from '../data/mockData';
import type { Screen } from '../App';

interface DuringCallProps {
  onNavigate: (screen: Screen) => void;
}

const productIcons: Record<string, string> = {
  Vozidla: '🚗',
  Majetek: '🏠',
  Mazlíčci: '🐾',
  Cestovní: '✈️',
  Motorky: '🏍️',
  Odpovědnost: '🛡️',
};

// ── HintCard ────────────────────────────────────────────────────────────────

function HintCard({ hint, isNew }: { hint: Hint; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const cat: Record<string, { bg: string; strip: string }> = {
    compliance: { bg: 'bg-amber-50',   strip: 'bg-amber-400' },
    objection:  { bg: 'bg-blue-50',    strip: 'bg-blue-400'  },
    product:    { bg: 'bg-direct-25',  strip: 'bg-direct-500'},
    info:       { bg: 'bg-purple-50',  strip: 'bg-purple-400'},
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
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="font-bold text-direct-800 text-sm leading-snug">{hint.title}</p>
                {isNew && <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse shrink-0" />}
              </div>
              <p className="text-[12px] text-gray-500 leading-tight">{hint.subtitle}</p>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-gray-300 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Expanded */}
          {expanded && (
            <div className="mt-3 space-y-2.5 animate-fade-in" onClick={e => e.stopPropagation()}>
              <p className="text-sm text-gray-700 leading-relaxed">{hint.detail}</p>
              <div className="bg-white/80 rounded-xl p-3 border border-white">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Doporučený script</p>
                <p className="text-sm text-direct-800 italic leading-relaxed">„{hint.script}"</p>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
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

// ── DuringCall ───────────────────────────────────────────────────────────────

export function DuringCall({ onNavigate }: DuringCallProps) {
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
    const timer = setInterval(() => {
      setCallTime(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reveal hints on schedule
  useEffect(() => {
    const toAdd = hints
      .filter(h => h.appearsAt === callTime && !visibleHintIds.includes(h.id))
      .map(h => h.id);
    if (toAdd.length > 0) {
      setVisibleHintIds(prev => [...toAdd, ...prev]);
      setNewHintIds(prev => new Set([...prev, ...toAdd]));
      // Remove "new" status after 5s
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

  const filtered = interactions.filter(
    (i: Interaction) => interactionFilter === 'all' || i.type === interactionFilter
  );
  const visible = showAllInteractions ? filtered : filtered.slice(0, 5);

  const orderedHints = visibleHintIds
    .map(id => hints.find(h => h.id === id))
    .filter(Boolean) as Hint[];

  return (
    <div className="pt-14 h-screen flex flex-col animate-fade-in overflow-hidden">

      {/* ── Client + Timer bar ─────────────────────────────────────── */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 shadow-card flex items-center gap-4 shrink-0">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-direct-800 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">JN</span>
          </div>
          <div>
            <p className="text-base font-bold text-direct-800 leading-tight">{client.name}</p>
            <p className="text-[11px] text-direct-600 font-semibold">{client.čísloKlienta}</p>
          </div>
        </div>

        <div className="h-7 w-px bg-gray-100 shrink-0" />

        {/* Client details */}
        <div className="flex gap-5 flex-1">
          {([['RČ', client.rodneČíslo], ['Tel', client.telefon], ['Email', client.email]] as const).map(([l, v]) => (
            <div key={l}>
              <p className="text-[9px] uppercase tracking-wider text-gray-400">{l}</p>
              <p className="text-sm font-medium text-direct-800">{v}</p>
            </div>
          ))}
        </div>

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

      {/* ── Main layout ────────────────────────────────────────────── */}
      <div className="flex-1 flex gap-4 px-6 pb-4 pt-4 overflow-hidden">

        {/* Left — context 50% */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">

            {/* Products */}
            <div className="bg-white rounded-xl p-4 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Produkty</p>
              <div className="space-y-1">
                {products.map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      p.platba === 'nezaplaceno'
                        ? 'bg-err-container/40'
                        : p.status === 'neaktivní'
                          ? 'bg-gray-25 opacity-60'
                          : 'bg-gray-25'
                    }`}
                  >
                    <span className="text-sm">{productIcons[p.name] ?? '📄'}</span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold block leading-tight ${p.status === 'neaktivní' ? 'text-gray-400' : 'text-direct-800'}`}>
                        {p.name}
                      </span>
                      <span className="text-[11px] text-gray-400 truncate block">{p.description}</span>
                    </div>
                    <div className="shrink-0">
                      {p.platba === 'zaplaceno'   && <span className="text-direct-500 text-xs font-bold">✓</span>}
                      {p.platba === 'nezaplaceno' && <span className="text-[10px] font-bold text-err bg-err-container px-2 py-0.5 rounded-full">Dluh</span>}
                      {p.platba === 'vypršelo'    && <span className="text-[10px] text-gray-300">Neakt.</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tickets */}
            {tickets.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Tickety</p>
                  <span className="px-1.5 py-0.5 rounded-full bg-warn-container text-warn text-[10px] font-bold">{tickets.length}</span>
                </div>
                <div className="space-y-1.5">
                  {tickets.map(t => (
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
                      {int.relativeDate && (
                        <p className="text-[10px] font-semibold text-direct-600">{int.relativeDate}</p>
                      )}
                      <p className="text-[10px] text-gray-400">{int.date}</p>
                    </div>
                  </div>
                ))}
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
          </div>
        </div>

        {/* Right — Whisperer 50% */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl flex flex-col flex-1 overflow-hidden shadow-card">
            {/* Header */}
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

            {/* Hint list */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
              {orderedHints.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">Whisperer čeká na průběh hovoru…</p>
                </div>
              )}
              {orderedHints.map(hint => (
                <HintCard key={hint.id} hint={hint} isNew={newHintIds.has(hint.id)} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
