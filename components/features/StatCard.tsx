import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../ui/GlassCard";

export const StatCard = ({ icon, label, value, color, isSerie }: any) => (
  <GlassCard style={styles.cardFlex}>
    <View style={styles.contentWrapper}>
      {/* Haut : Icône et Label */}
      <View style={styles.header}>
        <FontAwesome5 name={icon} size={14} color={color} />
        <Text style={[styles.label, { color: color + "aa" }]}>{label}</Text>
      </View>

      {/* Milieu : La Valeur numérique */}
      <Text style={styles.value}>{value}</Text>

      {/* Bas : La barre de progression (poussée vers le bas) */}
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
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  cardFlex: {
    flex: 1,
    minHeight: 120, // Donne une hauteur minimale pour que l'effet "bas" soit visible
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between", // Aligne les éléments aux extrémités
    padding: 2, // Petit ajustement pour ne pas coller aux bords du GlassCard
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  label: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  value: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: "auto", // Pousse la barre tout en bas si l'espace le permet
    width: "100%",
    paddingBottom: 5, // Petit espacement du bord bas
  },
  progressBarBackground: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
