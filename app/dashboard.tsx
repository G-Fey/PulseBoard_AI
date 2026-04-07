import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

import { DashboardHeader } from "../components/features/DashboardHeader";
import { DeleteConfirmModal } from "../components/features/DeleteConfirmModal";
import { PulseCard } from "../components/features/PulseCard";
import { PulseDetailModal } from "../components/features/PulseDetailModal";
import { StatCard } from "../components/features/StatCard";
import { ThemeSection } from "../components/features/ThemeSection";
import { NavBar } from "../components/ui/NavBar";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Dashboard() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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

  // FONCTION : LIKE / FAVORIS
  const toggleFavorite = (id: string) => {
    setPulseCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
    // Si la modale de détail est ouverte, on met aussi à jour la carte sélectionnée
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard({
        ...selectedCard,
        isFavorite: !selectedCard.isFavorite,
      });
    }
  };

  const handleThemePress = (id: string) => {
    if (isEditMode) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setThemes((prev) => prev.filter((t) => t.id !== id));
    } else {
      setThemes((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)),
      );
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
      <LinearGradient
        colors={["#020817", "#0f172a", "#020817"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        <DashboardHeader
          userName="Alex"
          onProfilePress={() => router.push("/profile")}
        />

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

          <ThemeSection
            themes={themes}
            isEditMode={isEditMode}
            maxVeilles={MAX_VEILLES}
            onToggleEdit={() => setIsEditMode(!isEditMode)}
            onThemePress={handleThemePress}
          />

          <Text style={styles.sectionTitle}>DERNIÈRES ANALYSES</Text>
          <View style={styles.cardsGrid}>
            {pulseCards.map((card) => (
              <PulseCard
                key={card.id}
                card={card}
                onPress={() => setSelectedCard(card)}
                onFavorite={() => toggleFavorite(card.id)} // <--- CONNECTÉ
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      <NavBar onAdd={() => setIsAddModalVisible(true)} />

      <PulseDetailModal
        isVisible={!!selectedCard}
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={() => toggleFavorite(selectedCard?.id)} // <--- CONNECTÉ
        onDelete={setCardToDelete}
      />

      <DeleteConfirmModal
        isVisible={!!cardToDelete}
        onConfirm={handleDeleteCard}
        onCancel={() => setCardToDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  mainContent: { flex: 1, paddingTop: 50 },
  scrollArea: { paddingHorizontal: 25, paddingBottom: 150 },
  statsContainer: { flexDirection: "row", gap: 15, marginBottom: 25 },
  sectionTitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardsGrid: { gap: 12 },
});
