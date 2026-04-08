import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeBubble } from "./ThemeBubble";

interface Props {
  themes: any[];
  isEditMode: boolean;
  onToggleEdit: () => void;
  onThemePress: (id: string) => void;
  onAddPress: () => void; // Ajout de la prop pour l'action d'ajout
  maxVeilles: number;
}

export const ThemeSection = ({
  themes,
  isEditMode,
  onToggleEdit,
  onThemePress,
  onAddPress,
  maxVeilles,
}: Props) => {
  const activeCount = themes.filter((t) => t.isActive).length;

  return (
    <View style={styles.themesWrapper}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          VEILLES ACTIVES ({activeCount}/{maxVeilles})
        </Text>

        <View style={styles.actionGroup}>
          {/* Nouveau bouton Ajouter */}
          <TouchableOpacity onPress={onAddPress} style={styles.editButton}>
            <Ionicons name="add" size={18} color="#4ecca3" />
          </TouchableOpacity>

          {/* Bouton Édition / Poubelle */}
          <TouchableOpacity
            onPress={onToggleEdit}
            style={[styles.editButton, isEditMode && styles.editButtonActive]}
          >
            <Ionicons
              name={isEditMode ? "checkmark" : "trash-outline"}
              size={18}
              color={isEditMode ? "#4ecca3" : "#64748b"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.themesGrid}>
        {themes.map((item) => (
          <ThemeBubble
            key={item.id}
            theme={item}
            isEditMode={isEditMode}
            onPress={() => onThemePress(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  themesWrapper: { marginBottom: 25 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 8, // Espace entre le bouton + et la poubelle
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonActive: {
    borderColor: "rgba(78, 204, 163, 0.5)",
    borderWidth: 1,
    backgroundColor: "rgba(78, 204, 163, 0.05)",
  },
  themesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
