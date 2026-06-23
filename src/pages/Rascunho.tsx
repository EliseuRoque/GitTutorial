import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Edit2, Plus, Tag, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Priority } from '../types';
import { usePlanner } from '../store/plannerStore';
import { today } from '../utils/date';

const colors = ['#2563eb', '#16a34a', '#8b5cf6', '#f97316', '#dc2626', '#14b8a6', '#db2777'];
function extractTags(text: string) { return [...new Set([...text.matchAll(/#([\p{L}\d_-]+)/gu)].map(match => match[1]))].slice(0, 8); }
function suggestedSchedule(text: string) { const date = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] || today(); const time = text.match(/\b(\d{1,2}:\d{2})\s*(?:-|às|as|até|ate)\s*(\d{1,2}:\d{2})\b/i); return { date, start: time?.[1]?.padStart(5, '0') || '09:00', end: time?.[2]?.padStart(5, '0') || '10:00' }; }

export default function Rascunho() {
  const s = usePlanner();
  const [id, setId] = useState(s.drafts[0]?.id || '');
  const [selected, setSelected] = useState<string[]>([]);
  const [catName, setCatName] = useState('');
  const [modal, setModal] = useState(false);
  const current = s.drafts.find(d => d.id === id);
  const tags = useMemo(() => extractTags(`${current?.title || ''} ${current?.content || ''}`), [current?.title, current?.content]);
  const schedule = useMemo(() => suggestedSchedule(`${current?.title || ''} ${current?.content || ''}`), [current?.title, current?.content]);
  const [activity, setActivity] = useState({ title: '', date: schedule.date, start: schedule.start, end: schedule.end, categoryId: s.categories[0]?.id || '', priority: 'Média' as Priority, removeDraft: true });

  useEffect(() => { if (!id && s.drafts[0]) setId(s.drafts[0].id); }, [s.drafts, id]);
  useEffect(() => { if (current) setActivity(a => ({ ...a, title: current.title || current.content.split('\n')[0]?.slice(0, 60) || 'Atividade do rascunho', date: schedule.date, start: schedule.start, end: schedule.end, categoryId: selected[0] || s.categories[0]?.id || '' })); }, [current?.id, schedule.date, schedule.start, schedule.end, selected]);

  const openCopy = () => current && setModal(true);
  const saveCopy = () => {
    if (!current) return;
    s.addActivity({ title: activity.title, description: current.content, categoryId: activity.categoryId, date: activity.date, start: activity.start, end: activity.end, priority: activity.priority, important: activity.priority === 'Urgente' || activity.priority === 'Alta', completed: false });
    if (activity.removeDraft) { s.deleteDraft(current.id); setId(''); }
    setModal(false);
  };

  return <div className="grid min-h-[calc(100vh-7rem)] gap-4 xl:grid-cols-[minmax(0,70%)_minmax(280px,30%)]">
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-bold">Categorias e etiquetas</h2><div className="flex gap-2"><Input value={catName} onChange={e=>setCatName(e.target.value)} placeholder="Criar categoria"/><Button disabled={!catName.trim()} onClick={()=>{s.addCategory({name:catName,color:colors[s.categories.length%colors.length],icon:'Circle'});setCatName('')}}><Plus size={16}/> Criar</Button></div></div>
      <div className="flex flex-wrap gap-2">{s.categories.map(c => <button key={c.id} onClick={() => setSelected(x => x.includes(c.id) ? x.filter(i => i !== c.id) : [...x, c.id])} className={`rounded-full border-2 px-4 py-2 text-sm font-bold shadow-sm transition ${selected.includes(c.id) ? 'scale-105 text-white' : 'bg-background'}`} style={{ borderColor: c.color, backgroundColor: selected.includes(c.id) ? c.color : undefined }}>{c.name}</button>)}</div>
      <div className="grid gap-2 md:grid-cols-2">{s.categories.map(c => <div key={c.id} className="flex items-center gap-2 rounded-2xl border p-2"><Input type="color" className="w-14" value={c.color} onChange={e=>s.updateCategory({...c,color:e.target.value})}/><Input aria-label="Editar categoria" value={c.name} onChange={e=>s.updateCategory({...c,name:e.target.value})}/><Edit2 size={16}/><Button disabled={!c.custom} className="bg-red-600" onClick={()=>confirm('Excluir categoria?')&&s.deleteCategory(c.id)}>{c.custom?'Excluir':'Padrão'}</Button></div>)}</div>
      <div className="rounded-2xl border bg-muted/40 p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Tag size={14} /> Etiquetas do rascunho</div><div className="flex flex-wrap gap-2">{tags.length ? tags.map((tag, i) => <span key={tag} className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{backgroundColor:colors[i%colors.length]}}>{tag}</span>) : <span className="text-sm text-muted-foreground">Use #etiqueta no texto para destacar temas.</span>}</div></div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{s.drafts.map(d => <button key={d.id} onClick={() => setId(d.id)} className={`rounded-xl border p-3 text-left transition hover:border-primary ${id === d.id ? 'border-primary bg-muted shadow-sm' : ''}`}><b className="block truncate">{d.title || 'Sem título'}</b><p className="line-clamp-2 text-sm text-muted-foreground">{d.content || 'Bloco de notas vazio'}</p></button>)}</div>
    </Card>
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Digitação rápida</h2><Button aria-label="Criar rascunho" onClick={() => setId(s.addDraft({ content: '' }))}><Plus size={18} /></Button></div>
      <Input placeholder="Título opcional" value={current?.title || ''} onChange={e => current && s.updateDraft({ ...current, title: e.target.value })} />
      <Textarea className="min-h-48 flex-1 resize-y text-base" placeholder="Registre ideias rapidamente. Salvamento automático local." value={current?.content || ''} onChange={e => current && s.updateDraft({ ...current, content: e.target.value })} />
      <div className="text-sm text-muted-foreground">{current ? <p>Horário sugerido: <b>{schedule.date} · {schedule.start} - {schedule.end}</b></p> : 'Crie um rascunho para começar.'}</div>
      <div className="flex flex-wrap gap-2">{current && <Button onClick={openCopy}><CalendarPlus size={16} /> Copiar para Agenda</Button>}{current && <Button className="bg-red-600" onClick={() => confirm('Excluir rascunho?') && (s.deleteDraft(current.id), setId(''))}><Trash2 size={16} /> Excluir</Button>}</div>
    </Card>
    {modal && <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4"><Card className="w-full max-w-xl space-y-3"><h3 className="text-2xl font-bold">Copiar para Agenda</h3><Input value={activity.title} onChange={e=>setActivity({...activity,title:e.target.value})} placeholder="Título"/><div className="grid gap-2 sm:grid-cols-3"><Input type="date" value={activity.date} onChange={e=>setActivity({...activity,date:e.target.value})}/><Input type="time" value={activity.start} onChange={e=>setActivity({...activity,start:e.target.value})}/><Input type="time" value={activity.end} onChange={e=>setActivity({...activity,end:e.target.value})}/></div><div className="grid gap-2 sm:grid-cols-2"><select className="rounded-xl border bg-background p-2" value={activity.categoryId} onChange={e=>setActivity({...activity,categoryId:e.target.value})}>{s.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><select className="rounded-xl border bg-background p-2" value={activity.priority} onChange={e=>setActivity({...activity,priority:e.target.value as Priority})}>{['Baixa','Média','Alta','Urgente'].map(p=><option key={p}>{p}</option>)}</select></div><label className="flex gap-2"><input type="checkbox" checked={activity.removeDraft} onChange={e=>setActivity({...activity,removeDraft:e.target.checked})}/> Remover do rascunho após salvar</label><div className="flex gap-2"><Button disabled={!activity.title.trim()} onClick={saveCopy}>Salvar na agenda</Button><Button className="bg-slate-600" onClick={()=>setModal(false)}>Cancelar</Button></div></Card></div>}
  </div>;
}
