import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEscala } from './hooks/useEscala';
import { FaixaDeStatus } from './components/FaixaDeStatus';
import { CartaoPlantao } from './components/CartaoPlantao';

function hojeLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function App() {
  const data = hojeLocal();
  const { carregando, escala, salvoEm, origem, erro, online, atualizar } = useEscala(data);

  return (
    <View style={styles.tela}>
      <StatusBar style="dark" />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Escala do centro cirúrgico</Text>
        <Text style={styles.subtitulo}>{data.split('-').reverse().join('/')}</Text>

        {carregando && !escala ? (
          <Text style={styles.aviso}>Carregando escala…</Text>
        ) : (
          <FaixaDeStatus origem={origem} online={online} salvoEm={salvoEm} erro={erro} />
        )}

        <FlatList
          data={escala?.plantoes ?? []}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => <CartaoPlantao plantao={item} />}
          refreshing={carregando}
          onRefresh={atualizar}
          ListEmptyComponent={
            carregando ? undefined : (
              <Text style={styles.aviso}>
                Nenhum plantão para mostrar. Conecte-se à rede do hospital e puxe para atualizar.
              </Text>
            )
          }
        />

        <Pressable
          style={({ pressed }) => [styles.botao, pressed && { opacity: 0.7 }]}
          onPress={atualizar}
          accessibilityRole="button"
          accessibilityLabel="Atualizar escala"
        >
          <Text style={styles.textoBotao}>Atualizar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f4f5f7' },
  conteudo: { flex: 1, padding: 16, paddingTop: 48 },
  titulo: { fontSize: 22, fontWeight: '700' },
  subtitulo: { fontSize: 15, color: '#555', marginBottom: 12 },
  aviso: { color: '#555', textAlign: 'center', marginVertical: 24 },
  botao: {
    backgroundColor: '#1d4f91',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
