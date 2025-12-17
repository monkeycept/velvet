export enum AppMode {
  VIBE = 'VIBE',
  DATES = 'DATES',
  MUSE = 'MUSE'
}

export interface VibeData {
  summary: string;
  keywords: string[];
  description: string;
  colorPalette: string[];
}

export interface DateSpot {
  name: string;
  description: string;
  address?: string;
  rating?: string;
  mapLink?: string;
}

export interface MuseContent {
  type: 'poem' | 'story' | 'question';
  text: string;
}
