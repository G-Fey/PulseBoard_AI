import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const fillAnim = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Remplissage de la barre (3 secondes)
    Animated.timing(fillAnim, {
      toValue: width,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      // 2. Une fois fini, on fait disparaître le loader
      Animated.timing(loaderOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // 3. ICI : On change l'état pour afficher le contenu
        setLoading(false);
      });
    });
  }, []);

  // 4. Dès que loading passe à false, on lance le fondu d'entrée
  useEffect(() => {
    if (!loading) {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

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
            />
            <TextInput
              style={styles.input}
              placeholder="Mots de passe"
              placeholderTextColor="#64748b"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => router.push("/dashboard")}
            >
              <Text style={styles.buttonText}>SE CONNECTER</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
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
  mainButton: {
    backgroundColor: "#4ecca3",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#010512",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },
});
