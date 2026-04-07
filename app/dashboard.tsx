import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

import { PulseCard } from "../components/features/PulseCard";
import { PulseDetailModal } from "../components/features/PulseDetailModal";
import { StatCard } from "../components/features/StatCard";
import { ThemeBubble } from "../components/features/ThemeBubble";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Dashboard() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ÉTATS
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");

  const MAX_VEILLES = 5;

  const [themes, setThemes] = useState([
    { id: "1", name: "Intelligence Artificielle", isActive: true },
    { id: "2", name: "Rendu Unreal 5", isActive: true },
    { id: "3", name: "React Native", isActive: false },
    { id: "4", name: "Motion Design", isActive: true },
  ]);

  const [pulseCards, setPulseCards] = useState([
    {
      id: "1",
      title: "Réseaux de Neurones",
      category: "IA",
      sourceName: "ArXiv",
      date: "2h",
      isFavorite: false,
      summary: ["Retropropagation"],
    },
    {
      id: "2",
      title: "Logique React",
      category: "Dev",
      sourceName: "Docs",
      date: "Hier",
      isFavorite: true,
      summary: ["Hooks"],
    },
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const addNewTheme = () => {
    if (newThemeName.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setThemes([
        ...themes,
        {
          id: Math.random().toString(),
          name: newThemeName.trim(),
          isActive: true,
        },
      ]);
      setNewThemeName("");
      setIsAddModalVisible(false);
    }
  };

  const handleDeleteCard = () => {
    if (cardToDelete) {
      setPulseCards((p) => p.filter((c) => c.id !== cardToDelete));
      setCardToDelete(null);
      setSelectedCard(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. FOND DE L'APP */}
      <LinearGradient
        colors={["#020817", "#0f172a", "#020817"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 3. CONTENU PRINCIPAL */}
      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bonjour, Alex</Text>
            <Text style={styles.statusValue}>SYSTÈME : OPTIMAL</Text>
          </View>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/profile")}
          >
            <FontAwesome5 name="user-alt" size={18} color="#4ecca3" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea}
        >
          <View style={styles.statsContainer}>
            <StatCard
              icon="brain"
              label="Cards"
              value={pulseCards.length.toString()}
              color="#4ecca3"
            />
            <StatCard
              icon="bolt"
              label="Série"
              value="57%"
              color="#fbbf24"
              isSerie
            />
          </View>

          <View style={styles.themesWrapper}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                VEILLES ACTIVES ({themes.filter((t) => t.isActive).length}/
                {MAX_VEILLES})
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditMode(!isEditMode)}
                style={[
                  styles.editButton,
                  isEditMode && styles.editButtonActive,
                ]}
              >
                <Ionicons
                  name={isEditMode ? "checkmark" : "trash-outline"}
                  size={18}
                  color={isEditMode ? "#4ecca3" : "#64748b"}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.themesGrid}>
              {themes.map((item) => (
                <ThemeBubble
                  key={item.id}
                  theme={item}
                  isEditMode={isEditMode}
                  onPress={(id) => {
                    if (isEditMode)
                      setThemes((prev) => prev.filter((t) => t.id !== id));
                    else
                      setThemes((prev) =>
                        prev.map((t) =>
                          t.id === id ? { ...t, isActive: !t.isActive } : t,
                        ),
                      );
                  }}
                />
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>DERNIÈRES ANALYSES</Text>
          <View style={styles.cardsGrid}>
            {pulseCards.map((card) => (
              <PulseCard
                key={card.id}
                card={card}
                onPress={() => setSelectedCard(card)}
                onFavorite={() => {}}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* AUTRES MODALES TECHNIQUES */}
      <PulseDetailModal
        isVisible={!!selectedCard}
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={() => {}}
        onDelete={setCardToDelete}
      />

      <Modal visible={!!cardToDelete} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Supprimer ?</Text>
            <TouchableOpacity
              style={styles.deleteActionBtn}
              onPress={handleDeleteCard}
            >
              <Text style={{ color: "white", fontWeight: "900" }}>
                Confirmer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCardToDelete(null)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ color: "#64748b" }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  mainContent: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  welcomeText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  statusValue: { color: "#4ecca3", fontSize: 10, fontWeight: "900" },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(78, 204, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollArea: { paddingHorizontal: 25, paddingBottom: 150 },
  statsContainer: { flexDirection: "row", gap: 15, marginBottom: 25 },
  themesWrapper: { marginBottom: 25 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  editButtonActive: { borderColor: "#4ecca3", borderWidth: 1 },
  themesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cardsGrid: { gap: 12 },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  textInput: { color: "#fff", padding: 18, fontSize: 16 },
  createBtn: { borderRadius: 15, overflow: "hidden" },
  createGradient: { padding: 18, alignItems: "center" },
  createBtnText: { color: "#020817", fontWeight: "900" },

  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    backgroundColor: "#0f172a",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  confirmTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
  },
  deleteActionBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
});
