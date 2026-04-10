import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

export function Companion({ triggerAction, seriesPercent }) {
  const group = useRef();
  // Remplace par le chemin réel de ton export Blender
  const { animations, scene } = useGLTF(
    require("../../assets/models/companion.glb"),
  );
  const { actions } = useAnimations(animations, group);
  const [currentAction, setCurrentAction] = useState("");

  const getBaseIdle = (percent: number) => {
    if (percent >= 100) return "idle_surexite";
    if (percent >= 70) return "idle_content";
    if (percent >= 50) return "idle_normal";
    if (percent >= 25) return "idle_triste";
    return "idle_depress";
  };

  const playTransition = (name: string, isOneShot = false) => {
    if (!actions[name]) return;

    const prevAction = actions[currentAction];
    const nextAction = actions[name];

    if (prevAction && prevAction !== nextAction) prevAction.fadeOut(0.5);

    nextAction.reset().fadeIn(0.5).play();

    if (isOneShot) {
      setTimeout(
        () => {
          playTransition(getBaseIdle(seriesPercent), false);
        },
        nextAction.getClip().duration * 1000 - 500,
      );
    }
    setCurrentAction(name);
  };

  // Switch d'Idle auto si la série change
  useEffect(() => {
    if (!triggerAction) playTransition(getBaseIdle(seriesPercent));
  }, [seriesPercent]);

  // Déclenchement d'une action spéciale
  useEffect(() => {
    if (triggerAction) playTransition(triggerAction, true);
  }, [triggerAction]);

  return (
    <primitive ref={group} object={scene} position={[0, -1.5, 0]} scale={2.2} />
  );
}
