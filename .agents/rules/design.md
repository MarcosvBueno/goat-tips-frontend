# 🎨 Goat Tips Frontend - Sistema de Design e Diretrizes Visuais

Este documento estabelece o sistema de design, os tokens visuais e as diretrizes de interface (UI/UX) para o projeto **Goat Tips Frontend**, extraídas das referências visuais oficiais (imagens do layout e paleta de propriedades). Estas diretrizes têm o propósito de garantir um ecossistema visual imersivo, consistente e focado em alta performance analítica.

## 1. Princípios Visuais da Interface
- **Estética de Alta Performance e Data-Driven:** Um visual que afasta os clichês e a "poluição" visual dos sites de apostas convencionais, transmitindo credibilidade técnica, inovação e análise calçada em IA.
- **Contraste Extremo e Foco Direto:** Utilização de tipografia imponente e cor primária vibrante para magnetizar o olhar do usuário para o que de fato interessa: acurácia, estatísticas, odds e chamadas à ação (call-to-actions).
- **Limpeza e "Respiro" (Whitespace):** Layouts bem distribuídos, margens muito generosas em blocos de texto e divisões nítidas que blindam o usuário da sobrecarga de informação, tão comum em interfaces esportivas.

---

## 2. Paleta de Cores

A paleta de design é altamente minimalista, sustentando a força da aplicação no contraste entre três propriedades cromáticas centrais.

| Nome / Função | Hexadecimal | Onde Deve Ser Aplicada |
| :--- | :--- | :--- |
| **Brand Blue (Principal)** | `#012AFE` | Call-to-actions principais (CTAs), destaques parciais e "marcação" de palavras em títulos (Headlines), textos de ênfase (ex: porcentagens e estatísticas fundamentais), faixas informativas rotativas (Marquee) e backgrounds de forte destaque interativo. |
| **Dark Charcoal (Preto de UI)**| `#202020` | Texto principal de parágrafos, logotipos versão clara, botões secundários delineados e títulos hierarquicamente menores. Garante uma legibilidade amena, removendo o "peso" agressivo que o preto absoluto (`#000000`) causa. |
| **Off-White (Fundo Padrão)**| `#F8F8F8` | Plano de fundo geral da moldura da página da aplicação (Body Background). Confere um ar clean e luxuoso, separando visualmente o plano ao fundo dos boxes informativos no nível da superfície. |
| **Pure White** | `#FFFFFF` | Somente sobre os conteineres dinâmicos (Cards e Boxes de interface que flutuam sobre o Off-White) ou como fonte de texto aplicada em caixas preenchidas com azul ou preto. |

*Diretriz de Implementação:* Tais cores devem estar refletidas nas base-layers e tokens do projeto (Tailwind v4) sob nomes semânticos (ex: `--color-primary`, `--color-background`, etc).

---

## 3. Tipografia

A identidade textual da plataforma pauta-se no antagonismo elegante e harmônico entre uma fonte "Display" pesada e uma fonte corporativa legível.

### 3.1 Fonte de Impacto e Títulos (Heading Font)
- **Família Tipográfica:** `New Amsterdam`
- **Motivação:** Trata-se de uma tipografia estreita, "chunky" (compacta) e vibrante, entregando atmosfera moderna de produtos para esports, competições e modernidade.
- **Aplicações Restritas a:** Grandes títulos (`<h1>`, `<h2>`), logótipos em texto e a numeração massiva/central da interface (métricas como `84%`, `1.8K+`, `3 APIS`).
- **Comportamento Padrão:** **Sempre utilizada em maiúsculas (ALL-CAPS)** com espessura bold (extrema), maximizando a autoridade da informação.

### 3.2 Fonte de Leitura e Componentes (Body Font)
- **Família Tipográfica:** `Noto Sans`
- **Motivação:** Uma sans-serif impecável para leituras estendidas, garantindo clareza na varredura veloz de matrizes estatísticas em monitores e telas mobile. 
- **Aplicações:** Parágrafos, legendas em cartões estatísticos, descrições dentro de cards, miúdos e formulários.
- **Comportamento Padrão:** O peso varia do Regular (`400`) para extensões de texto a Semibold (`600`) para microcópias de interface (como links de menu ou labels de pequenos botões).

---

## 4. UI Patterns e Componentes Arquiteturais

Os componentes da interface utilizam um estilo embasado por bordas arredondadas intensas e botões em formato característico.

### 4.1 Botões / Calls-To-Action
- **Primary Buttons:** Estruturados na forma completa de "Pílula" (Pill shape — `rounded-full`). Fundo preenchido com azul primário (`#012AFE`) e título interno em branco puro. 
- **Secondary Buttons (Ghost / Outlined):** Usado em ações adjacentes (como "Perguntar ao Tipster IA"). Adota o mesmo estilo "Pílula", cor de fundo branca ou do background, mas delimitado por apenas um fino contorno (outline na escala de cinzas) e tipografia em `#202020`. 

### 4.2 Cards, Boxes e Banners de Conteúdo
- Superfícies como o box de "CRIE A ODD PERFEITA" levam fundo quase sempre branco flutuando no espaço, adotando cantos bastante arredondados — `rounded-2xl` a `rounded-3xl` dependendo da escala espacial.
- Divisões semânticas nos cards devem usar bordas internas "hairline" (muito finas e muito fracas), gerando uma esteira de grids organizando o layout interno, separando a área de banner da área analítica inferior do cartão.

### 4.3 Elementos e Gráficos de Suporte (Enriquecimento Visual)
- **"Grids e Blueprints":** Atrás de caixas promocionais ou features centrais, há a inserção de delicadas texturas padronizadas no fundo (como blocos pautados de cadernos ou tramas quadriculadas semi-invisíveis).
- **Mascote da Marca (O Goat Poligonal):** A figura do bode recortado é um "super gráfico". É aplicada desproporcionalmente grande (estourando as bordas) com baixíssima opacidade (estilo marca d'água fluída) nos lados inferiores de grandes banners para reforçar exclusividade visual.
- **Marquee Dinâmico:** Utilização de cintas horizontais sólidas conectando seções limpas. Preenchidas no azul `#012AFE`, essas esteiras comportam frases de impacto repetidas de ponta a ponta com espaçamento gerado pelo símbolo oficial The Goat minimizado em cor sólida branca.

---

## 5. Notas Importantes na Implementação

- Na configuração do **Tailwind CSS v4 e Lucide/Radix (shadcn/ui)**, substitua integralmente os tokens de cor nativos destas ferramentas pelas três cores-regras definidas.
- Nas composições com textos de apoio em cards visuais e estatísticos, utilize a variação da escala de cor (tom sobre o `Off-White`) em opacidades com cinza equilibrado para guiar a visualização principal e desprivilegiar os demais textos de forma intencional (ex: o termo menor "Acurácia geral" contrastando com a proporção de um "84%" grande e azul).
