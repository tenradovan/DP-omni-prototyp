import { useState } from 'react';
import { skillMappings } from '../data/mockData';
import type { Skill } from '../data/mockData';

export function QueueMapping() {
  const [skills, setSkills] = useState<Skill[]>(skillMappings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', inbound: '', outbound: '', maxRetry: 3 });

  const handleAdd = () => {
    if (!newSkill.name) return;
    setSkills([...skills, {
      id: `s${Date.now()}`, name: newSkill.name,
      inboundQueues: newSkill.inbound.split(',').map(s => s.trim()).filter(Boolean),
      outboundQueues: newSkill.outbound.split(',').map(s => s.trim()).filter(Boolean),
      maxRetry: newSkill.maxRetry,
    }]);
    setNewSkill({ name: '', inbound: '', outbound: '', maxRetry: 3 });
    setShowAdd(false);
  };

  return (
    <div className="pt-16 pb-6 px-6 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Admin Panel</p>
          <h1 className="text-3xl font-extrabold text-direct-800">Mapování front</h1>
          <p className="text-sm text-gray-500 mt-1">Správa mapování skillů na fronty</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-direct-800 text-white font-semibold py-2.5 px-5 rounded-full hover:bg-direct-700 transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Přidat skill
        </button>
      </div>

      <div className="space-y-3">
        {skills.map(skill => (
          <div key={skill.id} className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-direct-800 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">{skill.name[0]}</span>
                </div>
                <h3 className="text-lg font-bold text-direct-800">{skill.name}</h3>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditingId(editingId === skill.id ? null : skill.id)}
                  className="w-7 h-7 rounded-md bg-gray-25 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}
                  className="w-7 h-7 rounded-md bg-gray-25 flex items-center justify-center hover:bg-err-container transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Inbound</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.inboundQueues.map(q => <span key={q} className="px-2.5 py-1 rounded-full bg-direct-25 text-direct-700 text-[11px] font-medium">{q}</span>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Outbound</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.outboundQueues.map(q => <span key={q} className="px-2.5 py-1 rounded-full bg-gray-25 text-gray-600 text-[11px] font-medium">{q}</span>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-2">Max opakování</p>
                {editingId === skill.id ? (
                  <input type="number" value={skill.maxRetry} onChange={e => setSkills(skills.map(s => s.id === skill.id ? { ...s, maxRetry: parseInt(e.target.value) || 0 } : s))}
                    className="w-20 bg-gray-25 rounded-lg px-3 py-2 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30" min={0} max={10} />
                ) : (
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-25 text-lg font-bold text-direct-800">{skill.maxRetry}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-float p-7 w-[480px] animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-direct-800 mb-5">Nový skill</h2>
            <div className="space-y-4">
              {[['Název', newSkill.name, 'name', 'Retence'], ['Inbound fronty', newSkill.inbound, 'inbound', 'Retence-CZ, Retence-callback'], ['Outbound fronty', newSkill.outbound, 'outbound', 'Retence-outbound']].map(([label, val, key, ph]) => (
                <div key={key as string}>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 block">{label as string}</label>
                  <input value={val as string} onChange={e => setNewSkill({ ...newSkill, [key as string]: e.target.value })}
                    className="w-full bg-gray-25 rounded-xl px-4 py-3 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30" placeholder={ph as string} />
                </div>
              ))}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1 block">Max opakování</label>
                <input type="number" value={newSkill.maxRetry} onChange={e => setNewSkill({ ...newSkill, maxRetry: parseInt(e.target.value) || 0 })}
                  className="w-20 bg-gray-25 rounded-xl px-4 py-3 text-sm text-direct-800 focus:outline-none focus:ring-2 focus:ring-lime-500/30" min={0} max={10} />
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
