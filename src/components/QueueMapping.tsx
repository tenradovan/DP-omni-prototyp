import { useState } from 'react';
import { skillMappings } from '../data/mockData';
import type { Skill } from '../data/mockData';

export function QueueMapping() {
  const [skills, setSkills] = useState<Skill[]>(skillMappings);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: '', inbound: '', outbound: '', maxRetry: 3 });

  const handleAdd = () => {
    if (!newSkill.name) return;
    setSkills([...skills, {
      id: `s${Date.now()}`,
      name: newSkill.name,
      inboundQueues:  newSkill.inbound.split(',').map(s => s.trim()).filter(Boolean),
      outboundQueues: newSkill.outbound.split(',').map(s => s.trim()).filter(Boolean),
      maxRetry: newSkill.maxRetry,
    }]);
    setNewSkill({ name: '', inbound: '', outbound: '', maxRetry: 3 });
    setShowAdd(false);
  };

  return (
    <div className="pt-16 pb-8 px-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Admin Panel</p>
          <h1 className="text-3xl font-extrabold text-direct-800">Mapování front</h1>
          <p className="text-sm text-gray-500 mt-1">Správa routovacích skillů a front v kontaktním centru</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-direct-800 text-white font-semibold py-2.5 px-5 rounded-full hover:bg-direct-700 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Přidat skill
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[200px_1fr_1fr_100px_72px] bg-gray-25 px-5 py-3 border-b border-gray-50">
          <div><span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Skill</span></div>
          <div><span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Inbound fronty</span></div>
          <div><span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Outbound fronty</span></div>
          <div className="text-center"><span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Max opak.</span></div>
          <div />
        </div>

        {/* Rows */}
        {skills.map((skill, i) => (
          <div
            key={skill.id}
            className={`grid grid-cols-[200px_1fr_1fr_100px_72px] items-center px-5 py-3.5 transition-colors hover:bg-gray-25/40 ${
              i % 2 === 0 ? '' : 'bg-gray-25/20'
            } ${i !== skills.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            {/* Skill name */}
            <div className="flex items-center gap-2.5 pr-4">
              <div className="w-8 h-8 rounded-lg bg-direct-800 flex items-center justify-center shrink-0">
                <span className="font-bold text-white text-sm">{skill.name[0]}</span>
              </div>
              <span className="text-sm font-bold text-direct-800 leading-tight">{skill.name}</span>
            </div>

            {/* Inbound */}
            <div className="pr-4">
              {editingId === skill.id ? (
                <input
                  defaultValue={skill.inboundQueues.join(', ')}
                  onBlur={e => setSkills(skills.map(s => s.id === skill.id
                    ? { ...s, inboundQueues: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }
                    : s
                  ))}
                  className="w-full bg-gray-25 rounded-lg px-3 py-1.5 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {skill.inboundQueues.map(q => (
                    <span key={q} className="px-2 py-0.5 rounded-full bg-direct-25 text-direct-700 text-[11px] font-medium">{q}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Outbound */}
            <div className="pr-4">
              {editingId === skill.id ? (
                <input
                  defaultValue={skill.outboundQueues.join(', ')}
                  onBlur={e => setSkills(skills.map(s => s.id === skill.id
                    ? { ...s, outboundQueues: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }
                    : s
                  ))}
                  className="w-full bg-gray-25 rounded-lg px-3 py-1.5 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {skill.outboundQueues.map(q => (
                    <span key={q} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">{q}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Max retry */}
            <div className="flex justify-center">
              {editingId === skill.id ? (
                <input
                  type="number"
                  value={skill.maxRetry}
                  onChange={e => setSkills(skills.map(s => s.id === skill.id ? { ...s, maxRetry: parseInt(e.target.value) || 0 } : s))}
                  className="w-16 bg-gray-25 rounded-lg px-3 py-1.5 text-sm text-direct-800 text-center focus:outline-none focus:ring-2 focus:ring-lime-500/30"
                  min={0} max={10}
                />
              ) : (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-25 text-sm font-bold text-direct-800">{skill.maxRetry}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={() => setEditingId(editingId === skill.id ? null : skill.id)}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                  editingId === skill.id ? 'bg-lime-500 text-direct-800' : 'bg-gray-25 hover:bg-gray-50 text-gray-400'
                }`}
                title={editingId === skill.id ? 'Uložit' : 'Upravit'}
              >
                {editingId === skill.id
                  ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                }
              </button>
              <button
                onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}
                className="w-7 h-7 rounded-md bg-gray-25 flex items-center justify-center hover:bg-err-container transition-colors text-gray-400"
                title="Smazat"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-gray-400">Žádné skilly.</div>
        )}
      </div>

      {/* Summary footer */}
      <div className="mt-3 flex items-center gap-4 px-1">
        <span className="text-[11px] text-gray-400">{skills.length} skillů celkem</span>
        <span className="text-[11px] text-gray-400">·</span>
        <span className="text-[11px] text-gray-400">
          {skills.reduce((acc, s) => acc + s.inboundQueues.length, 0)} inbound front
        </span>
        <span className="text-[11px] text-gray-400">·</span>
        <span className="text-[11px] text-gray-400">
          {skills.reduce((acc, s) => acc + s.outboundQueues.length, 0)} outbound front
        </span>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-float p-7 w-[480px] animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-direct-800 mb-5">Nový skill</h2>
            <div className="space-y-4">
              {([
                ['Název', newSkill.name, 'name', 'Retence'],
                ['Inbound fronty', newSkill.inbound, 'inbound', 'Retence-CZ, Retence-callback'],
                ['Outbound fronty', newSkill.outbound, 'outbound', 'Retence-outbound'],
              ] as [string, string, string, string][]).map(([label, val, key, ph]) => (
                <div key={key}>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 block">{label}</label>
                  <input
                    value={val}
                    onChange={e => setNewSkill({ ...newSkill, [key]: e.target.value })}
                    className="w-full bg-gray-25 rounded-xl px-4 py-3 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
                    placeholder={ph}
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 block">Max opakování</label>
                <input
                  type="number"
                  value={newSkill.maxRetry}
                  onChange={e => setNewSkill({ ...newSkill, maxRetry: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-gray-25 rounded-xl px-4 py-3 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
                  min={0} max={10}
                />
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
