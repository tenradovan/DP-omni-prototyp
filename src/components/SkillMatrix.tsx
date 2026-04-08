import { useState } from 'react';
import { operators as initialOperators, productColumns, skillLevels } from '../data/mockData';
import type { Operator } from '../data/mockData';

export function SkillMatrix() {
  const [operators, setOperators] = useState<Operator[]>(initialOperators);
  const [teamFilter, setTeamFilter] = useState<'all' | 'KC' | 'KAPU' | 'Poradci'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOp, setNewOp] = useState({ name: '', team: 'KC' as 'KC' | 'KAPU' | 'Poradci' });

  const filteredOperators = operators.filter((op) => {
    const matchesTeam = teamFilter === 'all' || op.team === teamFilter;
    const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const cycleSkill = (operatorId: string, product: string) => {
    setOperators(operators.map((op) => {
      if (op.id !== operatorId) return op;
      const current = op.skills[product] ?? 0;
      const next = (current + 1) % 4;
      return { ...op, skills: { ...op.skills, [product]: next } };
    }));
  };

  const handleAddOperator = () => {
    if (!newOp.name) return;
    const op: Operator = {
      id: `o${Date.now()}`,
      name: newOp.name,
      team: newOp.team,
      skills: Object.fromEntries(productColumns.map(p => [p, 0])),
    };
    setOperators([...operators, op]);
    setNewOp({ name: '', team: 'KC' });
    setShowAddModal(false);
  };

  return (
    <div className="pt-24 pb-12 px-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1">Admin Panel</p>
          <h1 className="font-display text-3xl font-bold text-on-surface">Skill Matice</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Správa skill profilů operátorů — klikněte na buňku pro změnu úrovně</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-on-primary font-body font-semibold py-2.5 px-5 rounded-full transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Přidat operátora
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-1.5">
          {(['all', 'KC', 'KAPU', 'Poradci'] as const).map((team) => (
            <button
              key={team}
              onClick={() => setTeamFilter(team)}
              className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
                teamFilter === team
                  ? 'bg-brand-primary text-brand-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {team === 'all' ? 'Všechny týmy' : team}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hledat operátora..."
            className="w-full bg-surface-container-low rounded-xl pl-10 pr-4 py-2.5 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none ghost-border-primary"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto">
          {Object.entries(skillLevels).map(([level, { label, bg, color }]) => (
            <div key={level} className="flex items-center gap-1.5">
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center font-body text-xs font-bold"
                style={{ backgroundColor: bg, color }}
              >
                {level}
              </span>
              <span className="font-body text-xs text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px_80px] bg-surface-container-low">
          <div className="px-6 py-4">
            <span className="font-body text-xs uppercase tracking-wider text-on-surface-variant">Operátor</span>
          </div>
          {productColumns.map((col) => (
            <div key={col} className="px-2 py-4 text-center">
              <span className="font-body text-xs uppercase tracking-wider text-on-surface-variant">{col}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {filteredOperators.map((op, i) => (
          <div
            key={op.id}
            className={`grid grid-cols-[1fr_80px_80px_80px_80px_80px_80px] items-center transition-colors hover:bg-surface-container-highest ${
              i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'
            }`}
          >
            <div className="px-6 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-secondary-container flex items-center justify-center">
                <span className="font-display text-xs font-bold text-brand-on-secondary">
                  {op.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <span className="font-body text-sm font-medium text-on-surface block">{op.name}</span>
                <span className="font-body text-xs text-on-surface-variant">{op.team}</span>
              </div>
            </div>
            {productColumns.map((col) => {
              const level = op.skills[col] ?? 0;
              const { label, bg, color } = skillLevels[level];
              return (
                <div key={col} className="px-2 py-3 flex justify-center">
                  <button
                    onClick={() => cycleSkill(op.id, col)}
                    className="w-12 h-10 rounded-xl flex items-center justify-center font-body text-xs font-bold transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: bg, color }}
                    title={`${op.name} — ${col}: ${label} (klikněte pro změnu)`}
                  >
                    {level}
                  </button>
                </div>
              );
            })}
          </div>
        ))}

        {filteredOperators.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-body text-sm text-on-surface-variant">Žádní operátoři nebyli nalezeni.</p>
          </div>
        )}
      </div>

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 w-[420px] animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-on-surface mb-6">Nový operátor</h2>

            <div className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Jméno</label>
                <input
                  value={newOp.name}
                  onChange={(e) => setNewOp({ ...newOp, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none ghost-border-primary"
                  placeholder="např. Karel Novák"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Tým</label>
                <div className="flex gap-1.5">
                  {(['KC', 'KAPU', 'Poradci'] as const).map((team) => (
                    <button
                      key={team}
                      onClick={() => setNewOp({ ...newOp, team })}
                      className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
                        newOp.team === team
                          ? 'bg-brand-primary text-brand-on-primary'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={handleAddOperator}
                className="px-5 py-2.5 bg-brand-primary text-brand-on-primary font-body text-sm font-semibold rounded-full transition-all hover:brightness-105"
              >
                Přidat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
