import { useState } from 'react';
import { summaryText, zzjText, client } from '../data/mockData';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface AfterCallProps {
  onNavigate: (screen: Screen) => void;
}

function FeedbackBtns() {
  const [fb, setFb] = useState<'up' | 'down' | null>(null);
  const [showComment, setShowComment] = useState(false);
  return (
    <>
      <div className="flex gap-1">
        <button onClick={() => { setFb(fb === 'up' ? null : 'up'); setShowComment(false); }}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${fb === 'up' ? 'bg-direct-800 text-white' : 'bg-gray-25 text-gray-400 hover:bg-gray-50'}`}>
          <svg className="w-3.5 h-3.5" fill={fb === 'up' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" /></svg>
        </button>
        <button onClick={() => { const n = fb === 'down' ? null : 'down'; setFb(n); setShowComment(n === 'down'); }}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${fb === 'down' ? 'bg-err text-white' : 'bg-gray-25 text-gray-400 hover:bg-gray-50'}`}>
          <svg className="w-3.5 h-3.5" fill={fb === 'down' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" /></svg>
        </button>
      </div>
      {showComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowComment(false)}>
          <div className="bg-white rounded-2xl shadow-float p-6 w-96 animate-fade-in" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold text-direct-800 mb-3">Co bylo špatně?</p>
            <textarea placeholder="Popište problém..." className="w-full bg-gray-25 rounded-xl p-3 text-sm text-direct-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-lime-500/30" rows={3} autoFocus />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowComment(false)} className="px-4 py-2 text-sm text-gray-400">Zrušit</button>
              <button onClick={() => setShowComment(false)} className="px-4 py-2 bg-direct-800 text-white text-sm font-semibold rounded-full">Odeslat</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-25 text-gray-500 text-[11px] font-medium hover:bg-gray-50 transition-colors">
      {ok ? <><svg className="w-3 h-3 text-direct-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Zkopírováno!</>
        : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>{label || 'Kopírovat'}</>}
    </button>
  );
}

export function AfterCall({ onNavigate }: AfterCallProps) {
  const [summary, setSummary] = useState(summaryText);
  const [zzj, setZzj] = useState(zzjText);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-16 pb-6 px-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-50 text-direct-800 font-bold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Po hovoru — ACW
          </span>
          <div>
            <p className="text-sm text-direct-800"><span className="font-bold">{client.name}</span> · {client.čísloKlienta}</p>
            <p className="text-[11px] text-gray-400">Délka hovoru: 04:32</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSubmitted(true)} disabled={submitted}
            className={`flex items-center gap-2 font-bold py-2.5 px-6 rounded-full transition-all active:scale-[0.98] text-sm ${submitted ? 'bg-direct-25 text-direct-600' : 'bg-direct-800 text-white hover:bg-direct-700'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {submitted ? 'Odesláno' : 'Schválit a odeslat'}
          </button>
          <button onClick={() => onNavigate('before')}
            className="flex items-center gap-2 bg-lime-500 text-direct-800 font-bold py-2.5 px-6 rounded-full transition-all hover:bg-lime-400 active:scale-[0.98] text-sm">
            Další hovor
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Two editors */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h3 className="text-sm font-bold text-blue-900">Souhrn hovoru</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-semibold">AI</span>
            </div>
            <div className="flex items-center gap-2"><CopyBtn text={summary} /><FeedbackBtns /></div>
          </div>
          <div className="p-5">
            <textarea value={summary} onChange={e => setSummary(e.target.value)}
              className="w-full bg-gray-25 rounded-xl p-4 text-sm text-direct-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-lime-500/30 min-h-[180px]" />
            <p className="text-[10px] text-gray-400 mt-2">Interní souhrn — upravte před odesláním</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-3 bg-direct-25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-direct-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              <h3 className="text-sm font-bold text-direct-800">Záznam z jednání (ZZJ)</h3>
              <span className="px-2 py-0.5 rounded-full bg-direct-50 text-direct-600 text-[10px] font-semibold">AI</span>
            </div>
            <div className="flex items-center gap-2"><CopyBtn text={zzj} /><FeedbackBtns /></div>
          </div>
          <div className="p-5">
            <textarea value={zzj} onChange={e => setZzj(e.target.value)}
              className="w-full bg-gray-25 rounded-xl p-4 text-sm text-direct-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-lime-500/30 min-h-[180px]" />
            <p className="text-[10px] text-gray-400 mt-2">Zapíše se do IPEX — zkontrolujte údaje</p>
          </div>
        </div>
      </div>

      {/* ACW indicator */}
      <div className="bg-white rounded-xl shadow-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-lime-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-direct-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-direct-800">Auto ACW</p>
            <p className="text-[11px] text-gray-400">Automatické zpracování při nedovolání</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {[['Status zapsán do IPEX', true], ['Opakování: pokus 2/3', false], ['Stav operátora obnoven', true]].map(([label, ok]) => (
            <div key={label as string} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${ok ? 'bg-direct-500' : 'bg-warn'}`} />
              <span className="text-[11px] text-gray-600">{label as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
