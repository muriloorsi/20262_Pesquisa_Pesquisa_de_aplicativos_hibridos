# Pesquisa aplicada com IA — Escala de enfermagem offline

**Aluno:** Murilo Orsi Marchezzane — RA 23.00993-4
**Disciplina:** Desenvolvimento de Aplicativos Híbridos (React Native / Expo) — IMT

Prova de conceito: app Expo que mostra a escala do dia do centro cirúrgico,
vinda da API do sistema de escalação de enfermeiros, mesmo sem sinal
(cache com AsyncStorage + detecção de rede com NetInfo).

- Diário de pesquisa: [PESQUISA.md](PESQUISA.md)
- Critérios de aceitação: [CRITERIOS.md](CRITERIOS.md)

## Como rodar
1. `npm install`
2. Copie `.env.example` para `.env` e coloque o IP do computador.
3. Terminal 1: `node mock-api/server.js`
4. Terminal 2: `npx expo start` e leia o QR Code com o Expo Go.
