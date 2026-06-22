import { AlertTriangle } from 'lucide-react';
import type { Activity, Priority } from '../types';
import { cn } from './style';

export const priorityOrder: Record<Priority, number> = {
  Urgente: 4,
  Alta: 3,
  Média: 2,
  Baixa: 1,
};

export const priorities: Priority[] = ['Urgente', 'Alta', 'Média', 'Baixa'];

export const priorityColors: Record<Priority, { main: string; soft: string; text: string; dot: string }> = {
  Urgente: { main: '#DC2626', soft: '#FEE2E2', text: '#991B1B', dot: '🔴' },
  Alta: { main: '#EA580C', soft: '#FED7AA', text: '#9A3412', dot: '🟠' },
  Média: { main: '#CA8A04', soft: '#FEF3C7', text: '#854D0E', dot: '🟡' },
  Baixa: { main: '#16A34A', soft: '#DCFCE7', text: '#166534', dot: '🟢' },
};

export const sortByPriority = (items: Activity[]) =>
  [...items].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority] || (a.date + a.start).localeCompare(b.date + b.start));

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const colors = priorityColors[priority];
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold', priority === 'Urgente' && 'shadow-sm ring-2 ring-red-600/25', className)}
      style={{ backgroundColor: colors.soft, borderColor: colors.main, color: colors.text }}
    >
      {priority === 'Urgente' && <AlertTriangle size={14} aria-hidden="true" />}
      <span aria-hidden="true">{colors.dot}</span>
      {priority}
    </span>
  );
}

export function PriorityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-background p-3 text-sm" aria-label="Legenda de prioridades">
      <span className="font-semibold">Legenda:</span>
      {priorities.map(priority => <PriorityBadge key={priority} priority={priority} />)}
    </div>
  );
}

export const urgentActivities = (activities: Activity[]) => sortByPriority(activities.filter(a => a.priority === 'Urgente' && !a.completed));
