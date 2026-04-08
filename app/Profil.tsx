import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// --- IMPORTS UI ---
import { CustomAlert } from "../components/ui/CustomAlert";

export default function ProfilScreen() {
  const router = useRouter();

  // --- ÉTATS DES DONNÉES UTILISATEUR ---
  const [user, setUser] = useState({
    firstName: "Alexandre",
    lastName: "R.",
    pseudo: "Alex3D",
    email: "alex.3d@pulse.art",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  });

  // --- ÉTATS DES MODALES D'ÉDITION ---
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [tempData, setTempData] = useState({ ...user });
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  // --- ÉTAT DE LA CUSTOM ALERT (RGPD / SÉCURITÉ) ---
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "danger" | "warning" | "success";
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "warning",
  });

  // --- LOGIQUE ACTIONS ---
  const handleSaveIdentity = () => {
    setUser({ ...user, ...tempData });
    setActiveModal(null);
  };

  const triggerExport = () => {
    setAlertConfig({
      visible: true,
      title: "EXPORTER LES DONNÉES",
      message:
        "Voulez-vous recevoir un e-mail contenant l'intégralité de vos données Pulse au format JSON ?",
      type: "warning",
      confirmText: "RECEVOIR",
      onConfirm: () => {
        console.log("Export lancé");
        setAlertConfig((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const triggerDeleteAccount = () => {
    setAlertConfig({
      visible: true,
      title: "SUPPRIMER LE COMPTE",
      message:
        "Cette action est irréversible. Toutes vos analyses et préférences seront définitivement effacées.",
      type: "danger",
      confirmText: "SUPPRIMER",
      onConfirm: () => {
        console.log("Compte supprimé");
        setAlertConfig((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const SettingItem = ({
    icon,
    label,
    subLabel,
    onPress,
    color = "#4ecca3",
    rightElement = null,
    disabled = false,
  }: any) => (
    <TouchableOpacity
      style={[styles.settingItem, disabled && { opacity: 0.5 }]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subLabel && <Text style={styles.settingSubLabel}>{subLabel}</Text>}
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(255,255,255,0.2)"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#020817", "#0f172a"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFIL</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editBadge}>
              <Feather name="camera" size={14} color="#020817" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => setActiveModal("premium")}
          >
            <LinearGradient
              colors={["#4ecca3", "#45b39d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumGradient}
            >
              <MaterialCommunityIcons name="crown" size={20} color="#020817" />
              <Text style={styles.premiumText}>PASSER À PULSE PREMIUM</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>COMPTE</Text>
        <View style={styles.group}>
          <SettingItem
            icon="person-outline"
            label="Identité"
            subLabel={`${user.pseudo} • ${user.firstName}`}
            onPress={() => {
              setTempData({ ...user });
              setActiveModal("identity");
            }}
          />
          <SettingItem
            icon="mail-outline"
            label="E-mail (ID)"
            subLabel={user.email}
            disabled={true}
            rightElement={
              <Ionicons
                name="lock-closed"
                size={16}
                color="rgba(255,255,255,0.2)"
              />
            }
          />
        </View>

        <Text style={styles.sectionTitle}>SÉCURITÉ</Text>
        <View style={styles.group}>
          <SettingItem
            icon="lock-closed-outline"
            label="Mot de passe"
            subLabel="Modifier mon accès"
            onPress={() => setActiveModal("password")}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Double Authentification"
            color="#fbbf24"
            rightElement={
              <Switch
                value={isTwoFactorEnabled}
                onValueChange={setIsTwoFactorEnabled}
                trackColor={{ false: "#1e293b", true: "#4ecca3" }}
              />
            }
          />
        </View>

        <Text style={styles.sectionTitle}>CONFIDENTIALITÉ (RGPD)</Text>
        <View style={styles.group}>
          <SettingItem
            icon="download-outline"
            label="Exporter mes données"
            onPress={triggerExport}
          />
          <SettingItem
            icon="trash-outline"
            label="Supprimer mon compte"
            color="#ef4444"
            onPress={triggerDeleteAccount}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- MODALE IDENTITÉ --- */}
      <Modal
        visible={activeModal === "identity"}
        animationType="slide"
        transparent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>MODIFIER L'IDENTITÉ</Text>
            <TextInput
              style={styles.input}
              placeholder="Pseudo"
              placeholderTextColor="#64748b"
              value={tempData.pseudo}
              onChangeText={(t) => setTempData({ ...tempData, pseudo: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor="#64748b"
              value={tempData.firstName}
              onChangeText={(t) => setTempData({ ...tempData, firstName: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#64748b"
              value={tempData.lastName}
              onChangeText={(t) => setTempData({ ...tempData, lastName: t })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelText}>ANNULER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveIdentity}
              >
                <Text style={styles.saveText}>ENREGISTRER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODALE MOT DE PASSE --- */}
      <Modal
        visible={activeModal === "password"}
        animationType="slide"
        transparent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>SÉCURITÉ ACCÈS</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Mot de passe actuel"
              placeholderTextColor="#64748b"
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Nouveau mot de passe"
              placeholderTextColor="#64748b"
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Confirmer nouveau mot de passe"
              placeholderTextColor="#64748b"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelText}>ANNULER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.saveText}>METTRE À JOUR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CustomAlert
        isVisible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020817" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  avatarSection: { alignItems: "center", marginVertical: 30 },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4ecca3",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4ecca3",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0f172a",
  },
  userName: { color: "white", fontSize: 22, fontWeight: "900", marginTop: 15 },
  userEmail: { color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 5 },
  premiumBanner: { width: "100%", marginTop: 25 },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 16,
    gap: 10,
  },
  premiumText: {
    color: "#020817",
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1,
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 30,
    marginBottom: 15,
  },
  group: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  settingText: { flex: 1 },
  settingLabel: { color: "white", fontSize: 15, fontWeight: "600" },
  settingSubLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: { marginTop: 40, alignItems: "center", padding: 20 },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 25,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 15,
    color: "white",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalButtons: { flexDirection: "row", gap: 15, marginTop: 10 },
  cancelBtn: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  saveBtn: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#4ecca3",
  },
  cancelText: { color: "white", fontWeight: "700" },
  saveText: { color: "#020817", fontWeight: "900" },
});
