
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
  scoreWrapperClass: string;
  exitBtnClass: string;
  gameBackground: string;
  cardStyle: string;
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
  winBlue: string;
  winOrange: string;
  draw: string;
  decoration: string;
}