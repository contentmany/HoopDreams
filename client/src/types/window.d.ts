// Global window type extensions for avatar system
declare global {
  interface Window {
    AvatarKit: {
      render: (canvas: HTMLCanvasElement, dna: any) => void;
      randomDNA: (seed: string) => any;
    };
  }
}

export {};