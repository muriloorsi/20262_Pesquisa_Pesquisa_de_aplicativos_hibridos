import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ehEscalaValida, Escala, EscalaEmCache } from '../types/escala';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.10:3333';
const TEMPO_LIMITE_MS = 5000;

const chaveDoCache = (data: string) => `escala:${data}`;

/**
 * - 'online'  : a escala exibida acabou de vir da API
 * - 'cache'   : a API falhou e a escala exibida é a última salva no aparelho
 * - 'vazio'   : a API falhou e não há nada salvo para esta data
 */
export type Origem = 'online' | 'cache' | 'vazio';

type Estado = {
  carregando: boolean;
  escala: Escala | null;
  salvoEm: string | null;
  origem: Origem;
  erro: string | null;
};

const estadoInicial: Estado = {
  carregando: true,
  escala: null,
  salvoEm: null,
  origem: 'vazio',
  erro: null,
};

async function lerCache(data: string): Promise<EscalaEmCache | null> {
  try {
    const bruto = await AsyncStorage.getItem(chaveDoCache(data));
    if (!bruto) return null;
    const salvo = JSON.parse(bruto) as EscalaEmCache;
    return ehEscalaValida(salvo.escala) ? salvo : null;
  } catch {
    return null;
  }
}

async function buscarDaApi(data: string): Promise<Escala> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);
  try {
    const resposta = await fetch(`${API_URL}/escala?data=${data}`, {
      signal: controle.signal,
    });
    if (!resposta.ok) throw new Error(`A API respondeu ${resposta.status}`);
    const json: unknown = await resposta.json();
    if (!ehEscalaValida(json)) throw new Error('A API devolveu dados num formato inválido');
    return json;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Sem resposta da API em 5 s');
    }
    throw e instanceof Error ? e : new Error('Falha de rede');
  } finally {
    clearTimeout(timer);
  }
}

export function useEscala(data: string) {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const [online, setOnline] = useState<boolean | null>(null);
  const emAndamento = useRef(false);

  const atualizar = useCallback(async () => {
    if (emAndamento.current) return;
    emAndamento.current = true;
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }));

    try {
      const escala = await buscarDaApi(data);
      const registro: EscalaEmCache = { salvoEm: new Date().toISOString(), escala };
      await AsyncStorage.setItem(chaveDoCache(data), JSON.stringify(registro));
      setEstado({
        carregando: false,
        escala,
        salvoEm: registro.salvoEm,
        origem: 'online',
        erro: null,
      });
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : 'Erro desconhecido';
      const salvo = await lerCache(data);
      setEstado({
        carregando: false,
        escala: salvo?.escala ?? null,
        salvoEm: salvo?.salvoEm ?? null,
        origem: salvo ? 'cache' : 'vazio',
        erro: mensagem,
      });
    } finally {
      emAndamento.current = false;
    }
  }, [data]);

  // Primeira carga: tenta a API; se falhar, cai no cache.
  useEffect(() => {
    atualizar();
  }, [atualizar]);

  // Quando a conexão volta, busca de novo sozinho.
  const ultimoOnline = useRef<boolean | null>(null);
  useEffect(() => {
    const cancelar = NetInfo.addEventListener((rede) => {
      const conectado = rede.isConnected === true;
      if (ultimoOnline.current === false && conectado) atualizar();
      ultimoOnline.current = conectado;
      setOnline(conectado);
    });
    return cancelar;
  }, [atualizar]);

  return { ...estado, online, atualizar };
}
