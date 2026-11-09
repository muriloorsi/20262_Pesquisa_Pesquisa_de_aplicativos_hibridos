# Diário de pesquisa

## Contexto do TCC

O sistema web de escalação de enfermeiros distribui a equipe de enfermagem pelas salas cirúrgicas de um hospital e já está em teste com dados reais. A prova de conceito é um cliente móvel mínimo para esse sistema (trilha **Consumo de API**, com apoio da trilha **Persistência local**).

## Pergunta de pesquisa

Como um app Expo, usando `fetch` em um hook próprio e o `@react-native-async-storage/async-storage`, mostra à enfermeira a escala do dia vinda da API do sistema de escalação **mesmo quando o centro cirúrgico está sem sinal**, inclusive depois que o app é fechado?

## Alternativas consideradas

|Opção|Serve para|Funciona no Expo Go?|Decisão|
|-|-|-|-|
|`fetch` + hook próprio (`useEscala`)|Buscar a escala na API, com tempo limite e tratamento de erro|Sim (API nativa do React Native)|**Sim** — é o núcleo da trilha e deixa explícito cada estado (online, cache, vazio)|
|`@react-native-async-storage/async-storage`|Guardar pares chave-valor pequenos, sem criptografia, que sobrevivem ao fechar o app|Sim ("Included in Expo Go" na doc do SDK)|**Sim** — a escala de um dia é um JSON pequeno; uma chave por data basta|
|`expo-sqlite`|Banco relacional local, consultas com filtro|Sim ("Included in Expo Go" na doc do SDK 58)|**Não agora** — exagero para um JSON por dia; volta a ser opção se o app precisar de histórico de várias semanas com busca|
|`@tanstack/react-query` + `createAsyncStoragePersister`|Cache de requisições pronto, com revalidação e persistência|Sim (JS puro sobre AsyncStorage)|**Não** — resolveria o problema, mas esconderia o mecanismo que a pesquisa quer entender; candidato para o app final|
|`react-native-mmkv`|Chave-valor muito rápido, com criptografia|**Não** — exige development build|**Não** — inviável no Expo Go|
|`expo-secure-store`|Segredos pequenos (tokens) com criptografia|Sim|**Não** — escala não é segredo; fica para o token de login no TCC|
|`@react-native-community/netinfo`|Saber se há conexão e reagir quando ela volta|Sim ("Included in Expo Go")|**Sim** — usado só para refazer a busca quando a rede volta|

## Fontes oficiais lidas

* Expo — @react-native-async-storage/async-storage (https://docs.expo.dev/versions/latest/sdk/async-storage)
* Expo — @react-native-community/netinfo (https://docs.expo.dev/versions/latest/sdk/netinfo)
* Expo — SQLite, SDK 58 (https://docs.expo.dev/versions/v58.0.0/sdk/sqlite)
* Expo — Store data (https://docs.expo.dev/develop/user-interface/store-data)
* Expo — Environment variables / `EXPO\\\_PUBLIC\\\_` (https://docs.expo.dev/guides/environment-variables)
* TanStack Query — createAsyncStoragePersister (https://tanstack.com/query/latest/docs/framework/react/plugins/createAsyncStoragePersister)
* Código-fonte do react-native-mmkv: erro explícito "not supported in Expo Go" (https://github.com/mrousavy/react-native-mmkv)

> Abrir cada link antes de usar na apresentação — a regra do trabalho é que só entra o que a página confirma.

## Como funciona (para o diagrama do bloco 3)

1. App abre → `useEscala(data)` chama a API com tempo limite de 5 s (`AbortController`).
2. Resposta OK **e** formato válido → grava `{ salvoEm, escala }` na chave `escala:AAAA-MM-DD` e mostra (faixa verde).
3. Falhou (sem rede, timeout, status ≠ 200, JSON inválido) → lê a chave do dia no AsyncStorage → mostra a cópia e a hora em que foi salva (faixa laranja). Sem cópia → faixa vermelha.
4. Dado inválido **nunca** sobrescreve o cache: a validação acontece antes do `setItem`.
5. NetInfo avisa quando a rede volta → busca de novo sozinho.

## Onde a IA errou

### Erro 1 — tipo errado em `ListEmptyComponent` (Claude)

* Pedido: gerar a tela `App.tsx` com a `FlatList` da escala.
* O que veio: `ListEmptyComponent={carregando ? null : <Text …/>}`.
* Como percebi: `npx tsc --noEmit` falhou — o tipo da prop aceita elemento, componente ou `undefined`, mas não `null`.
* O certo: usar `undefined` no lugar de `null`.

### Erro 2 — efeito colateral dentro do atualizador de estado (Claude)

* Pedido: refazer a busca quando a conexão voltar.
* O que veio: a chamada `atualizar()` dentro de `setOnline((anterior) => …)`.
* Como percebi: revisão do diff — a documentação do React diz que funções atualizadoras devem ser puras (no StrictMode elas rodam duas vezes, o que dispararia duas buscas).
* O certo: guardar o último estado da rede num `useRef` e chamar `atualizar()` fora do `setState`.

### Erro 3 — `SafeAreaView` do pacote `react-native` (Claude)

* Pedido: mesma tela.
* O que veio: `import { SafeAreaView } from 'react-native'`.
* Como percebi: o componente está marcado como obsoleto nas versões recentes do React Native; a doc recomenda `react-native-safe-area-context`.
* O certo: para uma PoC de uma tela, um `View` com `paddingTop` basta, sem pacote novo.

### Erro 4 — \[preencher com o que o Copilot errar no seu computador]

* Pedido:
* O que veio:
* Como percebi:
* O certo:

> Dica: pergunte a um chat sem busca "qual a melhor forma de cachear dados offline no Expo Go?" — é comum ele sugerir `react-native-mmkv`, que a doc mostra não rodar no Expo Go. Se acontecer, é um ótimo registro.

## Resultado e próximos passos no TCC

* \[preencher depois de verificar os critérios no aparelho: o que passou, o que reprovou]
* O sistema web precisa expor um endpoint `GET /escala?data=AAAA-MM-DD` com o formato de `types/escala.ts`.
* No app final, trocar o hook próprio por `@tanstack/react-query` com persistência, mantendo a mesma regra: dado inválido não sobrescreve o cache.
* Com login, o token vai para o `expo-secure-store`, não para o AsyncStorage.

