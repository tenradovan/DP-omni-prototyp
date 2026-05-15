import type { Calculation } from '../../data/mockData';

const productIcons: Record<string, string> = {
  AUTO:    '🚗', Vozidla: '🚗',
  MAJ:     '🏠', Majetek: '🏠',
  MAZL:    '🐾', Mazlíčci: '🐾',
  TRAVEL:  '✈️', Cestovní: '✈️',
  FLEET:   '🚛', Flotila: '🚛',
  BUD:     '🏭', Budovy: '🏭',
  ZÁS:     '📦', Zásoby: '📦',
  ODP:     '⚖️', 'Odpovědnost za újmu': '⚖️',
  BI:      '⚡', 'Přerušení provozu': '⚡',
  EL:      '💻', 'Elektronika a vybavení': '💻',
  'Cestovní pro zaměstnance': '✈️',
};

export function CalculationsSection({ calcs }: { calcs: Calculation[] }) {
  const current    = calcs.find(c => c.isCurrent);
  const historical = calcs.filter(c => !c.isCurrent);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nedokončené kalkulace</p>
        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{calcs.length}</span>
      </div>

      {current && (
        <div className="rounded-xl bg-direct-25 border border-direct-200/60 hover:bg-direct-50 transition-colors cursor-pointer mb-3">
          <div className="px-4 pt-3.5 pb-3">
            {/* Product + price row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-xl shrink-0">{productIcons[current.product] ?? '📄'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-direct-800 leading-tight">{current.product}</p>
                  {current.vehicleInfo && <p className="text-xs text-gray-600 mt-0.5">{current.vehicleInfo}</p>}
                  {current.detail && !current.vehicleInfo && <p className="text-xs text-gray-500 mt-0.5">{current.detail}</p>}
                </div>
              </div>
              <div className="text-right shrink-0">
                {current.price && <p className="text-base font-extrabold text-direct-800">{current.price}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{current.date}{current.time ? ` · ${current.time}` : ''}</p>
                {current.relativeDays !== undefined && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">{current.relativeDays} dní</span>
                )}
              </div>
            </div>

            {/* Selected risks */}
            {current.selectedRisks && current.selectedRisks.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {current.selectedRisks.map(r => (
                  <span key={r} className="px-1.5 py-0.5 rounded-full bg-direct-100 text-direct-700 text-[10px] font-medium">{r}</span>
                ))}
              </div>
            )}

            {/* Intermediary */}
            {current.intermediary && (
              <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 mb-2.5">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-500">Zprostředkovatel:</span>
                <span className="text-xs font-semibold text-direct-800">{current.intermediary.name}</span>
                <span className="text-xs text-gray-400">· DIR {current.intermediary.dir}</span>
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center justify-between pt-2 border-t border-direct-100">
              <span className="px-2.5 py-1 rounded-full bg-direct-800 text-white text-xs font-semibold">Aktuální</span>
              <button className="flex items-center gap-1.5 text-direct-600 text-xs font-semibold hover:text-direct-700 transition-colors">
                Otevřít sjednávač
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {historical.length > 0 && (
        <>
          {current && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Starší</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
          )}
          <div className="space-y-1.5">
            {historical.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-gray-25 hover:bg-gray-50 transition-colors cursor-pointer opacity-70 hover:opacity-90">
                <div className="flex items-center gap-3">
                  <span className="text-base shrink-0">{productIcons[c.product] ?? '📄'}</span>
                  <div>
                    <span className="text-sm font-semibold text-direct-800">{c.product}</span>
                    {c.solver && <span className="text-xs text-gray-400 ml-1.5">· {c.solver}</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{c.date}{c.time ? ` · ${c.time}` : ''}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
