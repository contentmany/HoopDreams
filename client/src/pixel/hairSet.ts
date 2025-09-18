export type HairDef = { id: string; label: string; front: string; back?: string; tintable?: boolean; };
export const HAIR_SET: HairDef[] = [
  { id: "dreads_short",  label: "Dreads (Short)",  front: "/sprites/pixel/hair/dreads_short_front.png",  back: "/sprites/pixel/hair/dreads_short_back.png",  tintable: true },
  { id: "dreads_medium", label: "Dreads (Medium)", front: "/sprites/pixel/hair/dreads_medium_front.png", back: "/sprites/pixel/hair/dreads_medium_back.png", tintable: true },
  { id: "waves", label: "Waves", front: "/sprites/pixel/hair/waves_front.png", tintable: true },
  { id: "buzz",  label: "Buzz",  front: "/sprites/pixel/hair/buzz_front.png",  tintable: true },
  { id: "afro",  label: "Afro",  front: "/sprites/pixel/hair/afro_front.png",  tintable: true },
];
