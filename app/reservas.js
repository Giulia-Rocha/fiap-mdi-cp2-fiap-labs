import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ReservaContext } from '../../context/ReservaContext';
import { useTheme } from '../../context/ThemeContext';
import LabCard from '../../components/LabCard';

export default function Reservas() {
  const router = useRouter();
  const { minhasReservas, removerReserva } = useContext(ReservaContext);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {minhasReservas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle, { color: colors.text }}>Nenhuma reserva encontrada</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.push('/labs')}><Text style={styles.buttonText}>Ver Labs</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList data={minhasReservas} renderItem={({ item }) => (
          <LabCard nome={item.nome} status="Confirmado" buttonText="Cancelar" isCancel={true} data={item.data} horario={item.horario} onPress={() => removerReserva(item.id)} />
        )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { padding: 14, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});
