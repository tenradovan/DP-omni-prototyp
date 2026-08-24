interface NewCoreButtonProps {
  compact?: boolean;
}

export function NewCoreButton({ compact = false }: NewCoreButtonProps) {
  return (
    <a
      href="#"
      aria-label="Otevřít v NewCore"
      title="Otevřít v NewCore"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-lime-50 font-semibold text-direct-700 transition-colors hover:bg-lime-100 focus:outline-none focus:ring-2 focus:ring-direct-500/30 ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'
      }`}
    >
      <svg className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6m0 0v6m0-6L10 14M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
      </svg>
      <span className={compact ? 'hidden xl:inline' : undefined}>Otevřít v NewCore</span>
    </a>
  );
}
