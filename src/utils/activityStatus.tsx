import type { Activity } from '../types';
import { today } from './date';

export type ActivityStatusKey = 'completed' | 'onTrack' | 'dueToday' | 'overdue';

export type ActivityStatus = {
  key: ActivityStatusKey;
  label: string;
  icon: string;
  className: string;
  eventClass: string;
  badgeClassName: string;
};

const statusByKey: Record<ActivityStatusKey, ActivityStatus> = {
  completed: {
    key: 'completed',
    label: 'Concluída',
    icon: '✅',
    className: 'border-solid',
    eventClass: 'agenda-status-completed',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  onTrack: {
    key: 'onTrack',
    label: 'Dentro do prazo',
    icon: '🟢',
    className: 'border-solid',
    eventClass: 'agenda-status-on-track',
    badgeClassName: 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300',
  },
  dueToday: {
    key: 'dueToday',
    label: 'Vence hoje',
    icon: '🔵',
    className: 'border-dotted',
    eventClass: 'agenda-status-due-today',
    badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
  },
  overdue: {
    key: 'overdue',
    label: 'Atrasada/Vencida',
    icon: '🔴',
    className: 'border-dashed',
    eventClass: 'agenda-status-overdue',
    badgeClassName: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
  },
};

export const activityStatus = (activity: Activity): ActivityStatus => {
  if (activity.completed) return statusByKey.completed;

  const currentDate = today();
  if (activity.date < currentDate) return statusByKey.overdue;
  if (activity.date === currentDate) return statusByKey.dueToday;
  return statusByKey.onTrack;
};

export function ActivityStatusBadge({ activity, className = '' }: { activity: Activity; className?: string }) {
  const status = activityStatus(activity);

  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${status.badgeClassName} ${className}`}>
      {status.icon} {status.label}
    </span>
  );
}

export const activityStatusLegend = Object.values(statusByKey);
