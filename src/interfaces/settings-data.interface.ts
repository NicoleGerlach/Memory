export interface SettingsData {
  type: string;
  title: string;
  iconPath: string;
  radioName: string;
  items: SettingsItem[];
}

export interface SettingsItem {
  id: string;
  label: string;

  // id: ThemeId;
  // label: ThemeName;
}


export type ThemeId = "codeVibes" | "gaming" | "daProjects" | "food";
export type ThemeName = "Code vibes theme" | "Gaming theme" | "DA Projects theme" | "Food theme";
export type Player = "blue" | "orange";
export type BoardSize = "16" | "24" | "36";

export interface Settings {
  theme: ThemeId;
  player: Player;
  size: BoardSize;
}