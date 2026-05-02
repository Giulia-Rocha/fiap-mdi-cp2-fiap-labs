import React, { useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ReservaContext } from "../../context/ReservaContext";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Configuração do calendário para Português
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function Agendamento() {
  const router = useRouter();
  const { id, nome } = useLocalSearchParams();
  const { laboratorios, adicionarReserva, minhasReservas } = useContext(ReservaContext);
  const { colors } = useTheme();
  
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const dataFormatada = useMemo(() => {
    if (!dataSelecionada) return "";
    const [ano, mes, dia] = dataSelecionada.split('-');
    return `${dia}/${mes}/${ano}`;
  }, [dataSelecionada]);

  // Gera os horários de 1 em 1 hora (08:00 às 22:00)
  // E filtra horários que o usuário já reservou (em qualquer sala)
  const horariosDisponiveis = useMemo(() => {
    const slots = [];
    for (let i = 8; i < 22; i++) {
      const start = i < 10 ? `0${i}:00` : `${i}:00`;
      const end = (i + 1) < 10 ? `0${i + 1}:00` : `${i + 1}:00`;
      slots.push(`${start} - ${end}`);
    }

    if (dataFormatada && minhasReservas) {
      return slots.filter(slot => {
        // Se o usuário já tem reserva nesse horário no mesmo dia (qualquer sala)
        const jaReservado = minhasReservas.some(r => r.data === dataFormatada && r.horario === slot);
        return !jaReservado;
      });
    }

    return slots;
  }, [dataFormatada, minhasReservas]);

  // Função para marcar finais de semana como desativados
  const markedDates = useMemo(() => {
    const marked = {};
    const today = new Date();
    
    // Gerar marcações para os próximos 60 dias
    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo ou Sábado
        marked[dateString] = { 
          disabled: true, 
          disableTouchEvent: true, 
          textColor: '#d9e1e8' 
        };
      }
    }

    if (dataSelecionada) {
      marked[dataSelecionada] = {
        ...marked[dataSelecionada],
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  }, [dataSelecionada, colors.primary]);

  const confirmarAgendamento = () => {
    if (!dataSelecionada || !horarioSelecionado) {
      Alert.alert("Erro", "Por favor, selecione uma data e um horário.");
      return;
    }

    // --- REGRAS DE NEGÓCIO ---
    const reservasDoDia = minhasReservas.filter(r => r.data === dataFormatada);

    // 1. Não posso reservar a mesma sala no mesmo dia
    const mesmaSala = reservasDoDia.find(r => r.id === id);
    if (mesmaSala) {
      Alert.alert("Aviso", "Você já possui uma reserva para esta sala neste dia. Cancele a anterior primeiro.");
      return;
    }

    // 2. Não posso reservar duas salas no mesmo horário (já filtrado no grid, mas validamos aqui por segurança)
    const mesmoHorario = reservasDoDia.find(r => r.horario === horarioSelecionado);
    if (mesmoHorario) {
      Alert.alert("Aviso", "Você já possui um agendamento neste horário.");
      return;
    }

    // 3. Não posso reservar mais de duas salas no dia
    if (reservasDoDia.length >= 2) {
      Alert.alert("Limite Atingido", "Você só pode realizar até 2 reservas por dia.");
      return;
    }

    const labCompleto = laboratorios.find((lab) => lab.id === id);
    adicionarReserva({
      ...labCompleto,
      data: dataFormatada,
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
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>Voltar</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primary }]}>
        Agendando: {nome}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        📅 Escolha a Data
      </Text>
      
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={day => {
            setDataSelecionada(day.dateString);
            setHorarioSelecionado(""); // Reset horário ao mudar data
          }}
          markedDates={markedDates}
          minDate={new Date().toISOString().split('T')[0]}
          theme={{
            backgroundColor: colors.background,
            calendarBackground: colors.background,
            textSectionTitleColor: colors.text,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.primary,
            dayTextColor: colors.text,
            textDisabledColor: '#d9e1e8',
            monthTextColor: colors.primary,
            arrowColor: colors.primary,
          }}
        />
      </View>

      {dataSelecionada ? (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
            ⏰ Escolha o Horário
          </Text>
          {horariosDisponiveis.length > 0 ? (
            <View style={styles.horariosGrid}>
              {horariosDisponiveis.map((horario) => (
                <TouchableOpacity
                  key={horario}
                  style={[
                    styles.chip,
                    { borderColor: colors.primary },
                    horarioSelecionado === horario && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setHorarioSelecionado(horario)}
                >
                  <Text style={{ 
                    color: horarioSelecionado === horario ? '#FFF' : colors.text,
                    fontSize: 12
                  }}>
                    {horario}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ color: 'red', fontStyle: 'italic', marginBottom: 20 }}>
              Não há mais horários disponíveis para você nesta data.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.buttonConfirm, { opacity: (dataSelecionada && horarioSelecionado) ? 1 : 0.6 }]}
            onPress={confirmarAgendamento}
            disabled={!dataSelecionada || !horarioSelecionado}
          >
            <Text style={styles.buttonConfirmText}>Confirmar Reserva</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={[styles.infoText, { color: colors.text }]}>
          Selecione uma data no calendário para ver os horários.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10
  },
  horariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chip: { 
    width: '48%',
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    marginBottom: 10,
    alignItems: 'center'
  },
  infoText: { textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
  buttonConfirm: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonConfirmText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  sucessoTitle: { fontSize: 24, fontWeight: "bold", marginTop: 20 },
});
