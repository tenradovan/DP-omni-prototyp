import type { ClientStatus } from '../../data/mockData';

interface ClientStatusBadgeProps {
  status: ClientStatus;
  compact?: boolean;
}

function statusLabel(status: ClientStatus): { text: string; className: string } {
  if (status === 'aktivní') return { text: 'Aktivní klient', className: 'bg-lime-100 text-green-700' };
  if (status === 'bývalý') return { text: 'Bývalý klient', className: 'bg-gray-100 text-gray-500' };
  return { text: 'Neklient', className: 'bg-amber-50 text-amber-700' };
}

export function ClientStatusBadge({ status, compact = false }: ClientStatusBadgeProps) {
  const label = statusLabel(status);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center font-semibold ${label.className} ${
        compact ? 'h-5 rounded px-1.5 text-[8px]' : 'h-6 rounded-md px-2 text-[9px]'
      }`}
    >
      {label.text}
    </span>
  );
}
