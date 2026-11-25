"use client";
import { useEffect } from "react";
import { createSceneScope } from "@/shared/lib/scene-scope";
import { mountJourney } from "./journey";
import { mountArchive } from "./archive";
import { mountFinale } from "@/widgets/download-section/motion";

export function LandingMotion() {
  useEffect(() => {
    const scope = createSceneScope();
    try {
      mountArchive(scope);
      mountJourney(scope);
      mountFinale(scope);
    } catch (error) {
      scope.dispose();
      throw error;
    }
    return () => scope.dispose();
  }, []);
  return null;
}
