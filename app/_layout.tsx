import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavBar } from "../components/ui/NavBar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#020817" }}>
      <StatusBar style="light" />

      {/* Le contenu des pages (Dashboard, Favorites, etc.) */}
      <View style={styles.container}>
        <Slot />
      </View>

      {/* La NavBar fixe qui ne bouge jamais */}
      <NavBar onAdd={() => console.log("Global Add Action")} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020817",
  },
});
