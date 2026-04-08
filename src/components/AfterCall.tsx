import { useState } from 'react';
import { summaryText, zzjText, client } from '../data/mockData';

type Screen = 'login' | 'before' | 'during' | 'after' | 'queue-mapping' | 'skill-matrix';

interface AfterCallProps {
  onNavigate: (screen: Screen) => void;
}

function FeedbackWidget({ label }: { label: string }) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [showComment, setShowComment] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { setFeedback(feedback === 'up' ? null : 'up'); setShowComment(false); }}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          feedback === 'up' ? 'bg-brand-primary text-brand-on-primary' : 'bg-surface-container-low hover:bg-surface-container'
        }`}
        title={`${label} — pozitivní`}
      >
        <span className="text-sm">👍</span>
      </button>
      <button
        onClick={() => {
          const newState = feedback === 'down' ? null : 'down';
          setFeedback(newState);
          setShowComment(newState === 'down');
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          feedback === 'down' ? 'bg-err-container text-err' : 'bg-surface-container-low hover:bg-surface-container'
        }`}
        title={`${label} — negativní`}
      >
        <span className="text-sm">👎</span>
      </button>
      {showComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowComment(false)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6 w-96 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-sm font-bold text-on-surface mb-3">Komentář k negativní zpětné vazbě</p>
            <textarea
              placeholder="Co bylo špatně? Jak by se dal výstup zlepšit?"
              className="w-full bg-surface-container-low rounded-xl p-3 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none ghost-border-primary"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setShowComment(false)}
                className="px-4 py-2 font-body text-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={() => setShowComment(false)}
                className="px-4 py-2 bg-brand-primary text-brand-on-primary font-body text-sm font-semibold rounded-full transition-all hover:brightness-105"
              >
                Odeslat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-body text-xs font-medium transition-colors hover:bg-surface-container"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Zkopírováno!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Kopírovat
        </>
      )}
    </button>
  );
}

export function AfterCall({ onNavigate }: AfterCallProps) {
  const [summary, setSummary] = useState(summaryText);
  const [zzj, setZzj] = useState(zzjText);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-24 pb-12 px-8 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-body font-semibold text-sm">
              Po hovoru — ACW
            </span>
          </div>
          <p className="font-body text-sm text-on-surface-variant">
            Klient: <span className="font-semibold text-on-surface">{client.name}</span> ({client.čísloKlienta})
          </p>
        </div>
        <button
          onClick={() => onNavigate('before')}
          className="flex items-center gap-2 bg-surface-container-low text-on-surface font-body font-medium py-2.5 px-5 rounded-full transition-colors hover:bg-surface-container"
        >
          Další hovor
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Summary Editor */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1">AI Výstup</p>
            <h3 className="font-display text-lg font-bold text-on-surface">Souhrn hovoru</h3>
          </div>
          <div className="flex items-center gap-3">
            <CopyButton textToCopy={summary} />
            <FeedbackWidget label="Souhrn" />
          </div>
        </div>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full bg-surface-container-low rounded-xl p-4 font-body text-sm text-on-surface leading-relaxed resize-none focus:outline-none ghost-border-primary min-h-[120px]"
          rows={5}
        />
      </div>

      {/* ZZJ Editor */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-body text-xs uppercase tracking-wider text-on-surface-variant mb-1">AI Výstup</p>
            <h3 className="font-display text-lg font-bold text-on-surface">Záznam z jednání (ZZJ)</h3>
          </div>
          <div className="flex items-center gap-3">
            <CopyButton textToCopy={zzj} />
            <FeedbackWidget label="ZZJ" />
          </div>
        </div>
        <textarea
          value={zzj}
          onChange={(e) => setZzj(e.target.value)}
          className="w-full bg-surface-container-low rounded-xl p-4 font-body text-sm text-on-surface leading-relaxed resize-none focus:outline-none ghost-border-primary min-h-[180px]"
          rows={8}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubmitted(true)}
            className={`flex items-center gap-2 font-body font-semibold py-3 px-6 rounded-full transition-all active:scale-[0.98] ${
              submitted
                ? 'bg-green-100 text-green-800'
                : 'bg-brand-primary text-brand-on-primary hover:brightness-105'
            }`}
          >
            {submitted ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Odesláno
              </>
            ) : (
              'Schválit a odeslat'
            )}
          </button>
          <CopyButton textToCopy={`${summary}\n\n---\n\n${zzj}`} />
        </div>
      </div>

      {/* ACW Skip Indicator */}
      <div className="mt-8 bg-surface-container-low rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-on-surface">Auto ACW indikátor</p>
            <p className="font-body text-xs text-on-surface-variant">
              Status zapsán do IPEX • Opakování naplánováno (pokus 2/3) • Stav operátora změněn zpět z ACW
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
