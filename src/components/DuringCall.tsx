import { useState, useEffect } from 'react';
import { client, products, interactions, tickets, hints } from '../data/mockData';
import type { Hint, Interaction } from '../data/mockData';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface DuringCallProps {
  onNavigate: (screen: Screen) => void;
}

function HintCard({ hint, isActive }: { hint: Hint; isActive: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const cat: Record<string, { bg: string; text: string; strip: string }> = {
    compliance: { bg: 'bg-amber-50', text: 'text-amber-700', strip: 'bg-amber-400' },
    objection: { bg: 'bg-blue-50', text: 'text-blue-700', strip: 'bg-blue-400' },
    product: { bg: 'bg-direct-25', text: 'text-direct-700', strip: 'bg-direct-500' },
    info: { bg: 'bg-purple-50', text: 'text-purple-700', strip: 'bg-purple-400' },
  };
  const labels: Record<string, string> = { compliance: 'Compliance', objection: 'Námitky', product: 'Nabídka', info: 'Info' };
  const c = cat[hint.category];

  return (
    <div
      className={`rounded-xl transition-all cursor-pointer ${isActive ? `${c.bg} shadow-card` : 'bg-gray-25 opacity-60 hover:opacity-90'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex">
        <div className={`w-1 rounded-l-xl ${c.strip} ${isActive ? '' : 'opacity-40'}`} />
        <div className="flex-1 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text}`}>{labels[hint.category]}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />}
              </div>
              <p className={`font-bold text-direct-800 ${isActive ? 'text-sm' : 'text-[13px]'}`}>{hint.icon} {hint.title}</p>
            </div>
            <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
              <button onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${feedback === 'up' ? 'bg-direct-800 text-white' : 'bg-white/60 text-gray-400 hover:bg-white'}`}>
                <svg className="w-3 h-3" fill={feedback === 'up' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" /></svg>
              </button>
              <button onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${feedback === 'down' ? 'bg-err text-white' : 'bg-white/60 text-gray-400 hover:bg-white'}`}>
                <svg className="w-3 h-3" fill={feedback === 'down' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" /></svg>
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-2.5 space-y-2 animate-fade-in" onClick={e => e.stopPropagation()}>
              <p className="text-sm text-gray-600 leading-relaxed">{hint.detail}</p>
              {hint.script && (
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Script</p>
                  <p className="text-sm text-direct-800 italic">„{hint.script}"</p>
                </div>
              )}
              {hint.kbCitation && <p className="text-[10px] text-gray-400">📚 {hint.kbCitation}</p>}
              {feedback === 'down' && (
                <textarea placeholder="Co bylo špatně?" className="w-full bg-white rounded-lg p-2.5 text-sm text-direct-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-lime-500/30" rows={2} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DuringCall({ onNavigate }: DuringCallProps) {
  const [callTime, setCallTime] = useState(0);
  const [interactionFilter, setInteractionFilter] = useState<'all' | 'hovor' | 'email' | 'web'>('all');
  const [showAllInteractions, setShowAllInteractions] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const filtered = interactions.filter((i: Interaction) => interactionFilter === 'all' || i.type === interactionFilter);
  const visible = showAllInteractions ? filtered : filtered.slice(0, 3);

  return (
    <div className="pt-14 h-screen flex flex-col animate-fade-in">
      {/* Timer bar */}
      <div className="px-6 py-2.5 flex items-center justify-between bg-gray-25">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-sm font-bold text-direct-800">Hovor probíhá</span>
          <span className="text-2xl font-extrabold text-direct-800 tabular-nums tracking-tight">{fmt(callTime)}</span>
        </div>
        <button onClick={() => onNavigate('after')}
          className="flex items-center gap-2 bg-red-500 text-white font-bold py-2 px-5 rounded-full transition-all hover:bg-red-600 active:scale-[0.98] text-sm">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
          Ukončit hovor
        </button>
      </div>

      <div className="flex-1 flex gap-4 px-6 pb-4 pt-3 overflow-hidden">
        {/* Left — context */}
        <div className="w-[55%] flex flex-col overflow-hidden">
          {/* Sticky client bar */}
          <div className="glass rounded-xl shadow-card p-3.5 mb-3 flex items-center gap-5 shrink-0">
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
            <div className="flex gap-5">
              {([['RČ', client.rodneČíslo], ['Telefon', client.telefon], ['Email', client.email]] as const).map(([l, v]) => (
                <div key={l}><p className="text-[9px] uppercase tracking-wider text-gray-400">{l}</p><p className="text-sm font-medium text-direct-800">{v}</p></div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {/* Products compact */}
            <div className="bg-white rounded-xl p-4 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Produkty</p>
              <div className="grid grid-cols-2 gap-1.5">
                {products.map(p => (
                  <div key={p.name} className={`flex items-center justify-between rounded-lg px-3 py-2 ${p.platba === 'nezaplaceno' ? 'bg-err-container/50' : 'bg-gray-25'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'aktivní' ? 'bg-direct-500' : 'bg-gray-200'}`} />
                      <span className="text-sm font-semibold text-direct-800">{p.name}</span>
                    </div>
                    {p.platba === 'zaplaceno' && <span className="text-direct-500 text-xs">✓</span>}
                    {p.platba === 'nezaplaceno' && <span className="text-[10px] font-bold text-err">Dluh</span>}
                    {p.platba === 'vypršelo' && <span className="text-[10px] text-gray-300">Neakt.</span>}
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
                        <span className="text-[11px] font-bold text-warn">{t.id}</span>
                        <span className="text-sm text-direct-800">{t.description}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-warn">{t.age}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Interakce</p>
                <div className="flex gap-1">
                  {([['all', 'Vše'], ['hovor', 'Hovory'], ['email', 'Emaily'], ['web', 'Web']] as const).map(([k, l]) => (
                    <button key={k} onClick={() => setInteractionFilter(k)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${interactionFilter === k ? 'bg-direct-800 text-white' : 'bg-gray-25 text-gray-400 hover:bg-gray-50'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                {visible.map((int, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg px-3 py-2 bg-gray-25 hover:bg-gray-50 transition-colors">
                    <span className="text-sm">{int.icon}</span>
                    <span className="flex-1 text-sm text-direct-800 truncate">{int.description}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">{int.date}</span>
                  </div>
                ))}
              </div>
              {filtered.length > 3 && (
                <button onClick={() => setShowAllInteractions(!showAllInteractions)}
                  className="w-full mt-2 py-1 text-[11px] text-direct-600 font-medium hover:underline">
                  {showAllInteractions ? 'Méně' : `Všechny (${filtered.length})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right — AI hints */}
        <div className="w-[45%] flex flex-col overflow-hidden">
          <div className="bg-white rounded-xl p-4 flex flex-col flex-1 overflow-hidden shadow-card">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <div className="w-6 h-6 rounded-md bg-lime-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-direct-800">Whisperer</p>
              <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-direct-500" />Živě
              </span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
              {hints.filter(h => h.isActive).map(h => <HintCard key={h.id} hint={h} isActive />)}
              <div className="flex items-center gap-2 py-1.5">
                <div className="flex-1 h-px bg-gray-50" /><p className="text-[10px] text-gray-300 shrink-0">Starší</p><div className="flex-1 h-px bg-gray-50" />
              </div>
              {hints.filter(h => !h.isActive).map(h => <HintCard key={h.id} hint={h} isActive={false} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
