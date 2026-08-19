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
  toggleListHover();
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
  updateSettingsSelection(target, selectedItem as ThemeId | Player);
}

function updateSettingsSelection(target: HTMLInputElement, selectedItem: ThemeId | Player) {
  const el = document.querySelector(`#current_${target.name}`);
  if (target.name === "game-theme") {
    if (el) el.textContent = getThemeSelection(selectedItem as ThemeId);
  } else if (target.name === "player") {
    if (el) el.textContent = getPlayerSelection(selectedItem as Player);
  } else if (target.name === "board-size") {
  }
  activateStartBtn();
  updateSeparatorState();
}

function renderSettings() {
  const settingsBox = document.querySelector("#settings_box");
  if (!settingsBox) return;
  for (const sectionData of settingsData) {
    const section = renderSettingsBox(sectionData as SettingsData);
    settingsBox.append(section);
  }
}

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

function renderPreviewImage(selectedTheme: string) {
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

function getSelectedValue(radioName: string): string | null {
  const el = document.querySelector(
    `input[name="${radioName}"]:checked`
  ) as HTMLInputElement | null;
  return el ? el.value : null;
}

function activateStartBtn() {
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

function updateSeparatorState(): void {
  const selectedPlayer = getSelectedValue("player");
  const selectedBoard = getSelectedValue("board-size");
  const sep1 = document.querySelector(".sep1");
  const sep2 = document.querySelector(".sep2");
  const diamondPlayer = document.querySelector("#diamond-player");
  const diamondBoard = document.querySelector("#diamond-board");
  if (sep1 && selectedPlayer) {sep1.classList.add("separator-small");}
  if (sep2 && selectedBoard) {sep2.classList.add("separator-small");}
  if (diamondPlayer && selectedPlayer) {diamondPlayer.classList.remove("d-none");}
  if (diamondBoard && selectedBoard) {diamondBoard.classList.remove("d-none");}
}

function saveCurrentSettings(currentSettings: Settings) {
  localStorage.setItem("settings", JSON.stringify(currentSettings));
}

function leadToGamePage() {
  location.href = "/game.html";
}

function toggleListHover() {
  const lists = document.querySelectorAll<HTMLElement>(".theme-list, .player-list, .size-list");
  lists.forEach((list) => {
    const items = list.querySelectorAll<HTMLElement>(".list-element");
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        items.forEach((el) => el.classList.remove("is-hovered"));
        list.classList.add("has-hover");
        item.classList.add("is-hovered");
      });
      item.addEventListener("mouseleave", (e) => {
        const relatedTarget = e.relatedTarget as Node | null;
        if (!relatedTarget || !list.contains(relatedTarget)) {
          items.forEach((el) => el.classList.remove("is-hovered"));
          list.classList.remove("has-hover");
        }
      });
    });
  });
}

init();