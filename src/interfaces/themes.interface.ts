import { Player } from "./settings-data.interface.js";

export interface Themes {
  "Code vibes": ThemeData;
  Gaming: ThemeData;
  "DA Projects": ThemeData;
  Food: ThemeData;
}

export interface ThemeData {
  id: string;
  label: string;
  bodyClass: string;
  headerClass: string;
  gameBackground: string;
  gameOverBackground: string;
  winnerBackground: string;
  cardBackground: string;
  playerIcons: PlayerIcons;
  previewPath: string;
  motifs: string[];
  winnerIcons: WinnerIcons;
}


export interface PlayerIcons {
  blue: string;
  orange: string;
}


export interface WinnerIcons {
  win: string;
  draw: string;
  decoration: string;
}