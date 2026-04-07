import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const isPC = width > 1000;

export const NavBar = ({ onAdd }: any) => {
  const router = useRouter();
  const pathname = usePathname();

  // Détection précise de la page
  const isDashboard =
    pathname === "/dashboard" || pathname === "/index" || pathname === "/";
  const isFavorites = pathname === "/favorites";

  return (
    <View style={styles.navBarContainer}>
      <View style={styles.navBarGlass}>
        {/* --- GAUCHE : MAISON --- */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => !isDashboard && router.push("/dashboard" as Href)}
          disabled={isDashboard}
        >
          <FontAwesome5
            name="home"
            size={18}
            color={isDashboard ? "#334155" : "#4ecca3"} // Gris foncé si actif, gris clair si cliquable
          />
        </TouchableOpacity>

        {/* --- CENTRE : DYNAMIQUE (PLUS ou COEUR) --- */}
        <View style={styles.centerContainer}>
          {isDashboard ? (
            <TouchableOpacity style={styles.centerBtnActive} onPress={onAdd}>
              <FontAwesome5 name="plus" size={20} color="#020817" />
            </TouchableOpacity>
          ) : isFavorites ? (
            <View
              style={[
                styles.centerBtnActive,
                { backgroundColor: "rgba(78, 204, 163, 0.2)" },
              ]}
            >
              <Ionicons name="heart" size={26} color="#4ecca3" />
            </View>
          ) : (
            <View style={styles.centerBtnDisabled}>
              <FontAwesome5 name="plus" size={20} color="#334155" />
            </View>
          )}
        </View>

        {/* --- DROITE : COEUR (DASHBOARD) ou PLUS GRIS (FAVORIS) --- */}
        {isDashboard ? (
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push("/favorites" as Href)}
          >
            <Ionicons
              name="heart-outline"
              size={24}
              color="#64748b" // Même couleur que la maison au repos
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.navBtn}>
            <FontAwesome5
              name="plus"
              size={18}
              color="#334155" // Indisponible sur la page favoris
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    alignItems: "center",
    zIndex: 1000,
  },
  navBarGlass: {
    width: isPC ? 400 : "85%",
    height: 72,
    borderRadius: 36,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  navBtn: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  centerBtnActive: {
    backgroundColor: "#4ecca3",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
    shadowColor: "#4ecca3",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  centerBtnDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
});
