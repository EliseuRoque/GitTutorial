import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { isOverdue, usePlanner } from '../store/plannerStore';
import { PriorityBadge, PriorityLegend, sortByPriority } from '../utils/priority';

export default function Importantes() {
  const s = usePlanner();
  const list = sortByPriority(s.activities.filter(a => a.important || a.priority === 'Alta' || a.priority === 'Urgente' || isOverdue(a)));
  return <div className="space-y-4">
    <h2 className="text-3xl font-bold">Atividades prioritárias</h2>
    <PriorityLegend />
    <div className="grid gap-3 lg:grid-cols-2">
      {list.map(a => <Card key={a.id} className={a.priority === 'Urgente' ? 'border-[#DC2626] bg-[#FEE2E2] dark:bg-red-950/30' : isOverdue(a) ? 'border-red-400 bg-red-50 dark:bg-red-950/20' : ''}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <b className="flex items-center gap-2">{(isOverdue(a) || a.priority === 'Urgente') && <AlertTriangle className="text-[#DC2626]" />}{a.title}</b>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><span>{a.date} · {a.start}-{a.end}</span><PriorityBadge priority={a.priority} /></div>
            <p>{a.description}</p>
          </div>
          <Button onClick={() => s.toggleActivity(a.id)}>{a.completed ? 'Reabrir' : 'Concluir'}</Button>
        </div>
      </Card>)}
      {!list.length && <Card>Nenhuma atividade prioritária, urgente ou crítica cadastrada.</Card>}
    </div>
  </div>;
}
