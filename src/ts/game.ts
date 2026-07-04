import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithoutText } from "./helpers.js";
import { createImageElement } from "./helpers.js";
import { createPlayerScoreWrapper } from "./helpers.js";

import {
  ThemeId,
  Settings,
  Player,
} from "../interfaces/settings-data.interface.js";

let currentSettings = {} as Settings;
let currentPlayer: Player = "blue";
let currentTheme: ThemeId = "codeVibes";

function init() {
  loadData();
  initializeGameData();
}

function getThemeData() {
  return themes[currentTheme];
}

function loadData() {
  const data = localStorage.getItem("settings");
  if (data) {
    const settings = JSON.parse(data) as Settings;
    currentSettings = settings;
    console.log("aktuelle Settings: ", settings);
  }
}

function initializeGameData() {
  currentPlayer = currentSettings.player ?? "blue";
  currentTheme = currentSettings.theme ?? "codeVibes";
  const numberOfCards: number = +currentSettings.size / 2 || 8;
  console.log("aktueller Spieler: ", currentPlayer);
  console.log("aktuelles Thema: ", currentTheme);
  console.log("numberOfCards: ", numberOfCards);
  applyThemeStyles();
  renderHeader();
  renderCurrentTheme(numberOfCards);
}

function applyThemeStyles() {
  const themeData = getThemeData();
  if (!themeData) return;
  const gameSection = document.querySelector("#game_field");
  if (!gameSection) return;
  const allGameBackgrounds = Object.values(themes).map((theme) => theme.gameBackground);
  gameSection.classList.remove(...allGameBackgrounds);
  gameSection.classList.add(themeData.gameBackground);
  const allBodyClasses = Object.values(themes).map((theme) => theme.bodyClass);
  document.body.classList.remove(...allBodyClasses);
  document.body.classList.add(themeData.bodyClass);
}

function applyHeaderStyles() {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  const allHeaderClasses = Object.values(themes).map((theme) => theme.headerClass);
  header.classList.remove(...allHeaderClasses);
  header.classList.add(themeData.headerClass);
}

function renderCurrentTheme(numberOfPairs: number) {
  const gameField = document.querySelector("#game_field");
  if (!gameField) return;
  const themeData = themes[currentTheme];
  if (!themeData) return;
  gameField.innerHTML = "";
  const selectedMotifs = themeData.motifs.slice(0, numberOfPairs);
  const cardMotifs = [...selectedMotifs, ...selectedMotifs];
  const shuffledCards = shuffleCards(cardMotifs);
  for (const imgPath of shuffledCards) {
    const card = createElementWithoutText("div", ["card", themeData.cardBackground], null);
    const imgObj = createImageElement(`/assets/img/${themeData.id}/`, imgPath);
    card.append(imgObj);
    gameField.append(card);
  }
}

function renderHeader() {
  applyHeaderStyles();
  renderScores();
  renderCurrentPlayer();
  renderExitBtn();
}

function renderScores() {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  const oldScoreWrapper = header.querySelector(".score-wrapper");
  if (oldScoreWrapper) oldScoreWrapper.remove();
  const scoreWrapper = createElementWithoutText("section", ["score-wrapper"], null);
  const bluePlayerScoreWrapper = createPlayerScoreWrapper("blue", themeData.playerIcons.blue);
  const orangePlayerScoreWrapper = createPlayerScoreWrapper("orange", themeData.playerIcons.orange);
  scoreWrapper.append(bluePlayerScoreWrapper, orangePlayerScoreWrapper);
  header.prepend(scoreWrapper);
}

function renderCurrentPlayer() {
  const currentPlayerElement = document.querySelector("#current_player");
  if (!currentPlayerElement) return;
  const themeData = getThemeData();
  if (!themeData) return;
  currentPlayerElement.textContent = "";
  const iconPath = themeData.playerIcons[currentPlayer];
  const playerText = document.createElement("span");
  playerText.textContent = "Current player: ";
  const playerIcon = createImageElement("/assets/img/ui/", iconPath);
  currentPlayerElement.append(playerText, playerIcon);
}

function renderExitBtn() {
  const exitBtn = document.querySelector("#exit_btn");
  if (!exitBtn) return;
  exitBtn.textContent = "";
  const iconPath = "exit.svg";
  const button = createImageElement("/assets/img/ui/", iconPath);
  const exitText = document.createElement("span");
  exitText.textContent = "Exit";
  exitBtn.append(button, exitText);
}

function shuffleCards(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

init();