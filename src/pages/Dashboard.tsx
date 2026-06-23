import { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ListTodo, Timer, TrendingUp } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card } from '../components/ui/Card';
import { PwaInstallButton } from '../components/PwaInstallButton';
import { completed, pending, totals, urgent, upcoming, usePlanner } from '../store/plannerStore';
import { hoursBetween } from '../utils/date';
import { PriorityBadge, PriorityLegend } from '../utils/priority';

export default function Dashboard() {
  const s = usePlanner();
  useEffect(() => { s.runAlerts(); }, []);
  const data = totals(s.activities, s.categories).filter(item => item.hours > 0);
  const done = completed(s.activities);
  const plannedHours = s.activities.reduce((sum, a) => sum + hoursBetween(a.start, a.end), 0);
  const realizedHours = s.activities.filter(a => a.completed).reduce((sum, a) => sum + hoursBetween(a.start, a.end), 0);
  const completion = s.activities.length ? Math.round((done / s.activities.length) * 100) : 0;
  const urgentes = urgent(s.activities);
  const cards = [
    ['Total de atividades', s.activities.length, ListTodo, ''],
    ['Concluídas', done, CheckCircle2, 'text-emerald-600'],
    ['Pendentes', pending(s.activities), Clock, 'text-amber-600'],
    ['Urgentes', urgentes.length, AlertTriangle, 'text-[#DC2626]'],
    ['Horas planejadas', `${plannedHours.toFixed(1)} h`, Timer, ''],
    ['Horas realizadas', `${realizedHours.toFixed(1)} h`, CheckCircle2, 'text-emerald-600'],
    ['Taxa de conclusão', `${completion}%`, TrendingUp, 'text-primary'],
  ] as const;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-3xl font-bold">Painel</h2><p className="text-muted-foreground">Resumo local e offline do seu Planner 360.</p></div><PwaInstallButton compact /></div>
    <PriorityLegend />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([t, n, Icon, color]) => <Card key={t} className="flex items-center gap-3 border-2 shadow-sm">
        <Icon className={color} size={28} />
        <div><p className="text-sm text-muted-foreground">{t}</p><b className={`text-3xl ${color}`}>{n}</b></div>
      </Card>)}
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><h3 className="font-bold">Próximas atividades</h3>{upcoming(s.activities).map(a => <p key={a.id} className="flex flex-wrap items-center gap-2 border-b py-2 last:border-0"><span>{a.date} {a.start} — {a.end} · {a.title}</span><PriorityBadge priority={a.priority} /></p>)}{!upcoming(s.activities).length && <p className="text-muted-foreground">Nenhuma atividade pendente.</p>}</Card>
      <Card><div className="mb-2 flex items-center justify-between gap-2"><h3 className="font-bold text-[#DC2626]">Atividades Urgentes</h3><span className="rounded-full bg-[#DC2626] px-3 py-1 text-sm font-bold text-white">Urgentes: {urgentes.length}</span></div>{urgentes.map(a => <p key={a.id} className="flex items-center gap-2 border-b py-2 last:border-0"><PriorityBadge priority={a.priority} /><span>{a.date} — {a.title}</span></p>)}{!urgentes.length && <p className="text-muted-foreground">Nenhuma atividade urgente cadastrada.</p>}</Card>
    </div>
    <Card className="h-[28rem]"><h3 className="font-bold">Horas por categoria</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={data} margin={{ top: 20, right: 24, left: 0, bottom: 45 }}><XAxis dataKey="name" interval={0} angle={-18} textAnchor="end" height={70} /><YAxis /><Tooltip formatter={(v) => [`${Number(v).toFixed(1)} h`, 'Horas']} /><Legend /><Bar dataKey="hours" name="Horas planejadas" fill="#2563eb" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></Card>
  </div>;
}
