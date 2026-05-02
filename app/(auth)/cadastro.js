import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Cadastro() {
  const router = useRouter();
  const { cadastrar } = useAuth();
  const { colors } = useTheme();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState("");

  const validar = () => {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = "O nome completo é obrigatório.";
    if (!email.trim()) novosErros.email = "O e-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      novosErros.email = "E-mail inválido.";
    if (!senha) novosErros.senha = "A senha é obrigatória.";
    else if (senha.length < 6)
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    if (confirma !== senha) novosErros.confirma = "As senhas não coincidem.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleCadastro = async () => {
    setErroGeral("");
    if (!validar()) return;
    setLoading(true);
    const resultado = await cadastrar({ nome, email, senha });
    setLoading(false);
    if (!resultado.sucesso) {
      setErroGeral(resultado.mensagem);
      return;
    }
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/fiaplogo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={[styles.title, { color: colors.primary }]}>
          Criar Conta
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Preencha os dados abaixo para se cadastrar
        </Text>
        {erroGeral ? (
          <View
            style={[
              styles.erroGeralBox,
              { backgroundColor: colors.isDark ? "#2D1A1D" : "#FEE2E2" },
            ]}
          >
            <Text style={[styles.erroGeralText, { color: colors.primary }]}>
              ⚠️ {erroGeral}
            </Text>
          </View>
        ) : null}
        <Input
          label="Nome completo"
          value={nome}
          onChangeText={(v) => setNome(v)}
          placeholder="Seu nome completo"
          erro={erros.nome}
        />
        <Input
          label="E-mail"
          value={email}
          onChangeText={(v) => setEmail(v)}
          placeholder="seuemail@exemplo.com"
          keyboardType="email-address"
          erro={erros.email}
        />
        <Input
          label="Senha"
          value={senha}
          onChangeText={(v) => setSenha(v)}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          erro={erros.senha}
        />
        <Input
          label="Confirmar senha"
          value={confirma}
          onChangeText={(v) => setConfirma(v)}
          placeholder="Repita a senha"
          secureTextEntry
          erro={erros.confirma}
        />
        <Button
          title="Cadastrar"
          onPress={handleCadastro}
          loading={loading}
          style={{ marginTop: 8 }}
        />
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => router.push("/login")}
        >
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Já tem conta?{" "}
            <Text style={[styles.linkDestaque, { color: colors.primary }]}>
              Entrar
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 28 },
  logo: { width: 180, height: 56, resizeMode: "contain" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  erroGeralBox: {
    borderLeftWidth: 4,
    borderLeftColor: "#ED145B",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  erroGeralText: { fontSize: 14 },
  linkContainer: { marginTop: 20, alignItems: "center" },
  linkText: { fontSize: 14 },
  linkDestaque: { fontWeight: "bold" },
});