# Planner 360° Local

PWA mobile-first em React + TypeScript para planejamento pessoal com dashboard, agenda semanal, rascunhos arrastáveis, categorias, metas, leituras, projetos acadêmicos, relatórios e exportação CSV/XLSX.

## Privacidade e armazenamento

- Não usa Supabase, Firebase, autenticação, APIs externas, banco de dados remoto ou integrações online.
- Todos os dados são armazenados localmente no navegador.
- O estado principal é persistido no armazenamento local do navegador com Zustand Persist.
- O projeto mantém utilitários de IndexedDB (`idb`) apenas para armazenamento offline/local no próprio navegador.
- Para backup ou migração, use as exportações CSV/XLSX disponíveis na aplicação.

## Stack

- React, TypeScript, Vite e React Router.
- Zustand para estado e persistência local.
- IndexedDB local via `idb`.
- FullCalendar, dnd-kit, Recharts, Vite PWA Plugin e XLSX.
- Tailwind CSS para estilos.

## Como rodar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Funcionalidades

- Dashboard com totais por categoria, pendências, concluídas e próximos compromissos.
- Agenda semanal e mensal com criação rápida de atividades.
- Rascunhos arrastáveis para transformar ideias em atividades.
- Categorias editáveis e metas pessoais.
- Controle de leituras com acumulado e gráfico.
- Projetos acadêmicos por tipo e status.
- Relatórios com filtros, gráficos e exportação CSV/XLSX.
- Alertas locais para atividades importantes pendentes.

## Estrutura

```text
src/components   Componentes de layout e UI
src/pages        Telas principais
src/store        Estado global persistido localmente
src/services     Utilitários de armazenamento local/IndexedDB
src/utils        Datas, exportação e estilos
src/types        Tipos TypeScript
public           Ícones da PWA
```
