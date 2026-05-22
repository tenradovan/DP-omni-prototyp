interface InfoTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const sideClasses: Record<string, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function InfoTooltip({ content, children, side = 'top' }: InfoTooltipProps) {
  return (
    <span className="relative inline-flex group/tt">
      {children}
      <span
        role="tooltip"
        className={[
          'pointer-events-none absolute z-[9999] w-max max-w-[220px]',
          'px-2.5 py-1.5 rounded-xl',
          'bg-direct-800 text-white text-[11px] leading-snug whitespace-normal',
          'shadow-float',
          'opacity-0 invisible transition-[opacity,visibility] duration-150',
          'group-hover/tt:opacity-100 group-hover/tt:visible',
          sideClasses[side],
        ].join(' ')}
      >
        {content}
      </span>
    </span>
  );
}
