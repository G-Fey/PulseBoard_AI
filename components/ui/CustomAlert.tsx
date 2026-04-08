import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const CustomAlert = ({ isVisible, title, message, onClose }: Props) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

        <View style={styles.alertBox}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning-outline" size={28} color="#fbbf24" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>COMPRIS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#4ecca3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#020817",
    fontWeight: "900",
    fontSize: 14,
  },
});
