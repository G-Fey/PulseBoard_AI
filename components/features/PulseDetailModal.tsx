import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  isVisible: boolean;
  card: any;
  onClose: () => void;
  onFavorite: () => void;
  onDelete: (id: string) => void;
}

export const PulseDetailModal = ({
  isVisible,
  card,
  onClose,
  onFavorite,
  onDelete,
}: Props) => {
  if (!card) return null;

  const openSource = async () => {
    const url = card.url || "https://google.com";
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert("Erreur", "Lien invalide.");
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Analyse : ${card.title}` });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContent}>
          <View style={{ flex: 1 }}>
            {/* HEADER RÉDUIT */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.actionIcon}
                >
                  <Ionicons name="share-outline" size={22} color="#4ecca3" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onFavorite}
                  style={styles.actionIcon}
                >
                  <Ionicons
                    name={card.isFavorite ? "heart" : "heart-outline"}
                    size={22}
                    color={card.isFavorite ? "#ef4444" : "#4ecca3"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(card.id)}
                  style={styles.actionIcon}
                >
                  <Ionicons name="trash-outline" size={22} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollBody}
            >
              <Text style={styles.category}>{card.category}</Text>
              <Text style={styles.title}>{card.title}</Text>

              <TouchableOpacity
                onPress={openSource}
                style={styles.sourceContainer}
              >
                <FontAwesome5
                  name="external-link-alt"
                  size={10}
                  color="#4ecca3"
                />
                <Text style={styles.sourceText}>{card.sourceName}</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>POINTS CLÉS</Text>

              <View style={styles.bulletsContainer}>
                {card.summary
                  .slice(0, 3)
                  .map((point: string, index: number) => (
                    <View key={index} style={styles.bulletRow}>
                      <View style={styles.bullet} />
                      <Text style={styles.bulletText}>{point}</Text>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  dismissArea: { ...StyleSheet.absoluteFillObject },
  modalContent: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    height: "65%", // TAILLE RÉDUITE ICI (était 85%)
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: 5 },
  actionIcon: { padding: 8 },
  scrollBody: { paddingBottom: 20 },
  category: {
    color: "#4ecca3",
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28,
    marginBottom: 15,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    backgroundColor: "rgba(78, 204, 163, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  sourceText: { color: "#4ecca3", fontSize: 12, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 20,
  },
  sectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 15,
  },
  bulletsContainer: { gap: 12 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start" },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#4ecca3",
    marginTop: 7,
    marginRight: 12,
  },
  bulletText: { color: "#94a3b8", fontSize: 14, lineHeight: 20, flex: 1 },
});
