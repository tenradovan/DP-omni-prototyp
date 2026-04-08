import { client, products, interactions, tickets, callReason, callReasonSource } from '../data/mockData';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface BeforeCallProps {
  onNavigate: (screen: Screen) => void;
}

export function BeforeCall({ onNavigate }: BeforeCallProps) {
  return (
    <div className="pt-24 pb-12 px-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Call Direction Badge + Reason */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-secondary-container text-brand-on-secondary font-body font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Příchozí hovor
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-body text-xs">
              Fronta: Škody-hlášení
            </span>
          </div>
          <p className="font-body text-xs text-on-surface-variant">{callReasonSource}</p>
        </div>
        <button
          onClick={() => onNavigate('during')}
          className="flex items-center gap-2 bg-brand-primary text-brand-on-primary font-body font-semibold py-3 px-6 rounded-full transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Zahájit hovor
        </button>
      </div>

      {/* Call Reason */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 mb-6 shadow-ambient">
        <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-2">Důvod hovoru</p>
        <p className="font-display text-lg font-semibold text-on-surface">{callReason}</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Client Card */}
        <div className="col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient">
            <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-4">Klientské údaje</p>
            <h2 className="font-display text-2xl font-bold text-on-surface mb-6">{client.name}</h2>

            <div className="space-y-4">
              {[
                { label: 'Rodné číslo', value: client.rodneČíslo },
                { label: 'Číslo klienta', value: client.čísloKlienta },
                { label: 'Telefon', value: client.telefon },
                { label: 'Email', value: client.email },
                { label: 'Adresa', value: client.adresa },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-baseline">
                  <span className="font-body text-sm text-on-surface-variant">{item.label}</span>
                  <span className="font-body text-sm font-medium text-on-surface text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="col-span-7">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient">
            <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-4">Produkty a pojištění</p>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between bg-surface-container-low rounded-xl px-5 py-3.5 transition-colors hover:bg-surface-container-highest"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${product.status === 'aktivní' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <span className="font-body font-semibold text-sm text-on-surface">{product.name}</span>
                      <span className="font-body text-xs text-on-surface-variant ml-2">{product.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-body font-medium ${
                      product.status === 'aktivní'
                        ? 'bg-brand-secondary-container text-brand-on-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {product.status}
                    </span>
                    <span className="font-body text-xs text-on-surface-variant w-24 text-right">
                      {product.status === 'aktivní' ? `Výročí ${product.výročí}` : `Vypršelo ${product.výročí}`}
                    </span>
                    <span className={`text-sm ${
                      product.platba === 'zaplaceno' ? 'text-green-600' : product.platba === 'nezaplaceno' ? 'text-err' : 'text-on-surface-variant'
                    }`}>
                      {product.platba === 'zaplaceno' ? '✓' : product.platba === 'nezaplaceno' ? '✗' : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactions */}
        <div className="col-span-7">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient">
            <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-4">Poslední interakce</p>

            <div className="space-y-3">
              {interactions.slice(0, 3).map((interaction, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-surface-container-low rounded-xl px-5 py-3.5 transition-colors hover:bg-surface-container-highest"
                >
                  <span className="text-lg">{interaction.icon}</span>
                  <div className="flex-1">
                    <span className="font-body text-sm font-medium text-on-surface">{interaction.description}</span>
                  </div>
                  <span className="font-body text-xs text-on-surface-variant">{interaction.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Open Tickets */}
        <div className="col-span-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient">
            <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-4">Otevřené tickety</p>

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-surface-container-low rounded-xl px-5 py-3.5 transition-colors hover:bg-surface-container-highest"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-xs font-semibold text-brand-on-primary bg-surface-container px-2 py-0.5 rounded-full">{ticket.id}</span>
                    <span className="font-body text-xs text-on-surface-variant">{ticket.age}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-on-surface">{ticket.description}</span>
                    <span className="font-body text-xs text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">{ticket.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
