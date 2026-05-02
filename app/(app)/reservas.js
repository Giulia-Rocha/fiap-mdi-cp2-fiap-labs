import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ReservaContext } from '../../context/ReservaContext';
import { useTheme } from '../../context/ThemeContext';
import LabCard from '../../components/LabCard';
import { Ionicons } from "@expo/vector-icons";

export default function Reservas() {
  const router = useRouter();
  const { minhasReservas, removerReserva } = useContext(ReservaContext);
  const { colors } = useTheme();

  const handleCancelar = (item) => {
    Alert.alert(
      "Confirmar Cancelamento",
      `Deseja realmente cancelar a reserva do ${item.nome} em ${item.data} às ${item.horario}?`,
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim, Cancelar", 
          style: "destructive",
          onPress: () => removerReserva(item.reservaId) 
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botão de voltar removido conforme solicitado */}
      
      <Text style={[styles.title, { color: colors.text }]}>Minhas Reservas</Text>

      {minhasReservas.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={60} color={colors.textSecondary || '#ccc'} />
          <Text style={[styles.emptyTitle, { color: colors.text, marginTop: 10 }]}>Nenhuma reserva encontrada</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.push('/labs')}>
            <Text style={styles.buttonText}>Ver Labs Disponíveis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList 
          data={minhasReservas} 
          keyExtractor={(item) => item.reservaId}
          renderItem={({ item }) => (
            <LabCard 
              nome={item.nome} 
              status="Confirmado" 
              buttonText="Cancelar Reserva" 
              isCancel={true} 
              data={item.data} 
              horario={item.horario} 
              onPress={() => handleCancelar(item)} 
            />
          )} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, textAlign: 'center' },
  button: { padding: 14, borderRadius: 8, marginTop: 20, minWidth: 200, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});
