import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import LabCard from "../../components/LabCard";
import { ReservaContext } from "../../context/ReservaContext";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";

export default function Labs() {
  const router = useRouter();
  const { laboratorios, loading } = useContext(ReservaContext);
  const { colors } = useTheme();
  const [busca, setBusca] = useState("");

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const labsFiltrados = laboratorios.filter((lab) =>
    lab.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>
        Laboratórios no Campus
      </Text>
      <TextInput
        style={[
          styles.busca,
          {
            backgroundColor: colors.input,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="🔍 Buscar laboratório..."
        value={busca}
        onChangeText={setBusca}
      />
      <FlatList
        data={labsFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <LabCard
            nome={item.nome}
            capacidade={item.capacidade}
            status={item.status}
            onPress={() =>
              router.push({
                pathname: "/agendamento",
                params: { id: item.id, nome: item.nome },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  busca: { borderRadius: 8, padding: 10, borderWidth: 1, marginBottom: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});