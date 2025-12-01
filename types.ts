
export enum TrigFunction {
  SIN = 'SIN',
  COS = 'COS',
  TAN = 'TAN'
}

export interface MathState {
  angle: number; // in radians
  isPlaying: boolean;
  speed: number;
  selectedFunction: TrigFunction;
}

export interface ExplanationResponse {
  markdown: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<boolean>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
