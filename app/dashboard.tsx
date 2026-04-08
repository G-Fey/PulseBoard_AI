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

// --- IMPORTS ---
import { AddThemeModal } from "../components/features/AddThemeModal";
import { DashboardHeader } from "../components/features/DashboardHeader";
import { DeleteConfirmModal } from "../components/features/DeleteConfirmModal";
import { PulseCard } from "../components/features/PulseCard";
import { PulseDetailModal } from "../components/features/PulseDetailModal";
import { StatCard } from "../components/features/StatCard";
import { ThemeSection } from "../components/features/ThemeSection";
import { CustomAlert } from "../components/ui/CustomAlert";
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

  // État pour la modale d'alerte personnalisée
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

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

  // --- FONCTION : AJOUTER UNE VEILLE (AVEC SÉCURITÉ DOUBLONS) ---
  const handleAddNewTheme = (name: string) => {
    const trimmedName = name.trim();

    // 1. Vérification Doublon
    const isDuplicate = themes.some(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setAlertConfig({
        visible: true,
        title: "DÉJÀ PRÉSENT",
        message: `La thématique "${trimmedName}" existe déjà dans votre liste.`,
      });
      return;
    }

    // 2. Gestion de l'activation automatique (max 5)
    const activeCount = themes.filter((t) => t.isActive).length;
    const shouldBeActive = activeCount < MAX_VEILLES;

    if (!shouldBeActive) {
      setAlertConfig({
        visible: true,
        title: "VEILLE AJOUTÉE",
        message:
          "Thème ajouté ! Il est en attente car vous avez déjà 5 veilles actives.",
      });
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setThemes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: trimmedName,
        isActive: shouldBeActive,
      },
    ]);
    setIsAddModalVisible(false); // Fermer la modale après succès
  };

  // FONCTION : LIKE / FAVORIS
  const toggleFavorite = (id: string) => {
    setPulseCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard({
        ...selectedCard,
        isFavorite: !selectedCard.isFavorite,
      });
    }
  };

  // FONCTION : GESTION DES BULLES (Toggle avec limite)
  const handleThemePress = (id: string) => {
    if (isEditMode) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setThemes((prev) => prev.filter((t) => t.id !== id));
    } else {
      const themeToToggle = themes.find((t) => t.id === id);
      const activeCount = themes.filter((t) => t.isActive).length;

      if (
        themeToToggle &&
        !themeToToggle.isActive &&
        activeCount >= MAX_VEILLES
      ) {
        setAlertConfig({
          visible: true,
          title: "LIMITE ATTEINTE",
          message:
            "Maximum 5 veilles actives. Désactivez-en une pour en libérer une autre.",
        });
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
          onProfilePress={() => router.push("/Profil")}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea}
        >
          <View style={styles.statsContainer}>
            <StatCard
              icon="brain"
              label="Analyses"
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
            onAddPress={() => setIsAddModalVisible(true)}
          />

          <Text style={styles.sectionTitle}>DERNIÈRES ANALYSES</Text>
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

      <NavBar />

      <AddThemeModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddNewTheme}
      />

      <PulseDetailModal
        isVisible={!!selectedCard}
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={() => toggleFavorite(selectedCard?.id)}
        onDelete={setCardToDelete}
      />

      <DeleteConfirmModal
        isVisible={!!cardToDelete}
        onConfirm={handleDeleteCard}
        onCancel={() => setCardToDelete(null)}
      />

      <CustomAlert
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
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
