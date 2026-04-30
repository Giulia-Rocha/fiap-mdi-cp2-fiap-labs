// ============================================================
// [CP2 - NOVO] AuthContext.js
// Context global de autenticação.
// Gerencia: usuário logado, login, logout e persistência de
// sessão via AsyncStorage (o usuário permanece logado ao
// reabrir o app).
// ============================================================

import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

// Chaves usadas no AsyncStorage
const STORAGE_KEY_USUARIOS = '@fiaplabs:usuarios';
const STORAGE_KEY_SESSAO   = '@fiaplabs:sessao';

export function AuthProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  // -------------------------------------------------------
  // [CP2 - NOVO] Ao montar, verifica se existe sessão salva
  // -------------------------------------------------------
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const sessaoJson = await AsyncStorage.getItem(STORAGE_KEY_SESSAO);
        if (sessaoJson) {
          setUsuarioLogado(JSON.parse(sessaoJson));
        }
      } catch (e) {
        console.warn('Erro ao restaurar sessão:', e);
      } finally {
        setCarregandoSessao(false);
      }
    }
    restaurarSessao();
  }, []);

  // -------------------------------------------------------
  // [CP2 - NOVO] Cadastro: salva novo usuário no AsyncStorage
  // -------------------------------------------------------
  const cadastrar = async ({ nome, email, senha }) => {
    try {
      const usuariosJson = await AsyncStorage.getItem(STORAGE_KEY_USUARIOS);
      const usuarios = usuariosJson ? JSON.parse(usuariosJson) : [];

      const emailJaExiste = usuarios.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailJaExiste) {
        return { sucesso: false, mensagem: 'E-mail já cadastrado.' };
      }

      const novoUsuario = { nome, email: email.toLowerCase(), senha };
      const usuariosAtualizados = [...usuarios, novoUsuario];
      await AsyncStorage.setItem(
        STORAGE_KEY_USUARIOS,
        JSON.stringify(usuariosAtualizados)
      );

      return { sucesso: true };
    } catch (e) {
      console.warn('Erro ao cadastrar:', e);
      return { sucesso: false, mensagem: 'Erro ao cadastrar. Tente novamente.' };
    }
  };

  // -------------------------------------------------------
  // [CP2 - NOVO] Login: valida credenciais e persiste sessão
  // -------------------------------------------------------
  const login = async ({ email, senha }) => {
    try {
      const usuariosJson = await AsyncStorage.getItem(STORAGE_KEY_USUARIOS);
      const usuarios = usuariosJson ? JSON.parse(usuariosJson) : [];

      const usuario = usuarios.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (!usuario) {
        return { sucesso: false, mensagem: 'E-mail ou senha incorretos.' };
      }

      // Salva sessão (sem senha por segurança)
      const sessao = { nome: usuario.nome, email: usuario.email };
      await AsyncStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(sessao));
      setUsuarioLogado(sessao);
      return { sucesso: true };
    } catch (e) {
      console.warn('Erro ao fazer login:', e);
      return { sucesso: false, mensagem: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  // -------------------------------------------------------
  // [CP2 - NOVO] Logout: limpa sessão
  // -------------------------------------------------------
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_SESSAO);
      setUsuarioLogado(null);
    } catch (e) {
      console.warn('Erro ao fazer logout:', e);
    }
  };

  // -------------------------------------------------------
  // [CP2 - NOVO] Atualizar Perfil: altera nome e senha
  // -------------------------------------------------------
  const atualizarPerfil = async ({ nome, senha }) => {
    try {
      if (!usuarioLogado?.email) return { sucesso: false, mensagem: 'Sessão expirada.' };

      const usuariosJson = await AsyncStorage.getItem(STORAGE_KEY_USUARIOS);
      let usuarios = usuariosJson ? JSON.parse(usuariosJson) : [];

      const index = usuarios.findIndex(u => u.email === usuarioLogado.email);
      if (index === -1) return { sucesso: false, mensagem: 'Usuário não encontrado.' };

      usuarios[index] = { ...usuarios[index], nome, senha };
      await AsyncStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));

      // Atualiza sessão ativa
      const novaSessao = { nome, email: usuarioLogado.email };
      await AsyncStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(novaSessao));
      setUsuarioLogado(novaSessao);

      return { sucesso: true, mensagem: 'Perfil atualizado com sucesso!' };
    } catch (e) {
      console.warn('Erro ao atualizar perfil:', e);
      return { sucesso: false, mensagem: 'Erro ao atualizar perfil.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuarioLogado, carregandoSessao, cadastrar, login, logout, atualizarPerfil }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook helper para facilitar o consumo
export function useAuth() {
  return useContext(AuthContext);
}
