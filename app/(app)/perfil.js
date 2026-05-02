import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Perfil() {
  const { usuarioLogado, atualizarPerfil } = useAuth();
  const { colors } = useTheme();

  const [nome, setNome]   = useState(usuarioLogado?.nome || '');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});
  const [sucessoMsg, setSucessoMsg] = useState('');

  const validar = () => {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = 'O nome não pode estar vazio.';
    if (senha && senha.length < 6) novosErros.senha = 'A nova senha deve ter pelo menos 6 caracteres.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleUpdate = async () => {
    setSucessoMsg('');
    if (!validar()) return;

    setLoading(true);
    const result = await atualizarPerfil({ nome, senha: senha || undefined });
    setLoading(false);

    if (result.sucesso) {
      setSucessoMsg(result.mensagem);
      setSenha('');
      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => setSucessoMsg(''), 3000);
    } else {
      setErros({ geral: result.mensagem });
    }
  };

  const temErros = Object.keys(erros).length > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>Meu Perfil</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Mantenha seus dados atualizados
        </Text>

        {sucessoMsg ? (
          <View style={[styles.sucessoBox, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.sucessoText}>✅ {sucessoMsg}</Text>
          </View>
        ) : null}

        {erros.geral ? (
          <View style={[styles.erroBox, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.erroTextGeral, { color: colors.primary }]}>⚠️ {erros.geral}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Nome"
            value={nome}
            onChangeText={(v) => {
              setNome(v);
              if (erros.nome) setErros({ ...erros, nome: '' });
            }}
            placeholder="Seu nome"
            erro={erros.nome}
          />

          <Input
            label="Nova Senha (opcional)"
            value={senha}
            onChangeText={(v) => {
              setSenha(v);
              if (erros.senha) setErros({ ...erros, senha: '' });
            }}
            placeholder="Deixe em branco para manter a atual"
            secureTextEntry
            erro={erros.senha}
          />

          <Button
            title="Salvar Alterações"
            onPress={handleUpdate}
            loading={loading}
            disabled={temErros}
            style={{ marginTop: 20 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  sucessoBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  sucessoText: {
    color: '#166534',
    fontWeight: 'bold',
  },
  erroBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ED145B',
  },
  erroTextGeral: {
    fontWeight: 'bold',
  },
});
