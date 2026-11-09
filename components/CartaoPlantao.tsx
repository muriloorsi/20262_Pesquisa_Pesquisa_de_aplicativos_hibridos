import { StyleSheet, Text, View } from 'react-native';
import type { Plantao } from '../types/escala';

const NOME_DO_TURNO = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' } as const;

export function CartaoPlantao({ plantao }: { plantao: Plantao }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.linha}>
        <Text style={styles.sala}>{plantao.sala}</Text>
        <Text style={styles.turno}>{NOME_DO_TURNO[plantao.turno]}</Text>
      </View>
      <Text style={styles.nome}>{plantao.enfermeiro}</Text>
      <Text style={styles.funcao}>{plantao.funcao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  sala: { fontWeight: '700', fontSize: 16 },
  turno: { color: '#555' },
  nome: { fontSize: 15, marginTop: 4 },
  funcao: { color: '#666', fontSize: 13 },
});
