import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");
const isPC = width > 1000;

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
    setPulseCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card,
      ),
    );
    if (selectedCard?.id === id) {
      setSelectedCard((prev: any) => ({
        ...prev,
        isFavorite: !prev.isFavorite,
      }));
    }
  };

  const handleShare = async (card: any) => {
    try {
      const message = `Pulse Card : ${card.title}\n\nPoints clés :\n${card.summary.map((p: string) => `• ${p}`).join("\n")}`;
      await Share.share({
        message: Platform.OS === "android" ? message : card.title,
        title: card.title,
        url: Platform.OS === "ios" ? "https://pulseboard.ai" : undefined, // Optionnel
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    if (cardToDelete) {
      setPulseCards((prev) => prev.filter((card) => card.id !== cardToDelete));
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

      {/* --- MODALE DÉTAILS --- */}
      <Modal
        visible={!!selectedCard && !cardToDelete}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedCard(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedCard(null)}>
          <View style={styles.detailOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.detailGlass}>
                <View style={styles.modalDragLine} />
                <View style={styles.modalHeader}>
                  <AnimatedHeartButton
                    isFavorite={selectedCard?.isFavorite}
                    onPress={() => toggleFavorite(selectedCard?.id)}
                    size={28}
                  />

                  {/* NOUVEAU : BOUTON PARTAGE */}
                  <TouchableOpacity
                    onPress={() => handleShare(selectedCard)}
                    activeOpacity={0.6}
                  >
                    <Ionicons name="share-outline" size={28} color="#4ecca3" />
                  </TouchableOpacity>

                  <AnimatedTrashButton
                    onDelete={() => setCardToDelete(selectedCard?.id)}
                  />
                </View>

                <Text style={styles.detailCategory}>
                  {selectedCard?.category}
                </Text>
                <Text style={styles.detailTitle}>{selectedCard?.title}</Text>

                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryLabel}>POINTS CLÉS</Text>
                  {selectedCard?.summary.map((point: string, i: number) => (
                    <Text key={i} style={styles.bulletPoint}>
                      • {point}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedCard(null)}
                >
                  <Text style={styles.closeBtnText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- MODALE DE SUPPRESSION --- */}
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

      <View style={styles.navBarContainer}>
        <View style={styles.navBarGlass}>
          <TouchableOpacity style={styles.navBtn}>
            <FontAwesome5 name="home" size={18} color="#4ecca3" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerBtn}>
            <FontAwesome5 name="plus" size={20} color="#020817" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons name="heart" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- BOUTONS ANIMÉS ET SOUS-COMPOSANTS ---
const AnimatedTrashButton = ({ onDelete }: any) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start(() => onDelete());
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={28}
          color="#ef4444"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const AnimatedHeartButton = ({ isFavorite, onPress, size = 22 }: any) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const breakAnim = useRef(new Animated.Value(0)).current;
  const [showBreak, setShowBreak] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (isFavorite) {
      pulseAnim.setValue(0);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      setShowBreak(true);
      breakAnim.setValue(0);
      Animated.timing(breakAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setShowBreak(false));
    }
  }, [isFavorite]);

  return (
    <View style={styles.favBtnArea}>
      <Animated.View
        style={[
          styles.pulseHeart,
          {
            opacity: pulseAnim.interpolate({
              inputRange: [0, 0.1, 1],
              outputRange: [0, 0.6, 0],
            }),
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.5],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="heart" size={size} color="#ef4444" />
      </Animated.View>
      {showBreak && (
        <Animated.View
          style={[
            styles.breakContainer,
            {
              opacity: breakAnim.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [1, 1, 0],
              }),
              transform: [
                {
                  translateY: breakAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 25],
                  }),
                },
                { rotate: "-20deg" },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="heart-broken"
            size={size}
            color="#ef4444"
          />
        </Animated.View>
      )}
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={size}
          color={isFavorite ? "#ef4444" : "rgba(255,255,255,0.3)"}
        />
      </TouchableOpacity>
    </View>
  );
};

const PulseCard = ({ card, onPress, onFavorite }: any) => (
  <TouchableOpacity
    style={styles.glassWrapperPulse}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.01)"]}
      style={styles.pulseCardInternal}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.categoryTag}>{card.category}</Text>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardDate}>{card.date}</Text>
      </View>
      <AnimatedHeartButton isFavorite={card.isFavorite} onPress={onFavorite} />
    </LinearGradient>
  </TouchableOpacity>
);

const StatCard = ({ icon, label, value, color, isSerie }: any) => (
  <View style={styles.glassWrapperStat}>
    <LinearGradient
      colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
      style={styles.cardInternal}
    >
      <View style={styles.statHeader}>
        <FontAwesome5 name={icon} size={14} color={color} />
        <Text style={[styles.statLabelSmall, { color: color + "aa" }]}>
          {label}
        </Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {isSerie && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: value, backgroundColor: color },
              ]}
            />
          </View>
        </View>
      )}
    </LinearGradient>
  </View>
);

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
  glassWrapperStat: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
  },
  glassWrapperPulse: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(15, 23, 42, 0.2)",
  },
  cardInternal: { padding: 20 },
  pulseCardInternal: {
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  statLabelSmall: { fontSize: 9, fontWeight: "900" },
  statValue: { color: "#fff", fontSize: 28, fontWeight: "900" },
  progressContainer: { marginTop: 15 },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 3 },
  categoryTag: {
    color: "#4ecca3",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  cardDate: { color: "rgba(148, 163, 184, 0.5)", fontSize: 12, marginTop: 6 },
  sectionTitle: {
    color: "rgba(255,255,255,0.15)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 15,
  },
  favBtnArea: {
    padding: 5,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseHeart: { position: "absolute", alignSelf: "center" },
  breakContainer: { position: "absolute", alignSelf: "center" },
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
    lineHeight: 20,
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
  detailOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 8, 23, 0.8)",
    justifyContent: "flex-end",
  },
  detailGlass: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    minHeight: height * 0.7,
  },
  modalDragLine: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  detailCategory: { color: "#4ecca3", fontSize: 11, fontWeight: "900" },
  detailTitle: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 8 },
  summaryContainer: { marginTop: 35 },
  summaryLabel: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 15,
  },
  bulletPoint: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: "auto",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontWeight: "800" },
  navBarContainer: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    alignItems: "center",
  },
  navBarGlass: {
    width: isPC ? 400 : "85%",
    height: 72,
    borderRadius: 36,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  navBtn: { padding: 15 },
  centerBtn: {
    backgroundColor: "#4ecca3",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
