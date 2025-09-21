import React, { useEffect, useMemo, useState } from "react";
import { PixelAvatar } from "./PixelAvatar";
import { type AvatarDNA, DEFAULT_DNA } from "./types";
import {
  AVATAR_EVENT,
  loadAvatarDNA,
  normalizeDNA,
  randomizeAvatar,
} from "./helpers";

export type AvatarPreviewProps = {
  size?: number;
  className?: string;
  dna?: AvatarDNA;
  seed?: string;
  generic?: boolean;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  size = 128,
  className,
  dna,
  seed,
  generic = false,
}) => {
  const seededDNA = useMemo(() => {
    if (dna) return dna;
    if (seed) return randomizeAvatar(seed);
    if (generic) return DEFAULT_DNA;
    return loadAvatarDNA();
  }, [dna, seed, generic]);

  const [liveDNA, setLiveDNA] = useState<AvatarDNA>(seededDNA);

  useEffect(() => {
    setLiveDNA(seededDNA);
  }, [seededDNA]);

  useEffect(() => {
    if (dna || seed || generic || !isBrowser()) return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<AvatarDNA | undefined>).detail;
      if (detail) {
        setLiveDNA(normalizeDNA(detail));
      } else {
        setLiveDNA(loadAvatarDNA());
      }
    };
    window.addEventListener(AVATAR_EVENT, handler as EventListener);
    return () => window.removeEventListener(AVATAR_EVENT, handler as EventListener);
  }, [dna, seed, generic]);

  return <PixelAvatar dna={liveDNA} size={size} className={className} />;
};
