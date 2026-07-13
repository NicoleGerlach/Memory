import "../styles/entries/global.scss";
import "../styles/entries/settings.scss";

import { settingsData } from "./data.js";
import {
  ThemeId,
  Player,
  BoardSize,
  Settings,
  SettingsData,
} from "../interfaces/settings-data.interface.js";
import {
  createElementWithText,
  createElementWithoutText,
  createImageElement,
  createList,
  getBoardSizeSelection,
  getPlayerSelection,
  getThemeSelection,
} from "./helpers.js";

function init() {
  renderSettings();
  setEventListeners();
}

function setEventListeners() {
  const settingsBox = document.querySelector("#settings_box");
  const settingsForm = document.querySelector("#settings_form");

  settingsBox?.addEventListener("change", handleSelectionChanges);
  settingsForm?.addEventListener("submit", handleSubmitEvent);
}

function handleSelectionChanges(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedItem = target.value as ThemeId | Player | BoardSize;
  console.log("Target: ", target);
  console.log("Target-Value: ", selectedItem);

  if (target.name === "game-theme") {
    renderPreviewImage(selectedItem as ThemeId);
  }

  updateSettingsSelection(target, selectedItem);
}

function updateSettingsSelection(
  target: HTMLInputElement,
  selectedItem: ThemeId | Player | BoardSize,
) {
  const currentThemeBox = document.querySelector("#current_theme");
  const currentPlayerBox = document.querySelector("#current_player");
  const currentSizeBox = document.querySelector("#current_board_size");
  console.log("Themenbox: ", currentThemeBox);
  if (!currentThemeBox || !currentPlayerBox || !currentSizeBox) return;
  if (target.name === "game-theme") {
    currentThemeBox.textContent = getThemeSelection(selectedItem as ThemeId);
  }
  if (target.name === "player") {
    currentPlayerBox.textContent = getPlayerSelection(selectedItem as Player);
  }
  if (target.name === "board-size") {
    currentSizeBox.textContent = getBoardSizeSelection(selectedItem as BoardSize);
  }
}

function renderSettings() {
  const settingsBox = document.querySelector("#settings_box");
  if (!settingsBox) return;
  for (const sectionData of settingsData) {
    console.log("SectionData: ", sectionData);
    const section = renderSettingsBox(sectionData as SettingsData);
    settingsBox.append(section);
  }
}

function renderSettingsBox(data: SettingsData): HTMLElement {
  const box = createElementWithoutText("section", [`${data.type}-box`], null);
  const titleWrapper = createElementWithoutText(
    "span",
    ["title-wrapper"],
    null,
  );
  const img = createImageElement("/assets/img/ui/", data.iconPath, null);
  const title = createElementWithText(
    "h2",
    [`${data.type}-title`],
    null,
    data.title,
  );

  titleWrapper.append(img, title);

  const list = createList(
    `${data.type}-list`,
    "list-element",
    data.items,
    data.radioName,
  );

  box.append(titleWrapper, list);

  return box;
}

function renderPreviewImage(selectedTheme: string) {
  // const target = event.target as HTMLInputElement;
  const previewImage = document.querySelector(
    "#preview_img",
  ) as HTMLImageElement;
  if (previewImage) {
    previewImage.setAttribute(
      "src",
      `/assets/img/ui/previews/${selectedTheme}.svg`,
    );
    console.log("Preview-Img: ", previewImage);
  }
}

function handleSubmitEvent(event: any) {
  event.preventDefault();
  const themeInput = document.querySelector(
    'input[name="game-theme"]:checked',
  ) as HTMLInputElement | null;
  const playerInput = document.querySelector(
    'input[name="player"]:checked',
  ) as HTMLInputElement | null;
  const sizeInput = document.querySelector(
    'input[name="board-size"]:checked',
  ) as HTMLInputElement | null;
  if (!themeInput || !playerInput || !sizeInput) {
    console.error("Nicht alle Einstellungen gewählt");
    return;
  }

  const currentSettings: Settings = {
    theme: themeInput?.value as ThemeId,
    player: playerInput?.value as Player,
    selectedPlayer: playerInput?.value as Player,
    size: sizeInput?.value as BoardSize,
    points: {
      pointsBlue: 0,
      pointsOrange: 0,
    }
  };
  console.log("Spiel gestartet", currentSettings);
  saveCurrentSettings(currentSettings);
  leadToGamePage();
}

function saveCurrentSettings(currentSettings: Settings) {
  console.log(currentSettings);
  localStorage.setItem("settings", JSON.stringify(currentSettings));
}

function leadToGamePage() {
  location.href = "/game.html";
}

init();