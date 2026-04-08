import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const { height, width } = Dimensions.get("window");

export const AddThemeModal = ({ isVisible, onClose, onAdd }: Props) => {
  const [name, setName] = useState("");

  if (!isVisible) return null; // Sécurité : on ne rend rien si pas visible

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
      onClose();
    }
  };

  return (
    <View style={styles.fullScreenOverlay}>
      {/* Background sombre cliquable */}
      <TouchableOpacity
        style={styles.dismiss}
        onPress={onClose}
        activeOpacity={1}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Nouvelle Veille</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Ex: Architecture Unreal 5..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={name}
            onChangeText={setName}
            autoFocus={true}
            selectionColor="#4ecca3"
          />

          <TouchableOpacity
            onPress={handleAdd}
            style={[
              styles.btn,
              { backgroundColor: name.trim() ? "#4ecca3" : "#1e293b" },
            ]}
            disabled={!name.trim()}
          >
            <Text
              style={[
                styles.btnText,
                { color: name.trim() ? "#020817" : "#64748b" },
              ]}
            >
              Activer la surveillance
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    // On utilise absoluteFillObject pour couvrir tout l'écran sans passer par Modal
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 8, 23, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999, // On s'assure d'être au-dessus de la NavBar
    width: width,
    height: height,
  },
  dismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: "85%",
    maxWidth: 400,
  },
  modalBox: {
    backgroundColor: "#0f172a",
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    // Ombre pour donner de la profondeur
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeBtn: {
    padding: 5,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.03)",
    color: "white",
    padding: 15,
    fontSize: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  btn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "900",
    fontSize: 16,
  },
});
