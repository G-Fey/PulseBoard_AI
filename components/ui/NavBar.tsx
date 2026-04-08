import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const isPC = width > 1000;

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Détection des pages
  const isDashboard =
    pathname === "/dashboard" || pathname === "/index" || pathname === "/";
  const isFavorites = pathname === "/favorites";

  return (
    <View style={styles.navBarContainer} pointerEvents="box-none">
      <View style={styles.navBarGlass}>
        {/* --- GAUCHE : HOME --- */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => !isDashboard && router.push("/dashboard" as Href)}
        >
          <FontAwesome5
            name="home"
            size={20}
            color={isDashboard ? "#4ecca3" : "#64748b"}
          />
          {isDashboard && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* --- DROITE : FAVORIS --- */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => !isFavorites && router.push("/favorites" as Href)}
        >
          <Ionicons
            name={isFavorites ? "heart" : "heart-outline"}
            size={24}
            color={isFavorites ? "#4ecca3" : "#64748b"}
          />
          {isFavorites && <View style={styles.activeDot} />}
        </TouchableOpacity>
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
    width: isPC ? 300 : "60%", // On réduit la largeur puisqu'il n'y a que 2 boutons
    height: 64,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around", // Répartition équilibrée
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 20,
  },
  navBtn: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDot: {
    position: "absolute",
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4ecca3",
  },
});
