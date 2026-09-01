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

function init(): void {
  renderSettings();
  applyStoredSettings();
  setEventListeners();
  toggleListHover();
}

/** Attaches two event listeners.
 * If #settings_box exists, changes trigger handleSelectionChanges.
 * If #settings_form exists, submitting triggers handleSubmitEvent. */
function setEventListeners(): void {
  const settingsBox = document.querySelector("#settings_box");
  const settingsForm = document.querySelector("#settings_form");
  settingsBox?.addEventListener("change", handleSelectionChanges);
  settingsForm?.addEventListener("submit", handleSubmitEvent);
}

/** Renders the preview image according to the theme.
 * Finally updates the settings selection. */
function handleSelectionChanges(event: Event): void {
  const target = event.target as HTMLInputElement;
  const selectedItem = target.value as ThemeId | Player | BoardSize;
  if (target.name === "game-theme") {
    renderPreviewImage(selectedItem as ThemeId);
  }
  updateSettingsSelection(target, selectedItem);
}

/** Updates the displayed current selection based on the changed target.
 * Reads the current Theme, Player, or BoardSize selection and updates the corresponding them.
 * Enable the Start button if applicable and updates the separator state. */
function updateSettingsSelection(target: HTMLInputElement, selectedItem: ThemeId | Player | BoardSize): void {
  const currentThemeBox = document.querySelector("#current_theme");
  const currentPlayerBox = document.querySelector("#current_player");
  const currentSizeBox = document.querySelector("#current_board_size");
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
  activateStartBtn();
  updateSeparatorState();
}

/** Iterates over settingsData, renders each entry into a section viarenderSettingsBox, and appends it to the container. */
function renderSettings(): void {
  const settingsBox = document.querySelector("#settings_box");
  if (!settingsBox) return;
  for (const sectionData of settingsData) {
    const section = renderSettingsBox(sectionData as SettingsData);
    settingsBox.append(section);
  }
}

/** Creates a section with class, a title-wrapper containing, a list and returns the full element. */
function renderSettingsBox(data: SettingsData): HTMLElement {
  const box = createElementWithoutText("section", [`${data.type}-box`], null);
  const titleWrapper = createElementWithoutText("span", ["title-wrapper"], null);
  const img = createImageElement("/assets/img/ui/", data.iconPath, null);
  const title = createElementWithText("h2", [`${data.type}-title`], null, data.title);
  titleWrapper.append(img, title);
  const list = createList(`${data.type}-list`, "list-element", data.items, data.radioName);
  box.append(titleWrapper, list);
  return box;
}

/** Renders a preview image based on the selected theme. */
function renderPreviewImage(selectedTheme: string): void {
  const previewImage = document.querySelector(
    "#preview_img",
  ) as HTMLImageElement;
  if (previewImage) {
    previewImage.setAttribute(
      "src",
      `/assets/img/ui/previews/${selectedTheme}.svg`,
    );
  }
}

/** Reads values from three input elements and builds a Settings object.
 * The return includes theme, player, selectedPlayer, size and initialized points. */
function readSettingsFromInputs(
  themeInput: HTMLInputElement | null,
  playerInput: HTMLInputElement | null,
  sizeInput: HTMLInputElement | null
): Settings | null {
  if (!themeInput || !playerInput || !sizeInput) return null;
  return {
    theme: themeInput.value as ThemeId,
    player: playerInput.value as Player,
    selectedPlayer: playerInput.value as Player,
    size: sizeInput.value as BoardSize,
    points: { pointsBlue: 0, pointsOrange: 0 },
  };
}

/** Handles form submit: gathers selections, validates, saves, and navigates to the game page. */
function handleSubmitEvent(event: Event) {
  event.preventDefault();
  const themeInput = document.querySelector<HTMLInputElement>('input[name="game-theme"]:checked');
  const playerInput = document.querySelector<HTMLInputElement>('input[name="player"]:checked');
  const sizeInput = document.querySelector<HTMLInputElement>('input[name="board-size"]:checked');
  const currentSettings = readSettingsFromInputs(themeInput, playerInput, sizeInput);
  if (!currentSettings) {
    return;
  }
  saveCurrentSettings(currentSettings);
  leadToGamePage();
}

/** Returns the value of the currently selected radio button for the given name. */
function getSelectedValue(radioName: string): string | null {
  const el = document.querySelector(
    `input[name="${radioName}"]:checked`
  ) as HTMLInputElement | null;
  return el ? el.value : null;
}

/** Enables the start button based on whether theme, player, and board size are selected. */
function activateStartBtn(): void {
  const selectedTheme = getSelectedValue('game-theme');
  const selectedPlayer = getSelectedValue('player');
  const selectedBoard = getSelectedValue('board-size');
  const btn = document.querySelector('#start_btn') as HTMLButtonElement | null;
  if (!btn) return;
  btn.disabled = !(selectedTheme && selectedPlayer && selectedBoard);
  if (selectedTheme && selectedPlayer && selectedBoard) {
    btn.classList.remove("disabled-btn");
  }
}

