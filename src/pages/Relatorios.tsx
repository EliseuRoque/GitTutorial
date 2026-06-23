import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { completed, pending, totals, usePlanner } from '../store/plannerStore';
import { downloadCsv, downloadXlsx } from '../utils/export';

const palette = ['#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ef4444', '#0f766e', '#db2777'];

export default function Relatorios() {
  const s = usePlanner();
  const [metric, setMetric] = useState<'count' | 'hours'>('count');
  const cat = useMemo(() => totals(s.activities, s.categories).filter(c => c.hours > 0).map((c, index) => ({ ...c, color: c.color || palette[index % palette.length] })), [s.activities, s.categories]);
  const totalHours = cat.reduce((sum, item) => sum + item.hours, 0);
  const byDay = useMemo(() => Object.values(s.activities.reduce<Record<string, { date: string; count: number; hours: number }>>((acc, activity) => {
    const [startHour, startMinute] = activity.start.split(':').map(Number);
    const [endHour, endMinute] = activity.end.split(':').map(Number);
    const hours = Math.max(0, (endHour * 60 + endMinute - startHour * 60 - startMinute) / 60);
    acc[activity.date] ||= { date: activity.date.slice(5).replace('-', '/'), count: 0, hours: 0 };
    acc[activity.date].count += 1;
    acc[activity.date].hours += hours;
    return acc;
  }, {})).sort((a, b) => a.date.localeCompare(b.date)), [s.activities]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-bold">Relatórios e exportação</h2><div className="flex flex-wrap gap-2"><Button onClick={() => downloadCsv('atividades', s.activities)}>Exportar CSV</Button><Button onClick={() => downloadXlsx('planner-360', { Atividades: s.activities, Categorias: s.categories, Rascunhos: s.drafts })}>Exportar XLSX</Button></div></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-96"><h3 className="mb-3 font-bold">Horas por categorias</h3><ResponsiveContainer><PieChart><Pie data={cat} dataKey="hours" nameKey="name" innerRadius="45%" outerRadius="75%" label={({ percent = 0 }) => `${Math.round(percent * 100)}%`} labelLine={false}>{cat.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value, name) => { const numeric = Number(value || 0); return [`${numeric.toFixed(1)} h (${totalHours ? Math.round((numeric / totalHours) * 100) : 0}%)`, String(name)]; }} /><Legend layout="vertical" align="right" verticalAlign="middle" formatter={(value) => { const item = cat.find(c => c.name === value); return `${value}  ${item?.hours.toFixed(1) || 0} h (${totalHours ? Math.round(((item?.hours || 0) / totalHours) * 100) : 0}%)`; }} /></PieChart></ResponsiveContainer></Card>
        <Card className="h-96"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">Atividades por data</h3><div className="rounded-xl border p-1"><button className={`rounded-lg px-3 py-1 text-sm font-semibold ${metric === 'count' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setMetric('count')}>Nº de atividades</button><button className={`rounded-lg px-3 py-1 text-sm font-semibold ${metric === 'hours' ? 'bg-primary text-primary-foreground' : ''}`} onClick={() => setMetric('hours')}>Horas totais</button></div></div><ResponsiveContainer><BarChart data={byDay} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}><XAxis dataKey="date" /><YAxis allowDecimals={metric === 'hours'} /><Tooltip formatter={(value) => { const numeric = Number(value || 0); return [metric === 'hours' ? `${numeric.toFixed(1)} h` : numeric, metric === 'hours' ? 'Horas totais' : 'Nº de atividades']; }} /><Bar dataKey={metric} fill="#3b82f6" radius={[8, 8, 0, 0]}><LabelList dataKey={metric} position="top" formatter={(value) => { const numeric = Number(value || 0); return metric === 'hours' ? numeric.toFixed(1) : numeric; }} /></Bar></BarChart></ResponsiveContainer></Card>
        <Card><h3 className="font-bold">Resumo</h3><p>Concluídas: {completed(s.activities)}</p><p>Pendentes: {pending(s.activities)}</p><p>Horas totais: {totalHours.toFixed(1)} h</p></Card>
      </div>
    </div>
  );
}
