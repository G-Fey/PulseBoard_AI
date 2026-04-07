import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  AnimatedHeartButton,
  AnimatedTrashButton,
} from "../ui/AnimatedButtons";

const { height } = Dimensions.get("window");

export const PulseDetailModal = ({
  isVisible,
  card,
  onClose,
  onFavorite,
  onShare,
  onDelete,
}: any) => {
  if (!card) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.detailOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.detailGlass}>
              <View style={styles.modalDragLine} />
              <View style={styles.modalHeader}>
                <AnimatedHeartButton
                  isFavorite={card.isFavorite}
                  onPress={() => onFavorite(card.id)}
                  size={28}
                />
                <TouchableOpacity onPress={() => onShare(card)}>
                  <Ionicons name="share-outline" size={28} color="#4ecca3" />
                </TouchableOpacity>
                <AnimatedTrashButton onDelete={() => onDelete(card.id)} />
              </View>

              <Text style={styles.detailCategory}>{card.category}</Text>
              <Text style={styles.detailTitle}>{card.title}</Text>

              {card.source && (
                <TouchableOpacity
                  style={styles.sourceBadge}
                  onPress={() => Linking.openURL(card.source)}
                >
                  <Ionicons name="link" size={14} color="#4ecca3" />
                  <Text style={styles.sourceText}>
                    {card.sourceName || "Source"}
                  </Text>
                  <Feather
                    name="external-link"
                    size={12}
                    color="rgba(255,255,255,0.3)"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.summaryContainer}>
                <Text style={styles.summaryLabel}>POINTS CLÉS</Text>
                {card.summary.map((point: string, i: number) => (
                  <Text key={i} style={styles.bulletPoint}>
                    • {point}
                  </Text>
                ))}
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(78, 204, 163, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "rgba(78, 204, 163, 0.2)",
  },
  sourceText: {
    color: "#4ecca3",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
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
});
