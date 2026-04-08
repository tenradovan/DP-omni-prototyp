type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-surface-container-low opacity-60" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-brand-secondary-container opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-brand-primary opacity-[0.07]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center shadow-ambient">
              <span className="font-display font-bold text-brand-on-primary text-2xl">D</span>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-on-surface mb-2">
            Direct pojišťovna
          </h1>
          <p className="font-body text-on-surface-variant text-lg">
            Operator Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-10">
          <div className="text-center mb-8">
            <p className="font-body text-sm uppercase tracking-wider text-on-surface-variant mb-1">
              Přihlášení
            </p>
            <h2 className="font-display text-xl font-semibold text-on-surface">
              Vítejte zpět
            </h2>
          </div>

          {/* SSO Button */}
          <button
            onClick={() => onNavigate('before')}
            className="w-full flex items-center justify-center gap-3 bg-brand-primary-container text-brand-on-primary font-body font-semibold py-4 px-6 rounded-full transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
              <path d="M0 0h10v10H0z" fill="#f25022"/>
              <path d="M11 0h10v10H11z" fill="#7fba00"/>
              <path d="M0 11h10v10H0z" fill="#00a4ef"/>
              <path d="M11 11h10v10H11z" fill="#ffb900"/>
            </svg>
            Přihlásit přes Microsoft SSO
          </button>

          <p className="text-center font-body text-xs text-on-surface-variant mt-6">
            Autentizace přes Microsoft Entra ID (Azure AD).
            <br/>
            Role a oprávnění jsou odvozeny z AD skupin.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center font-body text-xs text-on-surface-variant mt-8 opacity-60">
          © 2026 Direct pojišťovna — Operator Dashboard v1.0
        </p>
      </div>
    </div>
  );
}
