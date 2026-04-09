import { useState } from 'react';
import { operators as initOps, productColumns, skillLevels as initLevels } from '../data/mockData';
import type { Operator } from '../data/mockData';

// Updated skill levels to match Direct brand
const skillLevels: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Neumí', color: '#809f99', bg: '#f2f5f5' },
  1: { label: 'Junior', color: '#006b55', bg: '#d1f3e7' },
  2: { label: 'Medior', color: '#415b00', bg: '#eaf3a3' },
  3: { label: 'Senior', color: '#004033', bg: '#c4de00' },
};

export function SkillMatrix() {
  const [operators, setOperators] = useState<Operator[]>(initOps);
  const [teamFilter, setTeamFilter] = useState<'all' | 'KC' | 'KAPU' | 'Poradci'>('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newOp, setNewOp] = useState({ name: '', team: 'KC' as 'KC' | 'KAPU' | 'Poradci' });

  const filtered = operators.filter(o =>
    (teamFilter === 'all' || o.team === teamFilter) && o.name.toLowerCase().includes(search.toLowerCase())
  );

  const cycle = (id: string, prod: string) => {
    setOperators(operators.map(o => o.id !== id ? o : { ...o, skills: { ...o.skills, [prod]: ((o.skills[prod] ?? 0) + 1) % 4 } }));
  };

  const handleAdd = () => {
    if (!newOp.name) return;
    setOperators([...operators, { id: `o${Date.now()}`, name: newOp.name, team: newOp.team, skills: Object.fromEntries(productColumns.map(p => [p, 0])) }]);
    setNewOp({ name: '', team: 'KC' });
    setShowAdd(false);
  };

  return (
    <div className="pt-16 pb-6 px-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Admin Panel</p>
          <h1 className="text-3xl font-extrabold text-direct-800">Skill Matice</h1>
          <p className="text-sm text-gray-500 mt-1">Klikněte na buňku pro změnu úrovně</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-direct-800 text-white font-semibold py-2.5 px-5 rounded-full hover:bg-direct-700 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Přidat operátora
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex gap-1">
          {(['all', 'KC', 'KAPU', 'Poradci'] as const).map(t => (
            <button key={t} onClick={() => setTeamFilter(t)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${teamFilter === t ? 'bg-direct-800 text-white' : 'bg-gray-25 text-gray-500 hover:bg-gray-50'}`}>
              {t === 'all' ? 'Všechny' : t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hledat operátora..."
            className="w-full bg-gray-25 rounded-full pl-9 pr-4 py-2 text-sm text-direct-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500/30" />
        </div>
        <div className="flex items-center gap-2.5 ml-auto">
          {Object.entries(skillLevels).map(([lev, { label, bg, color }]) => (
            <div key={lev} className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: bg, color }}>{lev}</span>
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px_80px] bg-gray-25">
          <div className="px-5 py-3"><span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Operátor</span></div>
          {productColumns.map(c => <div key={c} className="px-2 py-3 text-center"><span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{c}</span></div>)}
        </div>
        {filtered.map((op, i) => (
          <div key={op.id} className={`grid grid-cols-[1fr_80px_80px_80px_80px_80px_80px] items-center hover:bg-gray-25/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-25/30'}`}>
            <div className="px-5 py-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-direct-800 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{op.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-direct-800 block leading-tight">{op.name}</span>
                <span className="text-[10px] text-gray-400">{op.team}</span>
              </div>
            </div>
            {productColumns.map(col => {
              const lev = op.skills[col] ?? 0;
              const { bg, color } = skillLevels[lev];
              return (
                <div key={col} className="px-2 py-2.5 flex justify-center">
                  <button onClick={() => cycle(op.id, col)}
                    className="w-10 h-8 rounded-md flex items-center justify-center text-[11px] font-bold transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: bg, color }}>
                    {lev}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-10 text-center text-sm text-gray-400">Žádní operátoři.</div>}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-float p-7 w-[400px] animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-direct-800 mb-5">Nový operátor</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 block">Jméno</label>
                <input value={newOp.name} onChange={e => setNewOp({ ...newOp, name: e.target.value })}
                  className="w-full bg-gray-25 rounded-xl px-4 py-3 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30" placeholder="Karel Novák" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 block">Tým</label>
                <div className="flex gap-1.5">
                  {(['KC', 'KAPU', 'Poradci'] as const).map(t => (
                    <button key={t} onClick={() => setNewOp({ ...newOp, team: t })}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${newOp.team === t ? 'bg-direct-800 text-white' : 'bg-gray-25 text-gray-500 hover:bg-gray-50'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-sm text-gray-400">Zrušit</button>
              <button onClick={handleAdd} className="px-5 py-2.5 bg-direct-800 text-white text-sm font-semibold rounded-full hover:bg-direct-700">Přidat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
