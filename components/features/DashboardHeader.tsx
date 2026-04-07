import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  userName: string;
  onProfilePress: () => void;
}

export const DashboardHeader = ({ userName, onProfilePress }: Props) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.welcomeText}>Bonjour, {userName}</Text>
      <Text style={styles.statusValue}>SYSTÈME : OPTIMAL</Text>
    </View>
    <TouchableOpacity style={styles.profileCircle} onPress={onProfilePress}>
      <FontAwesome5 name="user-alt" size={18} color="#4ecca3" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  welcomeText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  statusValue: { color: "#4ecca3", fontSize: 10, fontWeight: "900" },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(78, 204, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
