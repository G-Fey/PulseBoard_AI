import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedHeartButton } from "../ui/AnimatedButtons";
import { GlassCard } from "../ui/GlassCard";

export const PulseCard = ({ card, onPress, onFavorite }: any) => (
  <TouchableOpacity
    style={styles.wrapper}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <GlassCard
      gradientColors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.01)"]}
      style={styles.internalCard}
    >
      <View style={styles.contentRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.category}>{card.category}</Text>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={styles.date}>{card.date}</Text>
        </View>
        <AnimatedHeartButton
          isFavorite={card.isFavorite}
          onPress={onFavorite}
        />
      </View>
    </GlassCard>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: { width: "100%", marginBottom: 12 },
  internalCard: { padding: 0 }, // On laisse le padding au contentRow
  contentRow: { flexDirection: "row", alignItems: "center", padding: 2 },
  category: {
    color: "#4ecca3",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: { color: "#fff", fontSize: 17, fontWeight: "700" },
  date: { color: "rgba(148, 163, 184, 0.5)", fontSize: 12, marginTop: 2 },
});
