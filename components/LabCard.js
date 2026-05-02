import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function LabCard({
  nome,
  capacidade,
  status,
  onPress,
  buttonText = "Reservar",
  isCancel = false,
  data,
  horario,
}) {
  const { colors } = useTheme();
  const isOcupado = status === "Ocupado" && !isCancel;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        isCancel && { borderLeftColor: colors.primary, borderLeftWidth: 4 },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.nome, { color: colors.text }]}>{nome}</Text>
        {isCancel ? (
          <View style={styles.infoReserva}>
            <Text style={[styles.detalhe, { color: colors.primary }]}>
              📅 {data}
            </Text>
            <Text style={[styles.detalhe, { color: colors.primary }]}>
              ⏰ {horario}
            </Text>
          </View>
        ) : (
          <Text style={[styles.capacidade, { color: colors.textSecondary }]}>
            Capacidade: {capacidade} vagas
          </Text>
        )}
        <View style={styles.footer}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isOcupado
                  ? colors.border
                  : isCancel
                    ? "#4CAF50"
                    : colors.input,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isOcupado
                    ? colors.textSecondary
                    : isCancel
                      ? "#FFF"
                      : colors.textSecondary,
                },
              ]}
            >
              ● {status}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              isCancel
                ? {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }
                : null,
              isOcupado ? { backgroundColor: colors.border } : null,
            ]}
            onPress={onPress}
            disabled={isOcupado}
          >
            <Text
              style={[styles.buttonText, isCancel && { color: colors.primary }]}
            >
              {isOcupado ? "Indisponível" : buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: { padding: 16 },
  nome: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  capacidade: { fontSize: 14, marginBottom: 12 },
  infoReserva: { marginVertical: 8 },
  detalhe: { fontSize: 14, fontWeight: "500" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: "bold" },
  button: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  buttonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});