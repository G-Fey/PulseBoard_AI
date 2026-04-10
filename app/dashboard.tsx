import { Canvas } from "@react-three/fiber";
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
import { Companion } from "../components/3d/Companion"; // Ton nouveau composant
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

  // --- ÉTATS DONNÉES ---
  const [seriesValue, setSeriesValue] = useState(57); // % de la série
  const [activeAnim, setActiveAnim] = useState<string | null>(null);

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
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

    // Condition : Aucune veille active
    const activeCount = themes.filter((t) => t.isActive).length;
    if (activeCount === 0) triggerAnim("hungry");

    // Condition : Aucune PulseCard
    if (pulseCards.length === 0) triggerAnim("work");
  }, []);

  // Utilitaire pour lancer une animation Blender
  const triggerAnim = (animName: string) => {
    setActiveAnim(animName);
    setTimeout(() => setActiveAnim(null), 100);
  };

  const handleAddNewTheme = (name: string) => {
    const trimmedName = name.trim();
    const isDuplicate = themes.some(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      triggerAnim("etourdie"); // Erreur doublon
      setAlertConfig({
        visible: true,
        title: "DÉJÀ PRÉSENT",
        message: `"${trimmedName}" existe déjà.`,
      });
      return;
    }

    const activeCount = themes.filter((t) => t.isActive).length;
    const shouldBeActive = activeCount < MAX_VEILLES;

    if (!shouldBeActive) {
      triggerAnim("etourdie"); // Erreur limite
      setAlertConfig({
        visible: true,
        title: "LIMITE",
        message: "Maximum 5 veilles actives.",
      });
    } else {
      triggerAnim("ecriture"); // Succès ajout
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
    setIsAddModalVisible(false);
  };

  const toggleFavorite = (id: string) => {
    const isNowFavorite = !pulseCards.find((c) => c.id === id)?.isFavorite;
    triggerAnim(isNowFavorite ? "heart" : "triste"); // Like -> heart, Dislike -> triste

    setPulseCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
    if (selectedCard?.id === id)
      setSelectedCard({
        ...selectedCard,
        isFavorite: !selectedCard.isFavorite,
      });
  };

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
        triggerAnim("etourdie");
        setAlertConfig({
          visible: true,
          title: "LIMITE ATTEINTE",
          message: "Désactivez-en une d'abord.",
        });
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setThemes((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)),
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#020817", "#0f172a", "#020817"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* --- PERSONNAGE 3D EN ARRIÈRE PLAN --- */}
      <View style={styles.canvasContainer} pointerEvents="none">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />
          <Companion triggerAction={activeAnim} seriesPercent={seriesValue} />
        </Canvas>
      </View>

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
              value={`${seriesValue}%`}
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
        onConfirm={() => {
          setPulseCards((p) => p.filter((c) => c.id !== cardToDelete));
          setCardToDelete(null);
          setSelectedCard(null);
          triggerAnim("triste"); // Animation lors de la suppression
        }}
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
  canvasContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // Derrière tout
    opacity: 0.6, // Pour ne pas trop gêner la lecture des cartes
  },
  mainContent: { flex: 1, paddingTop: 50, zIndex: 1 },
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
