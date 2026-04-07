import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal = ({
  isVisible,
  onConfirm,
  onCancel,
}: Props) => (
  <Modal visible={isVisible} transparent animationType="fade">
    <View style={styles.confirmOverlay}>
      <View style={styles.confirmBox}>
        <Text style={styles.confirmTitle}>Supprimer ?</Text>
        <TouchableOpacity style={styles.deleteActionBtn} onPress={onConfirm}>
          <Text style={styles.btnText}>Confirmer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: {
    backgroundColor: "#0f172a",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  confirmTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
  },
  deleteActionBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "900" },
  cancelBtn: { marginTop: 15 },
  cancelText: { color: "#64748b" },
});
