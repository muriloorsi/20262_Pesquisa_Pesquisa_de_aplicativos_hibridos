import { StyleSheet, Text, View } from 'react-native';
import type { Origem } from '../hooks/useEscala';

type Props = {
  origem: Origem;
  online: boolean | null;
  salvoEm: string | null;
  erro: string | null;
};

function formatarHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function FaixaDeStatus({ origem, online, salvoEm, erro }: Props) {
  const rede = online === null ? '…' : online ? 'Wi-Fi/dados: conectado' : 'Wi-Fi/dados: sem conexão';

  let titulo: string;
  let cor: string;
  if (origem === 'online') {
    titulo = 'Escala atualizada agora';
    cor = '#1f7a4d';
  } else if (origem === 'cache') {
    titulo = `Sem acesso à API — mostrando cópia salva em ${salvoEm ? formatarHora(salvoEm) : '?'}`;
    cor = '#a86100';
  } else {
    titulo = 'Sem acesso à API e nenhuma escala salva para hoje';
    cor = '#b3261e';
  }

  return (
    <View style={[styles.faixa, { backgroundColor: cor }]} accessibilityRole="summary">
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.detalhe}>{rede}</Text>
      {erro && origem !== 'online' ? <Text style={styles.detalhe}>Motivo: {erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: { padding: 12, borderRadius: 8, marginBottom: 12 },
  titulo: { color: '#fff', fontWeight: '700', fontSize: 15 },
  detalhe: { color: '#fff', fontSize: 13, marginTop: 2 },
});
