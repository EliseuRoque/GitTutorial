import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/ui/Card';
import { completed, pending, totals, urgent, upcoming, usePlanner } from '../store/plannerStore';
import { PriorityBadge, PriorityLegend } from '../utils/priority';

export default function Dashboard() {
  const s = usePlanner();
  useEffect(() => { s.runAlerts(); }, []);
  const data = totals(s.activities, s.categories);
  const urgentes = urgent(s.activities);
  const cards = [
    ['Total', s.activities.length, ListTodo, ''],
    ['Concluídas', completed(s.activities), CheckCircle2, ''],
    ['Pendentes', pending(s.activities), Clock, ''],
    ['Urgentes', urgentes.length, AlertTriangle, 'text-[#DC2626]'],
  ] as const;

  return <div className="space-y-6">
    <h2 className="text-3xl font-bold">Painel</h2>
    <PriorityLegend />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([t, n, Icon, color]) => <Card key={t} className="flex items-center gap-3">
        <Icon className={color} />
        <div><p className="text-sm text-muted-foreground">{t}</p><b className={`text-3xl ${color}`}>{n}</b></div>
      </Card>)}
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><h3 className="font-bold">Próximas atividades</h3>{upcoming(s.activities).map(a => <p key={a.id} className="flex items-center gap-2 border-b py-2 last:border-0"><span>{a.date} {a.start} — {a.title}</span><PriorityBadge priority={a.priority} /></p>)}{!upcoming(s.activities).length && <p className="text-muted-foreground">Nenhuma atividade pendente.</p>}</Card>
      <Card><div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-bold text-[#DC2626]">Atividades Urgentes</h3><span className="rounded-full bg-[#DC2626] px-3 py-1 text-sm font-bold text-white">Urgentes: {urgentes.length}</span></div>{urgentes.map(a => <p key={a.id} className="flex items-center gap-2 border-b py-2 last:border-0"><PriorityBadge priority={a.priority} /><span>{a.date} — {a.title}</span></p>)}{!urgentes.length && <p className="text-muted-foreground">Nenhuma atividade urgente cadastrada.</p>}</Card>
    </div>
    <Card className="h-80"><h3 className="font-bold">Horas por categoria</h3><ResponsiveContainer><BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="hours" fill="#2563eb" /></BarChart></ResponsiveContainer></Card>
  </div>;
}
