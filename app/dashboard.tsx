import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PulseCard } from "../components/features/PulseCard";
import { PulseDetailModal } from "../components/features/PulseDetailModal";
import { StatCard } from "../components/features/StatCard";
import { NavBar } from "../components/ui/NavBar";

export default function Dashboard() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  const [pulseCards, setPulseCards] = useState([
    {
      id: "1",
      title: "Réseaux de Neurones",
      category: "Apprentissage IA",
      sourceName: "ArXiv",
      source: "https://arxiv.org",
      date: "Il y a 2h",
      isFavorite: false,
      summary: [
        "Concept de rétropropagation",
        "Architecture des couches cachées",
        "Optimisation via gradient",
      ],
    },
    {
      id: "2",
      title: "Logique React Native",
      category: "Développement",
      sourceName: "Docs Expo",
      source: "https://docs.expo.dev",
      date: "Hier",
      isFavorite: true,
      summary: [
        "Gestion du Virtual DOM",
        "Optimisation du rendu (Memo)",
        "Architecture des Hooks",
      ],
    },
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleFavorite = (id: string) => {
    setPulseCards((p) =>
      p.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)),
    );
    if (selectedCard?.id === id)
      setSelectedCard((p: any) => ({ ...p, isFavorite: !p.isFavorite }));
  };

  const handleShare = async (card: any) => {
    try {
      await Share.share({
        message: `Pulse Card : ${card.title}`,
        title: card.title,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = () => {
    if (cardToDelete) {
      setPulseCards((p) => p.filter((c) => c.id !== cardToDelete));
      setCardToDelete(null);
      setSelectedCard(null);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#020817", "#0f172a", "#020817"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bonjour, Alex</Text>
            <Text style={styles.statusValue}>SYSTÈME : OPTIMAL</Text>
          </View>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/")}
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
              label="Pulse Cards"
              value={pulseCards.length.toString()}
              color="#4ecca3"
            />
            <StatCard
              icon="bolt"
              label="Série (7j)"
              value="57%"
              color="#fbbf24"
              isSerie
            />
          </View>
          <Text style={styles.sectionTitle}>VEILLE EN COURS</Text>
          <View style={styles.cardsGrid}>
            {pulseCards.map((card) => (
              <PulseCard
                key={card.id}
                card={card}
                onPress={() => setSelectedCard(card)}
                onFavorite={() => toggleFavorite(card.id)}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      <PulseDetailModal
        isVisible={!!selectedCard && !cardToDelete}
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={toggleFavorite}
        onShare={handleShare}
        onDelete={(id: string) => setCardToDelete(id)}
      />
      <NavBar
        onHome={() => console.log("Home")}
        onAdd={() => console.log("Add")}
        onFavorites={() => console.log("Favs")}
      />

      <Modal visible={!!cardToDelete} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <View style={styles.warningIconCircle}>
              <MaterialCommunityIcons
                name="alert-decagram"
                size={40}
                color="#ef4444"
              />
            </View>
            <Text style={styles.confirmTitle}>Supprimer ?</Text>
            <Text style={styles.confirmText}>
              Cette action est irréversible.
            </Text>
            <View style={styles.confirmActionRow}>
              <TouchableOpacity
                style={styles.cancelActionBtn}
                onPress={() => setCardToDelete(null)}
              >
                <Text style={styles.cancelActionText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteActionBtn}
                onPress={handleDelete}
              >
                <LinearGradient
                  colors={["#ef4444", "#991b1b"]}
                  style={styles.deleteGradient}
                >
                  <Text style={styles.deleteActionText}>Supprimer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  mainContent: { flex: 1, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  welcomeText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  statusValue: {
    color: "#4ecca3",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(78, 204, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(78, 204, 163, 0.2)",
  },
  scrollArea: { paddingHorizontal: 25, paddingBottom: 140 },
  statsContainer: { flexDirection: "row", gap: 15, marginBottom: 30 },
  cardsGrid: { gap: 12 },
  sectionTitle: {
    color: "rgba(255,255,255,0.15)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 8, 23, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmBox: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#0f172a",
    borderRadius: 32,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  warningIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  confirmText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
  },
  confirmActionRow: { flexDirection: "row", gap: 12, width: "100%" },
  cancelActionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cancelActionText: { color: "#fff", fontWeight: "700" },
  deleteActionBtn: { flex: 1.5, borderRadius: 16, overflow: "hidden" },
  deleteGradient: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteActionText: { color: "#fff", fontWeight: "900" },
});
