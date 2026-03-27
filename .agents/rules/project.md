---
trigger: always_on
glob:
description: Visão Geral do Projeto Goat Tips Frontend e Seus Objetivos
---

# 🐐 Goat Tips Frontend - Visão Geral do Projeto

## 🎯 O Que É o Projeto
O **Goat Tips Frontend** é a interface web de uma plataforma dedicada a previsões, dicas de apostas esportivas ("tips") e estatísticas analíticas, com foco principal em partidas de futebol (ex: Premier League). Construída com o que há de mais moderno no ecossistema web, a aplicação fornece uma experiência de ponta aos usuários apaixonados por esportes e apostas baseadas em dados.

## 🚀 Objetivo
O grande objetivo da aplicação é munir apostadores, tipsters e fãs de futebol com ferramentas visuais e preditivas completas. A intenção é entregar informações valiosas (como probabilidades de vitória, **xG** (Gols Esperados), Over/Under de gols e *BTTS* - Ambas Marcam) de maneira clara, imersiva e responsiva para auxiliar em tomadas de decisão inteligentes pré-jogo e em tempo real (ao vivo).

## 🛠️ O Que o Projeto Faz (Principais Funcionalidades)
- **Simulador de Partidas (Pré-Jogo e In-Play):** Os usuários podem simular jogos ou buscar informações de partidas em andamento para calcular quem tem maiores chances de vitória. Inclui a geração de uma matriz detalhada de probabilidade de resultados e os 5 placares mais prováveis.
- **Acompanhamento Ao Vivo e Futuro:** Exibição ágil de partidas atuais e agendadas com a integração de componentes bem projetados (Dashboard visual).
- **Tipster & Analytics Dashboard:** Interfaces onde usuários avançados podem criar, verificar e seguir dicas apostas, tendo acesso a gráficos e tendências detalhadas sobre árbitros, times e condições meteorológicas.
- **Experiência Premium:** Utilização intensiva de animações fluídas (através de `Framer Motion`) e uma estética muito moderna e envolvente, entregando um nível de design digno de aplicativos mobile e plataformas de apostas de alta performance.

## 💻 Stack Tecnológica Empregada
A arquitetura de código foca em robustez e alto padrão de UI/UX, utilizando:
- **Core:** Next.js 16 (App Router), React 19, TypeScript.
- **Estilização e Componentes:** Tailwind CSS v4, componentes Radix UI via `shadcn/ui`, ícones Lucide.
- **Animações:** Framer Motion e classe utilitária `tw-animate-css`.
- **Gerenciamento de Estado e Fetching:** Zustand (estado local), TanStack React Query (para requisições e integração à API backend/Supabase).
- **Formulários e Validação:** React Hook Form e Zod.
