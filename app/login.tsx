import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- IMPORTS UI ---
import { CustomAlert } from "../components/ui/CustomAlert";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // --- ÉTATS RÉCUPÉRATION MOT DE PASSE ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // --- ÉTAT DE LA CUSTOM ALERT ---
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "danger" | "warning" | "success";
    onConfirm?: () => void;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  // --- ANIMATIONS ---
  const fillAnim = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: width,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(loaderOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  // --- LOGIQUE DE SÉCURITÉ ---
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .trim()
      .match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  };

  const handlePasswordRecovery = () => {
    const cleanEmail = recoveryEmail.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      setAlertConfig({
        visible: true,
        title: "FORMAT INVALIDE",
        message: "Veuillez entrer une adresse e-mail valide pour continuer.",
        type: "danger",
      });
      return;
    }

    // SÉCURITÉ : Message stylisé identique (Anti-énumération)
    setAlertConfig({
      visible: true,
      title: "DEMANDE REÇUE",
      message:
        "Si ce compte existe, un lien de réinitialisation vous sera envoyé sous peu.",
      type: "success",
      onConfirm: () => {
        setShowForgotModal(false);
        setRecoveryEmail("");
        setAlertConfig((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#010512", "#060d1f"]}
        style={StyleSheet.absoluteFillObject}
      />

      {loading ? (
        <Animated.View
          style={[styles.loaderContainer, { opacity: loaderOpacity }]}
        >
          <View style={styles.logoWrapper}>
            <Text style={[styles.logoBase, styles.logoGhost]}>PULSE.AI</Text>
            <Animated.View style={[styles.fillMask, { width: fillAnim }]}>
              <Text style={[styles.logoBase, styles.logoFill]}>PULSE.AI</Text>
            </Animated.View>
          </View>
          <Text style={styles.statusText}>
            VOS CONNAISSANCES TOUJOURS A JOUR
          </Text>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.centered, { opacity: contentOpacity }]}>
          <Image
            source={require("../assets/images/emia-welcome.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <Text style={styles.brandName}>
            PULSE<Text style={{ color: "#4ecca3" }}>.</Text>AI
          </Text>

          <View style={styles.authCard}>
            <TouchableOpacity style={styles.googleButton}>
              <FontAwesome name="google" size={18} color="#EA4335" />
              <Text style={styles.googleButtonText}>Continuer avec Google</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>SECURE ACCESS</Text>
              <View style={styles.line} />
            </View>

            <TextInput
              style={styles.input}
              placeholder="ID / Mail"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={50}
            />

            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#64748b"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={32}
            />

            <TouchableOpacity
              onPress={() => setShowForgotModal(true)}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotBtnText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => router.push("/dashboard")}
            >
              <Text style={styles.buttonText}>SE CONNECTER</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* --- MODALE DE RÉCUPÉRATION --- */}
      <Modal
        visible={showForgotModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%", alignItems: "center" }}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHeaderRow}>
                <Ionicons
                  name="mail-unread-outline"
                  size={24}
                  color="#4ecca3"
                />
                <Text style={styles.modalTitle}>RÉCUPÉRATION</Text>
              </View>

              <Text style={styles.modalSubText}>
                Entrez votre e-mail pour recevoir un lien de réinitialisation.
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="votre@email.com"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={recoveryEmail}
                onChangeText={setRecoveryEmail}
                maxLength={50}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowForgotModal(false)}
                >
                  <Text style={styles.cancelText}>ANNULER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={handlePasswordRecovery}
                >
                  <Text style={styles.sendText}>ENVOYER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- CUSTOM ALERT (STYLE PULSE) --- */}
      <CustomAlert
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#010512" },
  loaderContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoWrapper: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBase: {
    fontSize: 55,
    fontWeight: "900",
    letterSpacing: -1.5,
    position: "absolute",
  },
  logoGhost: { color: "rgba(255, 255, 255, 0.05)" },
  logoFill: { color: "#4ecca3", width: width, textAlign: "center" },
  fillMask: {
    position: "absolute",
    left: 0,
    height: 80,
    overflow: "hidden",
    justifyContent: "center",
  },
  statusText: {
    color: "#4ecca3",
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "800",
    marginTop: 30,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoImage: { width: 140, height: 140, marginBottom: 10 },
  brandName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 30,
  },
  authCard: {
    width: width > 500 ? 400 : "100%",
    padding: 25,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleButtonText: { color: "#0f172a", fontWeight: "800", fontSize: 15 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255, 255, 255, 0.05)" },
  dividerText: {
    color: "#475569",
    marginHorizontal: 15,
    fontSize: 9,
    fontWeight: "900",
  },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 20, marginTop: -4 },
  forgotBtnText: { color: "#4ecca3", fontSize: 12, fontWeight: "600" },
  mainButton: {
    backgroundColor: "#4ecca3",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#010512",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },
  modalSheet: {
    width: width > 500 ? 400 : "100%",
    backgroundColor: "#060d1f",
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  modalTitle: { color: "white", fontSize: 18, fontWeight: "900" },
  modalSubText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sendBtn: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#4ecca3",
  },
  cancelText: { color: "white", fontWeight: "700" },
  sendText: { color: "#010512", fontWeight: "900" },
});
