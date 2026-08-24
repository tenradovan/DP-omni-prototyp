interface ChangeClientButtonProps {
  onClick: () => void;
  compact?: boolean;
}

export function ChangeClientButton({ onClick, compact = false }: ChangeClientButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Změnit klienta"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-direct-25 font-semibold text-direct-700 transition-colors hover:bg-direct-100 focus:outline-none focus:ring-2 focus:ring-direct-500/30 ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
      }`}
    >
      <svg className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4m-4 4h18" />
      </svg>
      <span className={compact ? 'hidden xl:inline' : undefined}>Změnit klienta</span>
    </button>
  );
}
