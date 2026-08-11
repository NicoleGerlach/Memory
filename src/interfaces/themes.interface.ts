
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
  playerIcon: string;
  previewPath: string;
  exitModalClass: string;
  exitTextClass: string;
  exitCancelBtn: string;
  exitConfirmBtn: string;
  exitCancelBtnClass: string;
  exitConfirmBtnClass: string;
  motifs: string[];
  winnerIcons: WinnerIcons;
}

export interface WinnerIcons {
  winBlue: string;
  winOrange: string;
  draw: string;
  decoration: string;
}