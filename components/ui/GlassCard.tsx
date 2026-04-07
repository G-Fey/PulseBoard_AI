import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export const GlassCard = ({ children, style, gradientColors }: any) => (
  <View style={[styles.wrapper, style]}>
    <LinearGradient
      colors={
        gradientColors || ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
      }
      style={styles.gradientFill}
    >
      {children}
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    width: "100%",
  },
  gradientFill: {
    padding: 20,
    width: "100%",
  },
});
