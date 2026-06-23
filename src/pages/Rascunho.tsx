import { useEffect, useMemo, useState } from 'react';
import { CalendarPlus, Plus, Tag, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { usePlanner } from '../store/plannerStore';
import { today } from '../utils/date';

const tagColors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-500', 'bg-rose-600'];

function extractTags(text: string) {
  const explicit = [...text.matchAll(/#([\p{L}\d_-]+)/gu)].map(match => match[1]);
  return [...new Set(explicit)].slice(0, 5);
}

function suggestedSchedule(text: string) {
  const date = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1] || today();
  const time = text.match(/\b(\d{1,2}:\d{2})\s*(?:-|às|as|até|ate)\s*(\d{1,2}:\d{2})\b/i);
  return { date, start: time?.[1]?.padStart(5, '0') || '09:00', end: time?.[2]?.padStart(5, '0') || '10:00' };
}

export default function Rascunho() {
  const s = usePlanner();
  const [id, setId] = useState(s.drafts[0]?.id || '');
  const current = s.drafts.find(d => d.id === id);
  const tags = useMemo(() => extractTags(`${current?.title || ''} ${current?.content || ''}`), [current?.title, current?.content]);
  const schedule = useMemo(() => suggestedSchedule(`${current?.title || ''} ${current?.content || ''}`), [current?.title, current?.content]);

  useEffect(() => {
    if (!id && s.drafts[0]) setId(s.drafts[0].id);
  }, [s.drafts, id]);

  const copyToAgenda = () => {
    if (!current) return;
    s.addActivity({
      title: current.title?.trim() || current.content.split('\n')[0]?.slice(0, 60) || 'Atividade do rascunho',
      description: current.content,
      categoryId: s.categories[0]?.id || '',
      date: schedule.date,
      start: schedule.start,
      end: schedule.end,
      priority: 'Média',
      important: false,
      completed: false,
    });
  };

  return (
    <div className="grid min-h-[calc(100vh-7rem)] gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Rascunhos</h2>
          <Button aria-label="Criar rascunho" onClick={() => setId(s.addDraft({ content: '' }))}><Plus size={18} /></Button>
        </div>
        <div className="space-y-2">
          {s.drafts.map(d => (
            <button key={d.id} onClick={() => setId(d.id)} className={`w-full rounded-xl border p-3 text-left transition hover:border-primary ${id === d.id ? 'border-primary bg-muted shadow-sm' : ''}`}>
              <b className="block truncate">{d.title || 'Sem título'}</b>
              <p className="line-clamp-2 text-sm text-muted-foreground">{d.content || 'Bloco de notas vazio'}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card className="flex flex-col gap-4">
        <Input placeholder="Título opcional" value={current?.title || ''} onChange={e => current && s.updateDraft({ ...current, title: e.target.value })} />
        <div className="rounded-2xl border bg-muted/40 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Tag size={14} /> Etiquetas</div>
          <div className="flex flex-wrap gap-2">
            {tags.length ? tags.map((tag, index) => <span key={tag} className={`rounded-full px-3 py-1 text-xs font-bold text-white ${tagColors[index % tagColors.length]}`}>{tag}</span>) : <span className="text-sm text-muted-foreground">Use #etiqueta no texto para destacar temas.</span>}
            <span className="rounded-full border px-3 py-1 text-xs font-semibold text-muted-foreground">+ Adicionar</span>
          </div>
        </div>
        <Textarea className="min-h-44 flex-1 resize-y text-base lg:min-h-[42vh]" placeholder="Escreva livremente. O salvamento é automático neste navegador." value={current?.content || ''} onChange={e => current && s.updateDraft({ ...current, content: e.target.value })} />
        <div className="flex flex-wrap items-end justify-between gap-3 text-sm text-muted-foreground">
          <div><span>{current ? 'Salvo automaticamente' : 'Crie um rascunho para começar.'}</span>{current && <p>Horário sugerido: <b>{schedule.date} · {schedule.start} - {schedule.end}</b></p>}</div>
          <div className="flex gap-2">{current && <Button onClick={copyToAgenda}><CalendarPlus size={16} /> Copiar para Agenda</Button>}{current && <Button className="bg-red-600" onClick={() => confirm('Excluir rascunho?') && (s.deleteDraft(current.id), setId(''))}><Trash2 size={16} /> Excluir</Button>}</div>
        </div>
      </Card>
    </div>
  );
}
