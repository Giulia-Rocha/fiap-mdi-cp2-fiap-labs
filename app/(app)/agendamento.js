import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ReservaContext } from "../../context/ReservaContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function Agendamento() {
  const router = useRouter();
  const { id, nome } = useLocalSearchParams();
  const { laboratorios, adicionarReserva } = useContext(ReservaContext);
  const { colors } = useTheme();
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const confirmarAgendamento = () => {
    const labCompleto = laboratorios.find((lab) => lab.id === id);
    adicionarReserva({
      ...labCompleto,
      data: dataSelecionada,
      horario: horarioSelecionado,
    });
    setSucesso(true);
    setTimeout(() => router.replace("/reservas"), 2000);
  };

  if (sucesso) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        <Text style={[styles.sucessoTitle, { color: colors.text }]}>
          Reserva Confirmada!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: colors.primary }]}>
        Agendando: {nome}
      </Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        📅 Escolha a Data
      </Text>
      <TouchableOpacity
        style={[
          styles.chip,
          dataSelecionada && { backgroundColor: colors.primary },
        ]}
        onPress={() => setDataSelecionada("Hoje")}
      >
        <Text>Hoje</Text>
      </TouchableOpacity>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        ⏰ Escolha o Horário
      </Text>
      <TouchableOpacity
        style={[
          styles.chip,
          horarioSelecionado && { backgroundColor: colors.primary },
        ]}
        onPress={() => setHorarioSelecionado("08:00 - 09:00")}
      >
        <Text>08:00 - 09:00</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonConfirm}
        onPress={confirmarAgendamento}
      >
        <Text style={styles.buttonConfirmText}>Confirmar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  chip: { padding: 10, borderRadius: 20, borderWidth: 1, marginBottom: 10 },
  buttonConfirm: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonConfirmText: { color: "#FFF", fontWeight: "bold" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  sucessoTitle: { fontSize: 24, fontWeight: "bold", marginTop: 20 },
});
