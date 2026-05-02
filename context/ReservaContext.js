// ============================================================
// ReservaContext.js
// Context original do CP1 — evoluído no CP2 para:
// [CP2 - NOVO] Persistir reservas no AsyncStorage
// [CP2 - NOVO] Carregar reservas salvas ao iniciar o app
// [CP2 - NOVO] Salvar reservas ao adicionar/remover
// ============================================================

import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // [CP2 - NOVO]

export const ReservaContext = createContext();

// [CP2 - NOVO] Chave para persistência das reservas do usuário
const STORAGE_KEY_RESERVAS = '@fiaplabs:reservas';

export function ReservaProvider({ children }) {
  const [minhasReservas, setMinhasReservas] = useState([]);
  const [laboratorios, setLaboratorios]     = useState([]);
  const [loading, setLoading]               = useState(true);
  // [CP2 - NOVO] Controla se as reservas já foram carregadas do storage
  const [reservasCarregadas, setReservasCarregadas] = useState(false);

  // -------------------------------------------------------
  // Dados simulados dos laboratórios (igual CP1)
  // -------------------------------------------------------
  useEffect(() => {
    setTimeout(() => {
      setLaboratorios([
        { id: '1', nome: 'Lab Maker',      capacidade: 30, status: 'Disponível' },
        { id: '2', nome: 'Lab Mac (iOS)',   capacidade: 20, status: 'Disponível'    },
        { id: '3', nome: 'Lab Windows 1',  capacidade: 40, status: 'Disponível' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  // -------------------------------------------------------
  // [CP2 - NOVO] Carrega reservas persistidas ao montar
  // -------------------------------------------------------
  useEffect(() => {
    async function carregarReservas() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY_RESERVAS);
        if (json) {
          setMinhasReservas(JSON.parse(json));
        }
      } catch (e) {
        console.warn('Erro ao carregar reservas:', e);
      } finally {
        setReservasCarregadas(true);
      }
    }
    carregarReservas();
  }, []);

  // -------------------------------------------------------
  // [CP2 - NOVO] Persiste as reservas no AsyncStorage
  // sempre que o estado mudar (após carga inicial)
  // -------------------------------------------------------
  useEffect(() => {
    if (!reservasCarregadas) return; // aguarda a leitura antes de escrever
    async function salvarReservas() {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY_RESERVAS,
          JSON.stringify(minhasReservas)
        );
      } catch (e) {
        console.warn('Erro ao salvar reservas:', e);
      }
    }
    salvarReservas();
  }, [minhasReservas, reservasCarregadas]);

  // -------------------------------------------------------
  // Adicionar reserva
  // -------------------------------------------------------
  const adicionarReserva = (novaReserva) => {
    setLaboratorios(
      laboratorios.map((lab) =>
        lab.id === novaReserva.id
          ? { ...lab, capacidade: Math.max(0, lab.capacidade - 1) }
          : lab
      )
    );

    setMinhasReservas([...minhasReservas, { ...novaReserva, reservaId: Date.now().toString() + Math.random().toString().substring(2, 6) }]);
    return {
      sucesso: true,
      mensagem: `Sua reserva no ${novaReserva.nome} foi confirmada.`,
    };
  };

  // -------------------------------------------------------
  // Remover reserva
  // -------------------------------------------------------
  const removerReserva = (reservaId) => {
    const reserva = minhasReservas.find(r => r.reservaId === reservaId);
    if (reserva) {
      setLaboratorios(
        laboratorios.map((lab) =>
          lab.id === reserva.id ? { ...lab, capacidade: lab.capacidade + 1 } : lab
        )
      );
    }
    setMinhasReservas(minhasReservas.filter((r) => r.reservaId !== reservaId));
  };

  return (
    <ReservaContext.Provider
      value={{ minhasReservas, laboratorios, loading, adicionarReserva, removerReserva }}
    >
      {children}
    </ReservaContext.Provider>
  );
}

// Hook helper
export function useReserva() {
  return useContext(ReservaContext);
}
