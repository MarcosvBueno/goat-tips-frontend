# 🐛 Central de Rastreamento de Bugs - Integração API

Este documento serve para documentar, rastrear e classificar inconsistências ou problemas estruturais identificados no retorno de dados da API consumida pelo frontend do **Goat Tips**.

## 🔴 Bugs Críticos e Inconsistências de Dados

- [ ] **[BUG-001] Retorno Vazio ou Zerado nas Probabilidades de Poisson (Odds / Probabilities)**
  - **Contexto:** Na página de *"Próximos Jogos"* (`/pre-jogo`), a barra de `Probabilidade Poisson` estava travada simulando **34%** para as três posições (Casa/Empate/Fora).
  - **Causa Raiz Externa:** O endpoint que lista os *Upcoming Matches* (`/matches/upcoming`) frequentemente falha em entregar o nó `match.probabilities` ou entrega os objetos de `odds` zerados ou ausentes, fazendo o fallback interno calcular 33/33/33 (1/0 = nulo). 
  - **Ação Necessária no Backend / API:** Garantir que todos os jogos no status `upcoming` carreguem as propriedades preditivas de Poisson e das Odds padronizadas e sem valores zerados. O frontend depende de `match.probabilities.home_win`, `draw` e `away_win` ou das odds convertíveis.

- [ ] **[ALERTA-002] Ausência de Liga/Campeonato (`match.round` ou `league_name`)**
  - **Contexto:** Frequentemente os cards de partidas estão realizando *fallback* no frontend pois o identificador da liga vem nulo e o texto cai para `"Premier League"` fixo.
  - **Ação Necessária na API:** Incluir estritamente na tipagem de [Match](file:///c:/Users/Robso/Github/goat-tips-frontend/types/api.ts#22-37) a propriedade referenciando o nome da Liga ou Campeonato (`league.name` ou `round: "EPL"`).

- [ ] **[ALERTA-003] Fallback Constante de Imagens (`image_url`) dos Times**
  - **Contexto:** Se a API deixa de entregar as extremidades das URLs de imagens dos avatares para o `home.image_url` e `away.image_url`, os cards ativam apenas os escudos brancos.
  - **Ação Necessária na API:** Assegurar que os crawlers não tragam registros com imagens quebradas ou, caso não exista na base, a API responder com um erro amigável para a listagem ou com um ícone padrão persistente.

---

## 🟡 Débitos Técnicos e Melhorias de Desempenho

- [ ] **Falta de Paginação nos Upcoming Matches:**
  - A API atual retorna todos os jogos de uma vez. O frontend precisou mockar um limite interno via `useState(10)` e acionar *Slice* array com o botão `"Ver Mais Jogos"`. Isso gera overhead no _Client_.
  - *Solução:* O backend deve injetar cursores/paginação (`/matches/upcoming?page=1&limit=10`).

- [ ] **Falta de Contexto nos Módulos de "Algorithmic Insight":**
  - Atualmente, as notas de Análise do Bento Box estão soltas ou mockadas temporariamente, pois não temos um endpoint unificado para as métricas macro-preditivas da rodada.
  - *Solução sugerida:* Retornar dados de `Trending/Market Confidence` juntamente com a rota geral de Eventos, para popular automaticamente a área de Insight de Modelos da aba `/pre-jogo`.

---
*Mantenha este documento atualizado sempre que depurar a rede ou descobrir novas fragilidades vindas do servidor (Back, Scrapers, BD Supabase).*
