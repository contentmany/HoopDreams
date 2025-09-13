// Global window type extensions for avatar system
declare global {
  interface Window {
    AvatarKit: {
      render: (canvas: HTMLCanvasElement, dna: any) => void;
      randomDNA: (seed: string) => any;
    };
    AvatarHooks: {
      mountCustomize: () => void;
      attachImgCanvas: (selector: string, size?: number) => void;
      npcIntoCanvas: (canvas: HTMLCanvasElement, seed: string, size?: number) => void;
    };
  }
}

export {};