/** Updates separators and diamonds.
 * If a player/board is selected, the corresponding separators are made smaller;
 * if a player/board is selected, the corresponding diamonds are shown. */
function updateSeparatorState(): void {
  const selectedPlayer = getSelectedValue("player");
  const selectedBoard = getSelectedValue("board-size");
  const sep1 = document.querySelector(".sep1");
  const sep2 = document.querySelector(".sep2");
  const diamondPlayer = document.querySelector("#diamond-player");
  const diamondBoard = document.querySelector("#diamond-board");
  if (sep1 && selectedPlayer) { sep1.classList.add("separator-small"); }
  if (sep2 && selectedBoard) { sep2.classList.add("separator-small"); }
  if (diamondPlayer && selectedPlayer) { diamondPlayer.classList.remove("d-none"); }
  if (diamondBoard && selectedBoard) { diamondBoard.classList.remove("d-none"); }
}

function saveCurrentSettings(currentSettings: Settings): void {
  localStorage.setItem("settings", JSON.stringify(currentSettings));
}

function leadToGamePage(): void {
  location.href = "/game.html";
}

function clearHoveredItems(items: NodeListOf<HTMLElement>): void {
  items.forEach((el) => el.classList.remove("is-hovered"));
}

/** Clears the hover state from all items, marks the list with has-hover, and highlights the current item with is-hovered. */
function handleListEnter(list: HTMLElement, item: HTMLElement, items: NodeListOf<HTMLElement>): void {
  clearHoveredItems(items);
  list.classList.add("has-hover");
  item.classList.add("is-hovered");
  const input = item.querySelector('input[name="game-theme"]') as HTMLInputElement | null;
  if (input) {
    renderPreviewImage(input.value);
  }
}

/** Clears the hover state when the mouse leaves the list and removes the has-hover class. */
function handleListLeave(list: HTMLElement, items: NodeListOf<HTMLElement>, e: MouseEvent): void {
  const relatedTarget = e.relatedTarget as Node | null;
  if (relatedTarget && list.contains(relatedTarget)) return;
  clearHoveredItems(items);
  list.classList.remove("has-hover");
  const selectedTheme = document.querySelector(
    'input[name="game-theme"]:checked'
  ) as HTMLInputElement | null;
  if (selectedTheme) {
    renderPreviewImage(selectedTheme.value);
  }
}

/** Registers mouseenter/mouseleave handlers for all list elemnts
 * and calls handleListEnter / handleListLeave for each list item. */
function toggleListHover(): void {
  const lists = document.querySelectorAll<HTMLElement>(".theme-list");
  lists.forEach((list) => {
    const items = list.querySelectorAll<HTMLElement>(".list-element");
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => handleListEnter(list, item, items));
      item.addEventListener("mouseleave", (e) => handleListLeave(list, items, e));
    });
  });
}


/** Loads stored settings from localStorage, applies them, and renders a preview if a theme is set. */
function applyStoredSettings(): void {
  const shouldRestore = sessionStorage.getItem("restoreSettings");
  if (shouldRestore !== "true") return;
  const data = localStorage.getItem("settings");
  if (!data) return;
  const settings = JSON.parse(data) as Settings;
  applySavedSettings(settings);
  if (settings.theme) {
    renderPreviewImage(settings.theme);
  }
  sessionStorage.removeItem("restoreSettings");
}

/** Retrieves the three input elements based on the settings values and returns them as an object. */
function teestkürzung(settings: Settings) {
  const themeInput = document.querySelector(`input[name="game-theme"][value="${settings.theme}"]`) as HTMLInputElement | null;
  const playerInput = document.querySelector(`input[name="player"][value="${settings.player}"]`) as HTMLInputElement | null;
  const sizeInput = document.querySelector(`input[name="board-size"][value="${settings.size}"]`) as HTMLInputElement | null;
  return { themeInput, playerInput, sizeInput };
} 

/** Applies the stored settings to the corresponding inputs, checks them, and updates the selection. */
function applySavedSettings(settings: Settings): void {
  const { themeInput, playerInput, sizeInput } = teestkürzung(settings);
  if (themeInput) {
    themeInput.checked = true;
    updateSettingsSelection(themeInput, settings.theme);
  }
  if (playerInput) {
    playerInput.checked = true;
    updateSettingsSelection(playerInput, settings.player);
  }
  if (sizeInput) {
    sizeInput.checked = true;
    updateSettingsSelection(sizeInput, settings.size);
  }
}

init();