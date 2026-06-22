# Planner 360°

PWA mobile-first em React + TypeScript para planejamento pessoal com dashboard, agenda semanal, rascunhos arrastáveis, categorias, metas, leituras, projetos acadêmicos, relatórios, exportação CSV/XLSX, armazenamento offline em IndexedDB, Supabase Auth/SQL e integrações Google Calendar/Sheets.

## Stack

- React, TypeScript, Vite, Tailwind CSS e componentes no estilo shadcn/ui.
- React Router, Zustand, IndexedDB (`idb`), Supabase, FullCalendar, dnd-kit, Recharts, Vite PWA Plugin, Google Calendar API e Google Sheets API.

## Rodando localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Variáveis de ambiente

Crie `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

Configure no Google Cloud os escopos OAuth:

- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/spreadsheets`

## Banco Supabase

Execute `src/database/supabase.sql` no SQL Editor do Supabase. O script cria users, categories, activities, drafts, reading_logs, projects, goals, alerts, settings e calendar_sync com RLS por usuário.

## Funcionalidades

- Dashboard com horas por área, indicadores, próximas atividades e alertas de importantes atrasadas.
- CRUD de categorias com nome, cor e ícone.
- Rascunho para ideias, arquivamento e conversão em atividade.
- Agenda semanal FullCalendar de segunda a domingo, com intervalos de 15/30/60 minutos.
- Atividades com status, importância, local, observações e vínculo a projetos.
- Rotina de alerta para atividades importantes não concluídas por 7 dias, com notificação PWA.
- Semanas ilimitadas pela navegação nativa do calendário.
- Controle de leituras com páginas lidas, total acumulado, média semanal e gráfico.
- Projetos acadêmicos com tipos e status.
- Metas com barra de progresso.
- Relatórios em Recharts e exportação CSV/XLSX.
- Serviços para Google Calendar, Google Sheets, Supabase e IndexedDB.
- Tema claro/escuro persistido.

## Implantação Hostinger

1. Rode `npm install` e `npm run build`.
2. Envie o conteúdo de `dist/` para `public_html` no Hostinger File Manager ou via FTP.
3. Configure as variáveis `VITE_*` no pipeline de build. Em hospedagem estática simples, faça o build local com `.env.production` antes do upload.
4. Aponte o domínio para a pasta publicada e habilite HTTPS.
5. Para rotas SPA, configure fallback para `index.html`.
6. Teste instalação PWA no Android/iOS/Windows/Mac pelo navegador.

## Estrutura

```text
src/components   UI e layout
src/pages        telas principais
src/hooks        hooks customizados
src/services     Supabase e IndexedDB
src/store        Zustand
src/types        tipos globais
src/utils        datas, exportação e estilos
src/database     SQL Supabase
src/pwa          espaço para recursos PWA extras
src/integrations Google APIs
src/assets       assets da aplicação
```
