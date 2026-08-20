import { useState } from 'react';
import type { Screen } from '../App';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => { setLoading(false); onNavigate('idle'); }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand */}
      <div className="hidden lg:flex w-[48%] bg-direct-800 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-direct-700 opacity-30 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-lime-500 opacity-10 translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center">
            <span className="font-sans font-bold text-direct-800 text-base">D</span>
          </div>
          <span className="font-sans font-bold text-white text-lg">Direct pojišťovna</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
            Operator<br />Dashboard
          </h1>
          <p className="text-direct-200 text-lg max-w-sm leading-relaxed">
            Jednotný pracovní prostor pro operátory call centra. Kontextová příprava, AI nápověda v reálném čase, rychlý wrap-up.
          </p>
          <div className="flex gap-10 mt-12">
            {[['3', 'fáze hovoru'], ['AI', 'živá nápověda'], ['1×', 'klik pro ZZJ']].map(([val, label]) => (
              <div key={val}>
                <p className="text-3xl font-bold text-lime-500">{val}</p>
                <p className="text-sm text-direct-300">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-direct-400">© 2026 Direct pojišťovna</p>
      </div>

      {/* Right — login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-25">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="w-8 h-8 rounded-lg bg-lime-500 flex items-center justify-center">
              <span className="font-sans font-bold text-direct-800 text-base">D</span>
            </div>
            <span className="font-sans font-bold text-direct-800 text-lg">Direct pojišťovna</span>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1.5">Přihlášení</p>
              <h2 className="text-2xl font-bold text-direct-800">Vítejte zpět</h2>
              <p className="text-sm text-gray-500 mt-1">Pokračujte přes firemní účet.</p>
            </div>

            {error && (
              <div className="bg-err-container rounded-xl px-4 py-3 mb-4 animate-fade-in">
                <p className="text-sm text-err">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-direct-800 text-white font-semibold py-3.5 px-6 rounded-full transition-all hover:bg-direct-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
            >
              {loading ? (
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Přesměrování...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 21 21" fill="none">
                    <path d="M0 0h10v10H0z" fill="#f25022"/><path d="M11 0h10v10H11z" fill="#7fba00"/>
                    <path d="M0 11h10v10H0z" fill="#00a4ef"/><path d="M11 11h10v10H11z" fill="#ffb900"/>
                  </svg>
                  Přihlásit přes Microsoft SSO
                </>
              )}
            </button>

            <button
              onClick={() => { setError('Přihlášení se nezdařilo. Zkontrolujte připojení a zkuste to znovu.'); setTimeout(() => setError(null), 4000); }}
              className="w-full mt-2 text-[11px] text-gray-300 hover:text-gray-400 transition-colors py-2"
            >
              Simulovat chybu přihlášení
            </button>

            <div className="mt-5 bg-gray-25 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-direct-800">Microsoft Entra ID</span> — role a přístupy ke Knowledge Base odvozeny automaticky z AD skupin.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-50 text-direct-700 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
              DEV prostředí
            </span>
            <span className="text-[11px] text-gray-300">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
