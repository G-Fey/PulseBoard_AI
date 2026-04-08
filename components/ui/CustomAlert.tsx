import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  type?: "danger" | "warning" | "success";
}

export const CustomAlert = ({
  isVisible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText,
  type = "warning",
}: Props) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return { name: "trash-outline", color: "#ef4444" };
      case "success":
        return { name: "checkmark-circle-outline", color: "#4ecca3" };
      default:
        return { name: "warning-outline", color: "#fbbf24" };
    }
  };

  const iconData = getIcon();

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

        <View style={styles.alertBox}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${iconData.color}15` },
            ]}
          >
            <Ionicons
              name={iconData.name as any}
              size={28}
              color={iconData.color}
            />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>ANNULER</Text>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { backgroundColor: iconData.color },
                ]}
                onPress={onConfirm}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    {
                      color:
                        type === "danger" || type === "success"
                          ? "white"
                          : "#020817",
                    },
                  ]}
                >
                  {confirmText || "CONFIRMER"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    width: "85%",
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
    letterSpacing: 1,
  },
  message: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 25,
  },
  buttonGroup: { flexDirection: "row", gap: 12, width: "100%" },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  cancelButtonText: { color: "white", fontWeight: "700", fontSize: 13 },
  confirmButtonText: { fontWeight: "900", fontSize: 13 },
});
