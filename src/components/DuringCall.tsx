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

  const categoryColors: Record<string, string> = {
    compliance: 'bg-amber-100 text-amber-800',
    objection: 'bg-blue-100 text-blue-800',
    product: 'bg-emerald-100 text-emerald-800',
    info: 'bg-purple-100 text-purple-800',
  };

  const categoryLabels: Record<string, string> = {
    compliance: 'Compliance',
    objection: 'Námitky',
    product: 'Produkt',
    info: 'Informace',
  };

  return (
    <div
      className={`rounded-2xl transition-all ${
        isActive
          ? 'bg-surface-container-lowest shadow-ambient'
          : 'bg-surface-container-low'
      } ${expanded ? 'p-5' : 'p-4'}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{hint.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold ${categoryColors[hint.category]}`}>
              {categoryLabels[hint.category]}
            </span>
            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-left w-full"
          >
            <p className="font-body text-sm font-semibold text-on-surface">{hint.title}</p>
          </button>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              feedback === 'up' ? 'bg-brand-primary text-brand-on-primary' : 'hover:bg-surface-container'
            }`}
          >
            <span className="text-xs">👍</span>
          </button>
          <button
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              feedback === 'down' ? 'bg-err-container text-err' : 'hover:bg-surface-container'
            }`}
          >
            <span className="text-xs">👎</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 ml-8 space-y-3 animate-fade-in">
          <p className="font-body text-sm text-on-surface leading-relaxed">{hint.detail}</p>
          {hint.script && (
            <div className="bg-surface-container-low rounded-xl p-4">
              <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1">Doporučený script</p>
              <p className="font-body text-sm text-on-surface italic">"{hint.script}"</p>
            </div>
          )}
          {hint.kbCitation && (
            <p className="font-body text-xs text-on-surface-variant">
              📚 {hint.kbCitation}
            </p>
          )}
        </div>
      )}

      {feedback === 'down' && (
        <div className="mt-3 ml-8 animate-fade-in">
          <textarea
            placeholder="Volitelný komentář k negativní zpětné vazbě..."
            className="w-full bg-surface-container-low rounded-xl p-3 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none ghost-border-primary"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}

export function DuringCall({ onNavigate }: DuringCallProps) {
  const [callTime, setCallTime] = useState(0);
  const [interactionFilter, setInteractionFilter] = useState<'all' | 'hovor' | 'email' | 'web'>('all');
  const [timeFilter, setTimeFilter] = useState<30 | 90>(90);

  useEffect(() => {
    const timer = setInterval(() => setCallTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredInteractions = interactions.filter((i: Interaction) =>
    interactionFilter === 'all' ? true : i.type === interactionFilter
  );

  return (
    <div className="pt-20 h-screen flex flex-col animate-fade-in">
      {/* Call Timer Bar */}
      <div className="px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-display text-lg font-bold text-on-surface">Hovor probíhá</span>
          <span className="font-body text-2xl font-bold text-brand-on-primary tabular-nums">{formatTime(callTime)}</span>
        </div>
        <button
          onClick={() => onNavigate('after')}
          className="flex items-center gap-2 bg-red-500 text-white font-body font-semibold py-2.5 px-5 rounded-full transition-all hover:bg-red-600 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
          Ukončit hovor
        </button>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex gap-6 px-8 pb-6 overflow-hidden">
        {/* Left Panel - Client Context */}
        <div className="w-[55%] flex flex-col overflow-hidden">
          {/* Sticky Core Info */}
          <div className="glass rounded-2xl ghost-border p-4 mb-4 flex items-center gap-6 shrink-0">
            <div>
              <p className="font-display text-lg font-bold text-on-surface">{client.name}</p>
              <p className="font-body text-xs text-on-surface-variant">{client.čísloKlienta}</p>
            </div>
            <div className="h-8 w-px bg-surface-container" />
            <div className="flex gap-6">
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-on-surface-variant">RČ</p>
                <p className="font-body text-sm font-medium text-on-surface">{client.rodneČíslo}</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-on-surface-variant">Telefon</p>
                <p className="font-body text-sm font-medium text-on-surface">{client.telefon}</p>
              </div>
              <div>
                <p className="font-body text-[10px] uppercase tracking-wider text-on-surface-variant">Email</p>
                <p className="font-body text-sm font-medium text-on-surface">{client.email}</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {/* Products */}
            <div className="bg-surface-container-lowest rounded-2xl p-5">
              <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-3">Produkty a smlouvy</p>
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3 transition-colors hover:bg-surface-container-highest"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${product.status === 'aktivní' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-body font-semibold text-sm text-on-surface">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-body ${
                        product.status === 'aktivní' ? 'bg-brand-secondary-container text-brand-on-secondary' : 'bg-surface-container text-on-surface-variant'
                      }`}>{product.status}</span>
                      <span className="font-body text-xs text-on-surface-variant">{product.výročí}</span>
                      <span className={`text-sm ${product.platba === 'zaplaceno' ? 'text-green-600' : product.platba === 'nezaplaceno' ? 'text-err' : 'text-on-surface-variant'}`}>
                        {product.platba === 'zaplaceno' ? '✓' : product.platba === 'nezaplaceno' ? '✗' : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-surface-container-lowest rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant">Historie interakcí</p>
                <div className="flex gap-1.5">
                  {[30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeFilter(days as 30 | 90)}
                      className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-colors ${
                        timeFilter === days ? 'bg-brand-primary text-brand-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {days} dní
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filters */}
              <div className="flex gap-1.5 mb-3">
                {([['all', 'Vše'], ['hovor', 'Hovory'], ['email', 'Emaily'], ['web', 'Web']] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setInteractionFilter(key)}
                    className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-colors ${
                      interactionFilter === key ? 'bg-brand-primary text-brand-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredInteractions.map((interaction, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 transition-colors hover:bg-surface-container-highest"
                  >
                    <span className="text-base">{interaction.icon}</span>
                    <span className="flex-1 font-body text-sm text-on-surface">{interaction.description}</span>
                    <span className="font-body text-xs text-on-surface-variant">{interaction.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tickets */}
            <div className="bg-surface-container-lowest rounded-2xl p-5">
              <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-3">Otevřené tickety</p>
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-surface-container-low rounded-xl px-4 py-3 transition-colors hover:bg-surface-container-highest">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-xs font-semibold text-brand-on-primary bg-surface-container px-2 py-0.5 rounded-full">{ticket.id}</span>
                      <span className="font-body text-xs text-on-surface-variant">{ticket.age}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-on-surface">{ticket.description}</span>
                      <span className="font-body text-xs text-on-surface-variant">{ticket.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - AI Hints */}
        <div className="w-[45%] flex flex-col overflow-hidden">
          <div className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <div className="w-6 h-6 rounded-lg bg-brand-primary flex items-center justify-center">
                <span className="text-xs">🤖</span>
              </div>
              <p className="font-display text-sm font-bold text-on-surface">Whisperer — AI Nápověda</p>
              <span className="ml-auto font-body text-xs text-on-surface-variant">Živé doporučení</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {/* Active Hints */}
              {hints.filter(h => h.isActive).map((hint) => (
                <HintCard key={hint.id} hint={hint} isActive={true} />
              ))}

              {/* Separator */}
              <div className="py-2">
                <p className="font-body text-xs text-on-surface-variant text-center">Předchozí doporučení</p>
              </div>

              {/* Older Hints */}
              {hints.filter(h => !h.isActive).map((hint) => (
                <HintCard key={hint.id} hint={hint} isActive={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
