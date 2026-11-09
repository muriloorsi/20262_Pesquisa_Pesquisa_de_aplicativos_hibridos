// API de teste da escala, sem dependências: node mock-api/server.js
// Imita o endpoint que o sistema de escalação web vai expor.
//   MODO=normal   (padrão) devolve a escala do dia
//   MODO=invalido devolve JSON fora do formato (testa o critério de erro)
//   MODO=lento    demora 10 s para responder (testa o tempo limite de 5 s)
const http = require('http');

const PORTA = Number(process.env.PORTA || 3333);
const MODO = process.env.MODO || 'normal';

function escalaDoDia(data) {
  return {
    data,
    plantoes: [
      { id: '1', sala: 'Sala 1', turno: 'manha', enfermeiro: 'Ana Souza', funcao: 'Circulante' },
      { id: '2', sala: 'Sala 1', turno: 'manha', enfermeiro: 'Bruno Lima', funcao: 'Instrumentador' },
      { id: '3', sala: 'Sala 2', turno: 'manha', enfermeiro: 'Carla Dias', funcao: 'Circulante' },
      { id: '4', sala: 'Sala 2', turno: 'tarde', enfermeiro: 'Diego Alves', funcao: 'Instrumentador' },
      { id: '5', sala: 'Sala 3', turno: 'tarde', enfermeiro: 'Elisa Rocha', funcao: 'Circulante' },
      { id: '6', sala: 'RPA', turno: 'noite', enfermeiro: 'Fábio Nunes', funcao: 'Recuperação' },
    ],
  };
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(new Date().toLocaleTimeString(), req.method, url.pathname + url.search, `(modo ${MODO})`);

    if (url.pathname !== '/escala') {
      res.writeHead(404).end();
      return;
    }
    const data = url.searchParams.get('data') || new Date().toISOString().slice(0, 10);
    const corpo = MODO === 'invalido' ? { erro: 'formato quebrado' } : escalaDoDia(data);
    const enviar = () => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(corpo));
    };
    MODO === 'lento' ? setTimeout(enviar, 10000) : enviar();
  })
  .listen(PORTA, '0.0.0.0', () => {
    console.log(`API de teste em http://0.0.0.0:${PORTA}/escala (modo ${MODO})`);
    console.log('No celular, use o IP do computador na rede local (ipconfig / ifconfig).');
  });
