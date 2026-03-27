# Arquitetura do Projeto - Goat Tips Frontend

## 1. Visão Geral
Este documento descreve a arquitetura detalhada do projeto frontend "Goat Tips". Ele foi elaborado com base na análise do repositório atual e das dependências utilizadas, fornecendo diretrizes padronizadas para o desenvolvimento contínuo, manutenção e garantia de qualidade do código.

## 2. Stack Tecnológica Base
- **Framework Core:** Next.js 16.2.1 (Padrão App Router)
- **Linguagem Principal:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Componentes de UI:** Shadcn UI, Radix UI Primitives, Lucide React (ícones)
- **Animações:** Framer Motion, tw-animate-css
- **Gerenciamento de Estado Global (Client):** Zustand
- **Gerenciamento de Estado (Server/Cache):** React Query (@tanstack/react-query)
- **Formulários e Validação:** React Hook Form e Zod

## 3. Estrutura de Diretórios e Módulos
A estrutura de pastas do projeto segue um padrão modularizado e escalável por camadas de domínios e de infraestrutura de visualização:

### `/app` (Roteamento e Páginas)
A hierarquia utiliza unicamente o paradigma do **App Router**. O encapsulamento de rotas e layouts por arquivo dita o esqueleto da aplicação. Principais rotas:
- `/` (Home): Acesso principal (composto por `page.tsx` e `layout.tsx`).
- `/analytics`: Dashboards e estatísticas de performance.
- `/ao-vivo`: Acompanhamento de partidas em tempo real.
- `/partida`: Dinâmica de tela individual de partida (detalhamentos, palpites).
- `/pre-jogo`: Análise e probabilidade de eventos que ainda vão acontecer.
- `/simulador`: Ferramenta para cotações e análise preditiva.
- `/tipster`: Espaço de ranking, perfis e feeds de "Tipsters" (especialistas).

### `/components` (Apresentação e UI)
Pautado no Princípio da Responsabilidade Única, a visualização divide-se entre atômico e molecular/orquestração:
- **/ui**: Componentes de Design System atômicos instalados via CLI do Shadcn UI (Botões, Inputs, Cards, etc.) reutilizáveis por todo o sistema.
- **Pastas de Domínio (ex: `/analytics`, `/chat`, `/home`, `/live`)**: Agrupam blocos funcionais e complexos que representam o negócio de cada módulo e isolam interações ligadas especificamente a eles.

### `/services` (Camada de Requisição e Integração)
Encapsula todas as chamadas HTTP (busca e mutação). Previne que componentes React sofram dependência direta de detalhes da infraestrutura de APIs.
- `api.ts`: Base client axios/fetch global com interceptors caso necessite.
- `matches.ts`, `predictions.ts`, `analytics.ts`: Organização em módulos dos endpoints (APIs externas e/ou via Gateway próprio). Devem ser integrados nos componentes por intermédio das injeções do React Query.

### `/store` (Gerenciamento de Estado Local/Global do Cliente)
Arquivos regidos pelo **Zustand** que controlam estado dinâmico distribuído pelo projeto sem a perda de performance que o Context API convencional gera.
- `use-chat-store.ts`, `use-match-store.ts`: Úteis para manipular menus colapsáveis, estados de players dinâmicos do vivo, chats laterais ou preferência de usuário em interações da UI.

### Demais Diretórios Complementares
- **/hooks**: Concentra "custom hooks" puramente reativos. (ex: listeners de evento web, intersection observers, utilitários contextuais base do React).
- **/lib**: Funções de utilidade imperativas sem vínculo com React ou árvore DOM. Ex: formatação de datas, moedas, junções de classes CSS (`utils.ts`).
- **/providers**: Provedores agnósticos utilizados exclusivamente em `layout.tsx` para não converter toda árvore em "use client". Contempla provedores de tema, React Query, etc.
- **/types**: Definição base das tipagens primordiais da Aplicação para consumo do TypeScript.

## 4. Fluxos de Funcionamento e Padrões de Código

### 4.1. Fluxo de Dados (Data Fetching)
1. **Server Components Preferencialmente:** Buscar dados iniciais, configurações e listagens que beneficiam o SEO de forma Server-Side para obter o melhor "First Contentful Paint".
2. **Client Components / React Query:** Cenários dinâmicos que sofrem mutação agressiva, como **Partidas ao vivo**, painéis com *Polling*, botões interativos, se beneficiam dos Hooks do React Query (`useQuery`, `useMutation`) que consumem os arquivos de `/services`.

### 4.2. Tratamento de Formulários e Entradas
Garantir o fluxo sem degradação de performance por input, com alta segurança (client side blindado):
- Usar **Zod** para criar schemas estáticos dos dados esperados.
- Acoplar o `zodResolver` com o `useForm` (React Hook Form), que vai operar os disparos e tratamento de erros dos elementos vindos de `/components/ui/`.

### 4.3. Estilo e Design (UI/UX)
- Utilizar puramente padrões e macros do **Tailwind CSS**.
- Variáveis dinâmicas em `globals.css` definem as primárias/dark-light.
- Qualquer animação estrutural com impacto na DOM utilizará a fluidez do **Framer Motion**, garantindo interfaces "vivas" recomendadas nos requisitos estéticos originais.

## 5. Diretrizes para Assistentes Virtuais e IAs
Assistentes gerando código no projeto DEVEM respeitar:
1. **Roteamento App Router Next.js:** O Server component é a rota padrão. Não injete "use client" a menos que precise de hooks reativos.
2. **Clean UI vs Lógica:** Ao criar novas telas, não emaranhe fetches na mesma view que re-renderiza JSX complexo.
3. **Respeito aos Componentes base:** Verifique o `components/ui/[componente]` antes de criar botões e modais avulsas.
4. **Respostas em Português-BR:** Respeite as regras globais dos prompts, focando na semântica padrão.
