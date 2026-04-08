import { useState } from 'react';
import { skillMappings } from '../data/mockData';
import type { Skill } from '../data/mockData';

export function QueueMapping() {
  const [skills, setSkills] = useState<Skill[]>(skillMappings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', inbound: '', outbound: '', maxRetry: 3 });

  const handleRetryChange = (id: string, value: number) => {
    setSkills(skills.map(s => s.id === id ? { ...s, maxRetry: value } : s));
  };

  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const skill: Skill = {
      id: `s${Date.now()}`,
      name: newSkill.name,
      inboundQueues: newSkill.inbound.split(',').map(s => s.trim()).filter(Boolean),
      outboundQueues: newSkill.outbound.split(',').map(s => s.trim()).filter(Boolean),
      maxRetry: newSkill.maxRetry,
    };
    setSkills([...skills, skill]);
    setNewSkill({ name: '', inbound: '', outbound: '', maxRetry: 3 });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  return (
    <div className="pt-24 pb-12 px-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1">Admin Panel</p>
          <h1 className="font-display text-3xl font-bold text-on-surface">Mapování front</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Správa mapování skillů na inbound a outbound fronty</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand-primary text-brand-on-primary font-body font-semibold py-2.5 px-5 rounded-full transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Přidat skill
        </button>
      </div>

      {/* Skills Cards */}
      <div className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6 transition-colors hover:bg-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-secondary-container flex items-center justify-center">
                  <span className="font-display font-bold text-brand-on-secondary text-sm">{skill.name[0]}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">{skill.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingId(editingId === skill.id ? null : skill.id)}
                  className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors"
                >
                  <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-err-container transition-colors"
                >
                  <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Inbound Queues */}
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-2">Inbound fronty</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.inboundQueues.map((q) => (
                    <span key={q} className="px-3 py-1 rounded-full bg-brand-secondary-container text-brand-on-secondary font-body text-xs font-medium">
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outbound Queues */}
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-2">Outbound fronty</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.outboundQueues.map((q) => (
                    <span key={q} className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-body text-xs font-medium">
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Max Retry */}
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-2">Max opakování</p>
                {editingId === skill.id ? (
                  <input
                    type="number"
                    value={skill.maxRetry}
                    onChange={(e) => handleRetryChange(skill.id, parseInt(e.target.value) || 0)}
                    className="w-20 bg-surface-container-low rounded-xl px-3 py-2 font-body text-sm text-on-surface focus:outline-none ghost-border-primary"
                    min={0}
                    max={10}
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-low font-display text-lg font-bold text-on-surface">
                    {skill.maxRetry}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 w-[500px] animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold text-on-surface mb-6">Nový skill</h2>

            <div className="space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Název skillu</label>
                <input
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none ghost-border-primary"
                  placeholder="např. Retence"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Inbound fronty (oddělené čárkou)</label>
                <input
                  value={newSkill.inbound}
                  onChange={(e) => setNewSkill({ ...newSkill, inbound: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none ghost-border-primary"
                  placeholder="např. Retence-CZ, Retence-callback"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Outbound fronty (oddělené čárkou)</label>
                <input
                  value={newSkill.outbound}
                  onChange={(e) => setNewSkill({ ...newSkill, outbound: e.target.value })}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none ghost-border-primary"
                  placeholder="např. Retence-outbound"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Max opakování</label>
                <input
                  type="number"
                  value={newSkill.maxRetry}
                  onChange={(e) => setNewSkill({ ...newSkill, maxRetry: parseInt(e.target.value) || 0 })}
                  className="w-24 bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none ghost-border-primary"
                  min={0}
                  max={10}
                />
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
                onClick={handleAddSkill}
                className="px-5 py-2.5 bg-brand-primary text-brand-on-primary font-body text-sm font-semibold rounded-full transition-all hover:brightness-105"
              >
                Přidat skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
