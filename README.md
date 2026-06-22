# Planner 360°

PWA mobile-first em React + TypeScript para planejamento pessoal offline. Organize atividades diárias, semanais e mensais em formato de agenda profissional, com categorias, rascunhos, dashboard, relatórios e exportação local.

## Recursos

- Dashboard com total de atividades, concluídas, pendentes, importantes atrasadas, próximas atividades e gráfico de horas por categoria.
- Agenda diária, semanal e mensal com criação rápida pelo botão `+` ou clique em horários/calendário.
- Cadastro completo de atividades: título, descrição, categoria, data, horário inicial/final, prioridade, importante e concluída.
- Área dedicada para atividades prioritárias, urgentes e pendências críticas.
- Categorias padrão: Lazer, Estudo, Trabalho, Cuidar do Corpo, Cuidar da Alma e Família.
- Criação, edição, exclusão e escolha de cores para categorias personalizadas.
- Rascunhos em estilo bloco de notas, com múltiplos documentos e salvamento automático local.
- Relatórios e exportação CSV/XLSX.
- PWA instalável, com service worker e funcionamento offline.
- Layout responsivo com menu recolhível e controles adequados para toque.

## Armazenamento

Todos os dados ficam no navegador via armazenamento local/IndexedDB auxiliar. Não há autenticação, Supabase, Firebase, APIs externas ou banco online.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
