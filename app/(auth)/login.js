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

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState("");

  const validar = () => {
    const novosErros = {};
    if (!email.trim()) novosErros.email = "O e-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      novosErros.email = "Formato de e-mail inválido.";
    if (!senha) novosErros.senha = "A senha é obrigatória.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleLogin = async () => {
    setErroGeral("");
    if (!validar()) return;
    setLoading(true);
    const resultado = await login({ email, senha });
    setLoading(false);
    if (!resultado.sucesso) {
      setErroGeral(resultado.mensagem);
      return;
    }
    router.replace("/labs");
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
        <Text style={[styles.title, { color: colors.primary }]}>Entrar</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Acesse sua conta para gerenciar reservas
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
        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 8 }}
        />
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Não tem conta?{" "}
            <Text style={[styles.linkDestaque, { color: colors.primary }]}>
              Cadastre-se
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 32 },
  logo: { width: 180, height: 56, resizeMode: "contain" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 28 },
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