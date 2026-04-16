import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

interface CompanionProps {
  triggerAction: string | null;
  seriesPercent: number;
}

export function Companion({ triggerAction, seriesPercent }: CompanionProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Logique pour déterminer l'idle de série selon le pourcentage
  const getSeriesIdle = (percent: number) => {
    if (percent >= 100) return "idle_surexite";
    if (percent >= 70) return "idle_contant";
    if (percent >= 50) return "idle_normal";
    if (percent >= 25) return "idle_triste";
    return "idle_depress";
  };

  const resetSeriesTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Timer de 3 minutes (180 000 ms)
    timerRef.current = setTimeout(() => {
      const seriesAnim = getSeriesIdle(seriesPercent);
      console.log(`[Unity] Envoi de l'animation de série : ${seriesAnim}`);
      // Ici sera ajouté : UnityModule.postMessage('GameObject', 'PlayAnimation', seriesAnim);
    }, 180000);
  };

  useEffect(() => {
    resetSeriesTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [seriesPercent]);

  useEffect(() => {
    if (triggerAction) {
      console.log(`[Unity] Envoi de l'action : ${triggerAction}`);
      // Ici sera ajouté : UnityModule.postMessage('GameObject', 'PlayAnimation', triggerAction);
      resetSeriesTimer();
    }
  }, [triggerAction]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Le composant <UnityView /> sera intégré ici 
          une fois la bibliothèque installée.
      */}
    </View>
  );
}
