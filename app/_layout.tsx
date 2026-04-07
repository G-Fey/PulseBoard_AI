import { Slot, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavBar } from "../components/ui/NavBar";

export default function RootLayout() {
  const pathname = usePathname();

  // DEBUG : Décommente la ligne suivante pour voir le chemin exact dans ton terminal
  // console.log("Pathname actuel :", pathname);

  // Vérification plus large : si le chemin contient "login", on cache la barre
  // On cache aussi si le chemin est vide ou "/" si ton login est ta page d'accueil
  const isAuthPage = pathname.includes("login") || pathname === "/";

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#020817" }}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <Slot />
      </View>

      {/* La NavBar ne s'affiche QUE si on n'est PAS sur la page d'auth */}
      {!isAuthPage && <NavBar onAdd={() => console.log("Ajouter")} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020817",
  },
});
