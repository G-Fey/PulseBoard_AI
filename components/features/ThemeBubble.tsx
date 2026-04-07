import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ThemeBubbleProps {
  theme: {
    id: string;
    name: string;
    isActive: boolean;
  };
  isEditMode: boolean;
  onPress: (id: string) => void;
}

export const ThemeBubble = ({
  theme,
  isEditMode,
  onPress,
}: ThemeBubbleProps) => {
  const { id, name, isActive } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.bubbleContainer,
        isActive ? styles.activeBorder : styles.inactiveBorder,
        isEditMode && styles.editBorder,
      ]}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={
          isActive
            ? ["rgba(78, 204, 163, 0.25)", "rgba(78, 204, 163, 0.05)"]
            : ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
        }
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={[styles.text, { opacity: isActive ? 1 : 0.4 }]}>
            {name}
          </Text>

          {isEditMode && (
            <View style={styles.deleteIcon}>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  activeBorder: { borderColor: "rgba(78, 204, 163, 0.4)" },
  inactiveBorder: { borderColor: "rgba(255, 255, 255, 0.08)" },
  editBorder: { borderColor: "rgba(239, 68, 68, 0.4)", borderStyle: "dashed" },
  gradient: { paddingHorizontal: 12, paddingVertical: 8 },
  content: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { color: "#fff", fontSize: 12, fontWeight: "700" },
  deleteIcon: { marginLeft: 2 },
});
