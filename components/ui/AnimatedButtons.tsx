import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export const AnimatedHeartButton = ({
  isFavorite,
  onPress,
  size = 22,
}: any) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const breakAnim = useRef(new Animated.Value(0)).current;
  const [showBreak, setShowBreak] = useState(false);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (isFavorite) {
      pulseAnim.setValue(0);
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      setShowBreak(true);
      breakAnim.setValue(0);
      Animated.timing(breakAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setShowBreak(false));
    }
  }, [isFavorite]);

  return (
    <View style={styles.btnArea}>
      <Animated.View
        style={[
          styles.abs,
          {
            opacity: pulseAnim.interpolate({
              inputRange: [0, 0.1, 1],
              outputRange: [0, 0.6, 0],
            }),
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.5],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons name="heart" size={size} color="#ef4444" />
      </Animated.View>
      {showBreak && (
        <Animated.View
          style={[
            styles.abs,
            {
              opacity: breakAnim.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [1, 1, 0],
              }),
              transform: [
                {
                  translateY: breakAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 25],
                  }),
                },
                { rotate: "-20deg" },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="heart-broken"
            size={size}
            color="#ef4444"
          />
        </Animated.View>
      )}
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={size}
          color={isFavorite ? "#ef4444" : "rgba(255,255,255,0.3)"}
        />
      </TouchableOpacity>
    </View>
  );
};

export const AnimatedTrashButton = ({ onDelete }: any) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start(() => onDelete());
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={28}
          color="#ef4444"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnArea: {
    padding: 5,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  abs: { position: "absolute", alignSelf: "center" },
});
