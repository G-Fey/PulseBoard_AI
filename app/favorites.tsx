import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import de tes composants déjà créés
import { PulseCard } from "../components/features/PulseCard";
import { PulseDetailModal } from "../components/features/PulseDetailModal";
import { NavBar } from "../components/ui/NavBar";

export default function Favorites() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Simulation de données (Normalement, tu filtreras tes cartes globales ici)
  const [favCards, setFavCards] = useState([
    {
      id: "2",
      title: "Logique React Native",
      category: "Développement",
      sourceName: "Docs Expo",
      source: "https://docs.expo.dev",
      date: "Hier",
      isFavorite: true,
      summary: ["Gestion du Virtual DOM", "Architecture des Hooks"],
    },
  ]);

  // Fonction pour retirer des favoris (si on clique sur le coeur)
  const toggleFavorite = (id: string) => {
    setFavCards((prev) => prev.filter((card) => card.id !== id));
    if (selectedCard?.id === id) setSelectedCard(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#020817", "#0f172a", "#020817"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.mainContent}>
        {/* Header avec Profil */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#4ecca3" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Mes Favoris</Text>

          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/Profil")}
          >
            <FontAwesome5 name="user-alt" size={18} color="#4ecca3" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea}
        >
          {favCards.length > 0 ? (
            <View style={styles.cardsGrid}>
              {favCards.map((card) => (
                <PulseCard
                  key={card.id}
                  card={card}
                  onPress={() => setSelectedCard(card)}
                  onFavorite={() => toggleFavorite(card.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="heart-dislike-outline"
                size={60}
                color="rgba(255,255,255,0.1)"
              />
              <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modale de détails réutilisée */}
      <PulseDetailModal
        isVisible={!!selectedCard}
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={toggleFavorite}
        onShare={() => {}}
        onDelete={() => {}} // Optionnel dans les favoris
      />

      {/* NavBar réutilisée */}
      <NavBar
        onHome={() => router.push("/dashboard")}
        onAdd={() => console.log("Ajouter")}
        onFavorites={() => {}} // Déjà sur la page
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  mainContent: { flex: 1, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  backBtn: { padding: 5 },
  pageTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(78, 204, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(78, 204, 163, 0.2)",
  },
  scrollArea: { paddingHorizontal: 25, paddingBottom: 140 },
  cardsGrid: { gap: 12 },
  emptyState: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "rgba(255,255,255,0.3)", marginTop: 15, fontSize: 16 },
});
