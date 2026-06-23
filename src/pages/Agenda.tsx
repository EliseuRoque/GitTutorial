import { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Activity, Priority } from '../types';
import { usePlanner } from '../store/plannerStore';
import { today } from '../utils/date';
import { priorities, priorityColors, PriorityBadge, PriorityLegend, sortByPriority } from '../utils/priority';

const blank = (cat: string, date = today(), start = '09:00'): Omit<Activity, 'id' | 'updatedAt'> => ({ title: '', description: '', categoryId: cat, date, start, end: String(Number(start.slice(0, 2)) + 1).padStart(2, '0') + start.slice(2), priority: 'Média', important: false, completed: false });

function Form({ value, onSave, onCancel }: { value: Omit<Activity, 'id' | 'updatedAt'> | Activity; onSave: (a: any) => void; onCancel: () => void }) {
  const s = usePlanner();
  const [a, setA] = useState(value);
  const set = (k: keyof typeof a, v: any) => setA({ ...a, [k]: v });
  return <Card className="space-y-3">
    <h3 className="text-xl font-bold">{('id' in value) ? 'Editar atividade' : 'Nova atividade'}</h3>
    <Input required placeholder="Título" value={a.title} onChange={e => set('title', e.target.value)} />
    <Textarea className="min-h-24" placeholder="Descrição" value={a.description} onChange={e => set('description', e.target.value)} />
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><select className="rounded-xl border bg-background p-2" value={a.categoryId} onChange={e => set('categoryId', e.target.value)}>{s.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><Input type="date" value={a.date} onChange={e => set('date', e.target.value)} /><Input type="time" value={a.start} onChange={e => set('start', e.target.value)} /><Input type="time" value={a.end} onChange={e => set('end', e.target.value)} /></div>
    <div className="flex flex-wrap items-center gap-3"><select className="rounded-xl border bg-background p-2" value={a.priority} onChange={e => set('priority', e.target.value as Priority)}>{priorities.map(p => <option key={p}>{p}</option>)}</select><PriorityBadge priority={a.priority} /><label className="flex items-center gap-2"><input type="checkbox" checked={a.important} onChange={e => set('important', e.target.checked)} /> Importante</label><label className="flex items-center gap-2"><input type="checkbox" checked={a.completed} onChange={e => set('completed', e.target.checked)} /> Concluída</label></div>
    <div className="flex gap-2"><Button disabled={!a.title.trim()} onClick={() => onSave(a)}>Salvar</Button><Button className="bg-slate-600" onClick={onCancel}>Cancelar</Button></div>
  </Card>;
}

export default function Agenda() {
  const s = usePlanner();
  const [view, setView] = useState('timeGridWeek');
  const [editing, setEditing] = useState<any>();
  const events = useMemo(() => s.activities.map(a => ({ id: a.id, title: `${a.priority === 'Urgente' ? '⚠ ' : ''}${a.completed ? '✓ ' : ''}${a.start} - ${a.end} · ${a.title}`, start: `${a.date}T${a.start}`, end: `${a.date}T${a.end}`, backgroundColor: priorityColors[a.priority].main, borderColor: priorityColors[a.priority].text, extendedProps: a })), [s.activities]);
  const open = (info?: DateClickArg) => { const d = info?.date; setEditing(blank(s.categories[0]?.id || '', d?.toISOString().slice(0, 10) || today(), d?.toTimeString().slice(0, 5) || '09:00')); };
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-3xl font-bold">Agenda pessoal</h2><div className="flex flex-wrap gap-2"><select className="rounded-xl border bg-background p-2" value={view} onChange={e => setView(e.target.value)}><option value="timeGridDay">Dia</option><option value="timeGridWeek">Semana</option><option value="dayGridMonth">Mês</option></select><select className="rounded-xl border bg-background p-2" value={s.settings.slotMinutes} onChange={e => s.setSettings({ slotMinutes: Number(e.target.value) as 15 | 30 | 60 })}><option value={15}>15 min</option><option value={30}>30 min</option><option value={60}>60 min</option></select><Button onClick={() => open()}><Plus size={18} /> Nova</Button></div></div>
    <PriorityLegend />
    {editing && <Form value={editing} onCancel={() => setEditing(undefined)} onSave={(a) => { ('id' in a) ? s.updateActivity(a) : s.addActivity(a); setEditing(undefined); }} />}
    <Card className="overflow-x-auto"><div className="min-w-[720px]"><FullCalendar key={view} plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]} initialView={view} locale="pt-br" buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }} allDaySlot={false} slotDuration={`00:${s.settings.slotMinutes}:00`} height="auto" nowIndicator editable selectable eventOverlap slotEventOverlap eventMaxStack={3} dayMaxEvents dateClick={open} events={events} eventClick={i => setEditing(s.activities.find(a => a.id === i.event.id))} eventDrop={i => { const a = s.activities.find(x => x.id === i.event.id); if (a && i.event.start && i.event.end) s.updateActivity({ ...a, date: i.event.start.toISOString().slice(0, 10), start: i.event.start.toTimeString().slice(0, 5), end: i.event.end.toTimeString().slice(0, 5) }); }} /></div></Card>
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{sortByPriority(s.activities).map(a => <Card key={a.id} className={a.priority === 'Urgente' ? 'border-[#DC2626] bg-[#FEE2E2] dark:bg-red-950/30' : a.important ? 'border-red-300' : ''}><div className="flex justify-between gap-2"><b>{a.priority === 'Urgente' ? '⚠ ' : ''}{a.title}</b><input type="checkbox" checked={a.completed} onChange={() => s.toggleActivity(a.id)} /></div><div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><span>{a.date} · {a.start}-{a.end}</span><PriorityBadge priority={a.priority} /></div><div className="mt-2 flex gap-2"><Button onClick={() => setEditing(a)}>Editar</Button><Button className="bg-red-600" onClick={() => confirm('Excluir atividade?') && s.deleteActivity(a.id)}>Excluir</Button></div></Card>)}</div>
  </div>;
}
