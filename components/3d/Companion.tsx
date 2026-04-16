import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
// Une fois Unity installé, tu décommenteras la ligne suivante :
// import UnityView, { UnityModule } from '@azurasoft/react-native-unity-view';

interface CompanionProps {
  triggerAction: string | null;
  seriesPercent: number;
}

export function Companion({ triggerAction, seriesPercent }: CompanionProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingAction = useRef(false);

  // Détermine l'animation de série
  const getSeriesIdle = (percent: number) => {
    if (percent >= 100) return "idle_surexite";
    if (percent >= 70) return "idle_content";
    if (percent >= 50) return "idle_normal";
    if (percent >= 25) return "idle_triste";
    return "idle_depress";
  };

  const sendToUnity = (animName: string, isAction: boolean = false) => {
    // RÈGLE : Si une action est en cours, on ignore les nouveaux triggers
    if (isAnimatingAction.current && isAction) return;

    console.log(`[Unity Message] : ${animName}`);

    // Une fois configuré, ce sera :
    // UnityModule.postMessage('NomDeTonGameObject', 'PlayAnimation', animName);

    if (isAction) {
      isAnimatingAction.current = true;
      // On réinitialise le timer de 3min après chaque action
      resetSeriesTimer();
    }
  };

  const resetSeriesTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isAnimatingAction.current) {
        sendToUnity(getSeriesIdle(seriesPercent));
        // Unity devra renvoyer un message "idle_base_animation" à la fin de son clip
      }
    }, 180000); // 3 minutes
  };

  useEffect(() => {
    resetSeriesTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [seriesPercent]);

  useEffect(() => {
    if (triggerAction) {
      sendToUnity(triggerAction, true);
    }
  }, [triggerAction]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Ici viendra ton composant :
        <UnityView style={StyleSheet.absoluteFill} onMessage={(e) => {
          if(e.nativeEvent.message === 'action_finished') isAnimatingAction.current = false;
        }} /> 
      */}
    </View>
  );
}
