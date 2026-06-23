import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { completed, pending, usePlanner } from '../store/plannerStore';
import { downloadCsv, downloadXlsx } from '../utils/export';
import { hoursBetween } from '../utils/date';

export default function Relatorios() {
  const s = usePlanner();
  const [metric, setMetric] = useState<'count' | 'hours'>('count');
  const cat = useMemo(() => s.categories.map(c => {
    const items = s.activities.filter(a => a.categoryId === c.id);
    const hours = items.reduce((sum, a) => sum + hoursBetween(a.start, a.end), 0);
    return { name: c.name, count: items.length, hours, color: c.color };
  }).filter(c => c.count || c.hours), [s.activities, s.categories]);
  const totalHours = cat.reduce((sum, item) => sum + item.hours, 0);
  const totalCount = cat.reduce((sum, item) => sum + item.count, 0);
  const byDay = useMemo(() => Object.values(s.activities.reduce<Record<string, { date: string; count: number; hours: number; doneHours: number; plannedHours: number; completion: number }>>((acc, a) => {
    const hours = hoursBetween(a.start, a.end);
    acc[a.date] ||= { date: a.date.slice(5).replace('-', '/'), count: 0, hours: 0, doneHours: 0, plannedHours: 0, completion: 0 };
    acc[a.date].count += 1; acc[a.date].hours += hours; acc[a.date].plannedHours += hours; if (a.completed) acc[a.date].doneHours += hours;
    acc[a.date].completion = acc[a.date].plannedHours ? Math.round((acc[a.date].doneHours / acc[a.date].plannedHours) * 100) : 0;
    return acc;
  }, {})).sort((a, b) => a.date.localeCompare(b.date)), [s.activities]);
  const weekly = useMemo(() => Object.values(s.activities.reduce<Record<string, { week: string; planejadas: number; realizadas: number; cumprimento: number }>>((acc, a) => {
    const d = new Date(`${a.date}T00:00`); const week = `Sem ${Math.ceil(d.getDate()/7)}/${String(d.getMonth()+1).padStart(2,'0')}`; const hours = hoursBetween(a.start, a.end);
    acc[week] ||= { week, planejadas: 0, realizadas: 0, cumprimento: 0 }; acc[week].planejadas += hours; if (a.completed) acc[week].realizadas += hours; acc[week].cumprimento = acc[week].planejadas ? Math.round((acc[week].realizadas / acc[week].planejadas) * 100) : 0; return acc;
  }, {})), [s.activities]);

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-bold">Relatórios e exportação</h2><div className="flex flex-wrap gap-2"><Button onClick={() => downloadCsv('atividades', s.activities)}>Exportar CSV</Button><Button onClick={() => downloadXlsx('planner-360', { Atividades: s.activities, Categorias: s.categories, Rascunhos: s.drafts })}>Exportar XLSX</Button></div></div>
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="h-[30rem]"><h3 className="mb-3 font-bold">Horas por categoria</h3><ResponsiveContainer width="100%" height="90%"><PieChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}><Pie data={cat} dataKey="hours" nameKey="name" innerRadius="42%" outerRadius="72%" paddingAngle={2} label={({ name, percent = 0 }) => `${name}: ${Math.round(percent * 100)}%`}>{cat.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value, name) => { const numeric = Number(value || 0); return [`${numeric.toFixed(1)} h (${totalHours ? Math.round((numeric / totalHours) * 100) : 0}%)`, String(name)]; }} /><Legend wrapperStyle={{ fontSize: 14 }} formatter={(value) => { const item = cat.find(c => c.name === value); return `${value} · ${item?.hours.toFixed(1) || 0} h · ${totalHours ? Math.round(((item?.hours || 0) / totalHours) * 100) : 0}%`; }} /></PieChart></ResponsiveContainer></Card>
      <Card className="h-[30rem]"><h3 className="mb-3 font-bold">Categorias: quantidade, percentual e horas</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={cat} margin={{ top: 24, right: 24, left: 0, bottom: 70 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" interval={0} angle={-22} textAnchor="end" height={90} /><YAxis /><Tooltip formatter={(value, key) => [key === 'hours' ? `${Number(value).toFixed(1)} h` : `${value} (${totalCount ? Math.round((Number(value)/totalCount)*100) : 0}%)`, key === 'hours' ? 'Horas acumuladas' : 'Atividades']} /><Legend /><Bar dataKey={metric} name={metric === 'hours' ? 'Horas acumuladas' : 'Quantidade de atividades'} fill="#3b82f6" radius={[8,8,0,0]}><LabelList position="top" formatter={(v:any)=> metric === 'hours' ? Number(v).toFixed(1) : v} /></Bar></BarChart></ResponsiveContainer></Card>
      <Card className="h-[28rem]"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">Gráfico semanal</h3><div className="rounded-xl border p-1"><button className={`rounded-lg px-3 py-1 text-sm font-semibold ${metric === 'count' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setMetric('count')}>Atividades</button><button className={`rounded-lg px-3 py-1 text-sm font-semibold ${metric === 'hours' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setMetric('hours')}>Horas</button></div></div><ResponsiveContainer width="100%" height="85%"><BarChart data={byDay} margin={{ top: 24, right: 24, left: 0, bottom: 45 }}><XAxis dataKey="date" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" unit="%" /><Tooltip /><Legend /><Bar yAxisId="left" dataKey="plannedHours" name="Horas planejadas" fill="#2563eb" /><Bar yAxisId="left" dataKey="doneHours" name="Horas realizadas" fill="#16a34a" /><Line yAxisId="right" type="monotone" dataKey="completion" name="% cumprimento" stroke="#f97316" /></BarChart></ResponsiveContainer></Card>
      <Card className="h-[28rem]"><h3 className="mb-3 font-bold">Gráfico mensal: evolução semanal e tendência</h3><ResponsiveContainer width="100%" height="88%"><LineChart data={weekly} margin={{ top: 24, right: 24, left: 0, bottom: 45 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis /><Tooltip formatter={(v,k)=>[k === 'cumprimento' ? `${v}%` : `${Number(v).toFixed(1)} h`, k]} /><Legend /><Line type="monotone" dataKey="planejadas" stroke="#2563eb" strokeWidth={3} /><Line type="monotone" dataKey="realizadas" stroke="#16a34a" strokeWidth={3} /><Line type="monotone" dataKey="cumprimento" stroke="#f97316" strokeWidth={3} /></LineChart></ResponsiveContainer></Card>
      <Card><h3 className="font-bold">Resumo</h3><p>Concluídas: {completed(s.activities)}</p><p>Pendentes: {pending(s.activities)}</p><p>Horas totais: {totalHours.toFixed(1)} h</p></Card>
    </div>
  </div>;
}
