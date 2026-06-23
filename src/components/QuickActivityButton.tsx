import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePlanner } from '../store/plannerStore';
import { today } from '../utils/date';
import { Priority } from '../types';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Input';

export function QuickActivityButton() {
  const s = usePlanner();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: today(), start: '09:00', end: '10:00', categoryId: s.categories[0]?.id || '', priority: 'Média' as Priority, important: false });
  const set = (k: keyof typeof form, v: any) => setForm({ ...form, [k]: v });
  const save = () => {
    s.addActivity({ ...form, categoryId: form.categoryId || s.categories[0]?.id || '', completed: false });
    setOpen(false);
    setForm({ ...form, title: '', description: '' });
  };
  return <>
    <Button className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full px-5 py-3 shadow-2xl" onClick={() => setOpen(true)}><Plus size={20} /> Nova Atividade</Button>
    {open && <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-2xl rounded-3xl border bg-background p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="mb-4 text-2xl font-bold">Cadastro rápido</h3>
        <div className="space-y-3">
          <Input autoFocus placeholder="Título" value={form.title} onChange={e => set('title', e.target.value)} />
          <Textarea className="min-h-24" placeholder="Descrição" value={form.description} onChange={e => set('description', e.target.value)} />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} /><Input type="time" value={form.start} onChange={e => set('start', e.target.value)} /><Input type="time" value={form.end} onChange={e => set('end', e.target.value)} /><select className="rounded-xl border bg-background p-2" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>{s.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="flex flex-wrap gap-3"><select className="rounded-xl border bg-background p-2" value={form.priority} onChange={e => set('priority', e.target.value as Priority)}>{['Baixa', 'Média', 'Alta', 'Urgente'].map(p => <option key={p}>{p}</option>)}</select><label className="flex items-center gap-2"><input type="checkbox" checked={form.important} onChange={e => set('important', e.target.checked)} /> Importante</label></div>
          <div className="flex gap-2"><Button disabled={!form.title.trim()} onClick={save}>Salvar atividade</Button><Button className="bg-slate-600" onClick={() => setOpen(false)}>Cancelar</Button></div>
        </div>
      </div>
    </div>}
  </>;
}
