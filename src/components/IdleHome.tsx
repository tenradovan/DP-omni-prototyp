import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Activity,
  Bot,
  Calculator,
  ClipboardCheck,
  FileText,
  Headphones,
  Inbox,
  MessageCircleMore,
  Search,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    name: 'Whisperer',
    description: 'Nápověda během hovoru',
    icon: MessageCircleMore,
  },
  {
    name: 'Voicebot',
    description: 'Kontext před spojením',
    icon: Bot,
  },
  {
    name: 'Interakce',
    description: 'Historie kontaktů',
    icon: Activity,
  },
  {
    name: 'Smlouvy',
    description: 'Produkty a jejich detail',
    icon: ShieldCheck,
  },
  {
    name: 'Škody',
    description: 'Pojistné události',
    icon: FileText,
  },
  {
    name: 'Tickety',
    description: 'Správa požadavků',
    icon: Inbox,
  },
  {
    name: 'Nedokončené kalkulace',
    description: 'Rozpracované nabídky',
    icon: Calculator,
  },
  {
    name: 'Souhrn z hovoru a ZZJ',
    description: 'Dokončení a zápis hovoru',
    icon: ClipboardCheck,
  },
];

interface IdleHomeProps {
  onSearchClient: (query: string) => void;
}

export function IdleHome({ onSearchClient }: IdleHomeProps) {
  const [clientSearch, setClientSearch] = useState('');

  const handleClientSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = clientSearch.trim();
    if (query) onSearchClient(query);
  };

  return (
    <div className="min-h-screen bg-gray-25 px-4 pb-24 pt-[76px] lg:px-6 lg:pb-8 lg:pt-20">
      <section
        aria-labelledby="idle-title"
        className="mx-auto max-w-[1400px] animate-fade-in"
      >
        <div className="relative overflow-hidden rounded-[28px] bg-direct-800 px-5 py-7 shadow-ambient sm:px-8 lg:px-12 lg:py-10">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[56px] border-direct-700/45" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-lime-500/5 blur-2xl" />

          <div className="relative grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-direct-100">
                  <Headphones
                    className="h-3.5 w-3.5 text-lime-500"
                    aria-hidden="true"
                  />
                  Operator Dashboard
                </span>
                <p className="mt-7 text-sm font-bold text-lime-400">
                  Váš pracovní prostor
                </p>
                <h1
                  id="idle-title"
                  className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-[46px]"
                >
                  Jste připraven/a na další hovor
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-direct-100">
                  Jakmile vám systém nasměruje příchozí hovor nebo zahájíte
                  odchozí volání, pracovní plocha se zobrazí automaticky.
                </p>
              </div>

              <form
                onSubmit={handleClientSearch}
                className="mt-auto pt-8"
                role="search"
              >
                <label
                  htmlFor="homepage-client-search"
                  className="mb-2 block text-xs font-bold text-direct-100"
                >
                  Vyhledat klienta
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      id="homepage-client-search"
                      list="homepage-client-options"
                      type="search"
                      value={clientSearch}
                      onChange={(event) => setClientSearch(event.target.value)}
                      placeholder="Jméno, telefon nebo číslo klienta"
                      autoComplete="off"
                      className="min-h-12 w-full rounded-full border border-white/15 bg-white py-3 pl-11 pr-4 text-sm font-medium text-direct-800 outline-none placeholder:text-gray-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30"
                    />
                    <datalist id="homepage-client-options">
                      <option value="Jana Nováková" />
                      <option value="ABC Logistika s.r.o." />
                      <option value="Pavel Kratochvíl" />
                      <option value="Jan Novák" />
                    </datalist>
                  </div>
                  <button
                    type="submit"
                    disabled={!clientSearch.trim()}
                    className="min-h-12 shrink-0 rounded-full bg-lime-500 px-5 py-3 text-sm font-extrabold text-direct-900 transition-colors hover:bg-lime-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-direct-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Vyhledat
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-sm sm:p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isPrimary = index === 0;
                  const isSecondary = feature.name === 'Souhrn z hovoru a ZZJ';
                  return (
                    <div
                      key={feature.name}
                      className={`flex min-h-[66px] items-center gap-3 rounded-2xl border px-3.5 py-3 ${
                        isPrimary
                          ? 'border-lime-500 bg-lime-500 text-direct-900'
                          : isSecondary
                            ? 'border-white bg-white text-direct-800'
                            : 'border-white/10 bg-white/[0.07] text-white'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isPrimary
                            ? 'bg-direct-900 text-lime-500'
                            : isSecondary
                              ? 'bg-direct-800 text-lime-500'
                              : 'bg-white/10 text-lime-500'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold">{feature.name}</p>
                        <p
                          className={`mt-0.5 text-xs ${
                            isPrimary
                              ? 'text-direct-700'
                              : isSecondary
                                ? 'text-gray-500'
                                : 'text-direct-200'
                          }`}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
