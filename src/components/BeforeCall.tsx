import { client, products, interactions, tickets, callDirection, callQueue, voicebotQuote, voicebotClassification } from '../data/mockData';
import type { Screen } from '../App';

interface BeforeCallProps {
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

export function BeforeCall({ onNavigate }: BeforeCallProps) {
  // Only show active products or those with debt
  const visibleProducts = products.filter(
    (p) => p.status === 'aktivní' || p.platba === 'nezaplaceno'
  );

  return (
    <div className="pt-14 pb-6 animate-fade-in">
      {/* ── Incoming call banner ───────────────────────────────────── */}
      <div className="bg-direct-800 px-8 py-5 mb-0">
        <div className="max-w-[1600px] mx-auto">
          {/* Row 1: direction + queue + classification */}
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

          {/* Row 2: voicebot quote */}
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-lime-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p className="text-white text-xl font-bold leading-snug tracking-tight">
              {voicebotQuote}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="px-6 pt-5 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">

          {/* Client */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2.5">Klient</p>
              <h2 className="text-xl font-bold text-direct-800 mb-0.5">{client.name}</h2>
              <p className="text-sm text-direct-600 font-semibold mb-4">{client.čísloKlienta}</p>
              <div className="space-y-3">
                {([
                  ['Rodné číslo', client.rodneČíslo],
                  ['Telefon',     client.telefon],
                  ['Email',       client.email],
                  ['Adresa',      client.adresa],
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-direct-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products + Interactions */}
          <div className="col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Produkty</p>
              <div className="space-y-1.5">
                {visibleProducts.map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors ${
                      p.platba === 'nezaplaceno' ? 'bg-err-container/40 hover:bg-err-container/60' : 'bg-gray-25 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{productIcons[p.name] ?? '📄'}</span>
                      <div>
                        <span className="text-sm font-semibold text-direct-800 block leading-tight">{p.name}</span>
                        <span className="text-[11px] text-gray-400">{p.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-gray-400">{p.výročí}</span>
                      {p.platba === 'zaplaceno'   && <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold">OK</span>}
                      {p.platba === 'nezaplaceno' && <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-[10px] font-semibold">Dluh</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Poslední interakce</p>
              <div className="space-y-1.5">
                {interactions.slice(0, 3).map((int, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-gray-25 hover:bg-gray-50 transition-colors">
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
            </div>
          </div>

          {/* Tickets + Stats */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Otevřené tickety</p>
                <span className="px-2 py-0.5 rounded-full bg-warn-container text-warn text-[10px] font-bold">{tickets.length}</span>
              </div>
              <div className="space-y-1.5">
                {tickets.map((t) => (
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

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-3">Přehled</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  [visibleProducts.length,                       'Aktivní produkty', 'text-direct-800'],
                  [interactions.length,                          'Interakcí celkem', 'text-direct-800'],
                  [tickets.length,                               'Otevřené tickety', 'text-warn'],
                  [products.filter(p => p.platba === 'nezaplaceno').length, 'Nezaplacené',     'text-err'],
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
