import { useEffect, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone === true;

export function PwaInstallButton({ compact = false }: { compact?: boolean }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [message, setMessage] = useState('');

  useEffect(() => {
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
      setInstalled(false);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPrompt(null);
      setMessage('Planner 360 instalado com sucesso.');
    };
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalled(true);
      setMessage('Planner 360 instalado com sucesso.');
    }
    setPrompt(null);
  };

  return <div className={compact ? 'space-y-2 text-sm' : 'rounded-2xl border bg-muted/50 p-4'}>
    <div className="flex flex-wrap items-center gap-2">
      {installed ? <CheckCircle2 className="text-emerald-600" size={20} /> : <Download className="text-primary" size={20} />}
      <b>{installed ? '✅ Aplicativo instalado' : '⬇ Aplicativo disponível para instalação'}</b>
      {prompt && !installed && <Button onClick={install}>Instalar Aplicativo</Button>}
    </div>
    {message && <p className="mt-2 text-sm font-semibold text-emerald-600">{message}</p>}
    {!prompt && !installed && <p className="mt-2 text-sm text-muted-foreground">No Chrome, Edge e Android, a instalação aparece quando o navegador disponibiliza o recurso.</p>}
  </div>;
}
