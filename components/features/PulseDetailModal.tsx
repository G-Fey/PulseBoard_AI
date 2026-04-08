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
            {/* HEADER OPTIMISÉ UI/UX */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>

              <View style={styles.actionsGroup}>
                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.actionCircle}
                >
                  <Ionicons name="share-outline" size={20} color="#4ecca3" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onFavorite}
                  style={styles.actionCircle}
                >
                  <Ionicons
                    name={card.isFavorite ? "heart" : "heart-outline"}
                    size={20}
                    color={card.isFavorite ? "#ef4444" : "#4ecca3"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDelete(card.id)}
                  style={[styles.actionCircle, styles.deleteBtn]}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
    height: "65%",
    padding: 24, // Augmenté pour respirer
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionsGroup: {
    flexDirection: "row",
    gap: 12, // Espacement plus large et régulier entre les icônes
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(78, 204, 163, 0.05)", // Fond très léger pour définir la zone de clic
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "rgba(100, 116, 139, 0.05)", // Teinte plus neutre pour supprimer
  },
  scrollBody: { paddingBottom: 40 },
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
    fontSize: 24, // Légèrement augmenté
    fontWeight: "900",
    lineHeight: 30,
    marginBottom: 15,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 25,
    backgroundColor: "rgba(78, 204, 163, 0.08)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  sourceText: { color: "#4ecca3", fontSize: 12, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 25,
  },
  sectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 15,
    letterSpacing: 1,
  },
  bulletsContainer: { gap: 16 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start" },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ecca3",
    marginTop: 8,
    marginRight: 14,
  },
  bulletText: { color: "#94a3b8", fontSize: 15, lineHeight: 22, flex: 1 },
});
