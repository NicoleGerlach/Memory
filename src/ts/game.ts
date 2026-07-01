import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithText } from "./helpers.js";
import { createElementWithoutText } from "./helpers.js";
import { createImageElement } from "./helpers.js";
import { createPlayerScoreWrapper } from "./helpers.js";

import {
  ThemeId,
  Settings,
  Player,
  ThemeName,
} from "../interfaces/settings-data.interface.js";

let currentSettings = {} as Settings;
let currentPlayer: Player = "blue";
let currentTheme: ThemeId = "codeVibes";

async function init() {
  loadData();
  initializeGameData();
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
  currentPlayer = currentSettings.player as Player;
  currentTheme = currentSettings.theme as ThemeId;
  console.log("Hallo: ", currentSettings.theme as ThemeName);
  const numberOfCards: number = +currentSettings.size / 2;
  console.log("aktueller Spieler: ", currentPlayer);
  console.log("aktuelles Thema: ", currentTheme);
  console.log("numberOfCards: ", numberOfCards);
  renderCurrentTheme();
  renderHeader();
}

function renderCurrentTheme() {
  const gameField = document.querySelector("#game_field");
  console.log("GameField:", gameField); 
  if (!gameField) return;
  console.log("Theme in renderCurrentTheme: ", currentTheme);
  for (let i = 0; i < themes[`${currentTheme}`].motifs.length; i++) {
    const imgPath = themes[`${currentTheme}`].motifs[i];
    const imgObj = createImageElement(
       "/assets/img/code/", imgPath);

    gameField.append(imgObj);
  }
}

function renderHeader() {
  renderScores();
  renderCurrentPlayer();
  renderExitBtn();
}

function renderScores() {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const scoreWrapper = createElementWithoutText("section", ["score-wrapper"], null,);
  const bluePlayerScoreWrapper = createPlayerScoreWrapper("blue", "code_blue.svg",);
  const orangePlayerScoreWrapper = createPlayerScoreWrapper("orange", "code_orange.svg",);
  scoreWrapper.append(bluePlayerScoreWrapper, orangePlayerScoreWrapper);
  console.log(scoreWrapper);
  header.prepend(scoreWrapper);
}

function renderCurrentPlayer() {
  const currentPlayerElement = document.querySelector("#current_player");
  if (!currentPlayerElement) return;
  currentPlayerElement.textContent = "";
  const iconPath = currentPlayer === "blue" ? "code_blue.svg" : "code_orange.svg";
  const playerIcon = createImageElement("/assets/img/ui/", iconPath);
  const playerText = document.createElement("span");
  playerText.textContent = 'Current player: ';
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

init();