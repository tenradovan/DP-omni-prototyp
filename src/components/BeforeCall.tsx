import { client, products, interactions, tickets, callReason } from '../data/mockData';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface BeforeCallProps {
  onNavigate: (screen: Screen) => void;
}

export function BeforeCall({ onNavigate }: BeforeCallProps) {
  return (
    <div className="pt-16 pb-6 px-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-direct-800 rounded-full px-5 py-2.5">
            <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-direct-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Příchozí hovor</p>
              <p className="text-direct-300 text-[11px]">Fronta: Škody-hlášení</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('during')}
          className="flex items-center gap-2 bg-lime-500 text-direct-800 font-bold py-3 px-7 rounded-full transition-all hover:bg-lime-400 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Zahájit hovor
        </button>
      </div>

      {/* Call Reason */}
      <div className="bg-lime-50 rounded-2xl px-6 py-4 mb-5">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-1">Důvod hovoru · MAX voicebot</p>
        <p className="text-base font-bold text-direct-800">{callReason}</p>
      </div>

      {/* 3 columns */}
      <div className="grid grid-cols-12 gap-4">
        {/* Client */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2.5">Klient</p>
            <h2 className="text-xl font-bold text-direct-800 mb-0.5">{client.name}</h2>
            <p className="text-sm text-direct-600 font-semibold mb-4">{client.čísloKlienta}</p>
            <div className="space-y-3">
              {([['Rodné číslo', client.rodneČíslo], ['Telefon', client.telefon], ['Email', client.email], ['Adresa', client.adresa]] as const).map(([label, value]) => (
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
              {products.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-gray-25 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${p.status === 'aktivní' ? 'bg-direct-500' : 'bg-gray-200'}`} />
                    <span className="text-sm font-semibold text-direct-800">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">{p.status === 'aktivní' ? p.výročí : `Vyp. ${p.výročí}`}</span>
                    {p.platba === 'zaplaceno' && <span className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-600 text-[10px] font-semibold">OK</span>}
                    {p.platba === 'nezaplaceno' && <span className="px-2 py-0.5 rounded-full bg-err-container text-err text-[10px] font-semibold">Dluh</span>}
                    {p.platba === 'vypršelo' && <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[10px] font-semibold">Neakt.</span>}
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
                  <span className="text-sm">{int.icon}</span>
                  <span className="flex-1 text-sm text-direct-800 truncate">{int.description}</span>
                  <span className="text-[11px] text-gray-400 shrink-0">{int.date}</span>
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
              {[
                [products.filter(p => p.status === 'aktivní').length, 'Aktivní produkty', 'text-direct-800'],
                [interactions.length, 'Interakcí (90d)', 'text-direct-800'],
                [tickets.length, 'Otevřené tickety', 'text-warn'],
                [products.filter(p => p.platba === 'nezaplaceno').length, 'Nezaplacené', 'text-err'],
              ].map(([val, label, color]) => (
                <div key={label as string} className="bg-gray-25 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-bold ${color}`}>{val}</p>
                  <p className="text-[10px] text-gray-400">{label as string}</p>
                </div>
              ))}
            </div>
          </div>

          {products.some(p => p.platba === 'nezaplaceno') && (
            <div className="bg-err-container rounded-xl px-4 py-3 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-err shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-err">Nezaplacená splátka</p>
                <p className="text-xs text-gray-600">{products.filter(p => p.platba === 'nezaplaceno').map(p => p.name).join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
