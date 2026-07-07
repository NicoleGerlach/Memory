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

type SelectedCard = {
  field: HTMLElement;
  button: HTMLElement
}

let currentSettings = {} as Settings;
let currentPlayer: Player = "blue";
let currentTheme: ThemeId = "codeVibes";

let firstCard: HTMLElement | null;
let secondCard: HTMLElement | null;
let isChecking = false;

function init() {
  loadData();
  initializeGameData();
  flipCard();
  generateIds(+currentSettings.size);
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
  const numberOfCards: number = +currentSettings.size / 2 || 8 || 12 || 18;
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
  const numberOfCards: number = +currentSettings.size;
  const cardIds = generateIds(numberOfCards);
  let idx = 0;
  for (const imgPath of shuffledCards) {
    const currentId = cardIds[idx] ?? "";
    const field = createElementWithoutText("section", ["field"], null);
    if (currentId) field.id = currentId;

    field.dataset.pairId = imgPath.replace(".svg", "");

    const button = createElementWithoutText("button", ["card-button"], null);
    const box = createElementWithoutText("div", ["card-button__inner"], null);
    const imgObj = createImageElement(`/assets/img/${themeData.id}/`, imgPath, ["card-button__face", "card-button__face--back", themeData.cardBackground]);
    const imgBack = createImageElement(`/assets/img/${themeData.id}/`, "back.svg", ["card-button__face"]);
    gameField.append(field);
    field.append(button);
    button.append(box);
    box.append(imgBack, imgObj);
    idx++;
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
  const playerIcon = createImageElement("/assets/img/ui/", iconPath, null);
  currentPlayerElement.append(playerText, playerIcon);
}

function renderExitBtn() {
  const exitBtn = document.querySelector("#exit_btn");
  if (!exitBtn) return;
  exitBtn.textContent = "";
  const iconPath = "exit.svg";
  const button = createImageElement("/assets/img/ui/", iconPath, null);
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

function flipCard() {
  document.addEventListener("click", (e) => {
    if (isChecking) return;
    const target = e.target as HTMLElement;
    const button = target.closest(".card-button") as HTMLElement | null;
    const field = target.closest(".field") as HTMLElement | null;
    if (!button || !field) return;
    if (button.classList.contains("is-flipped")) return;
    button.classList.add("is-flipped");
    if (!firstCard) {
      firstCard = createSelectedCard(field, button);
      console.log("Erste Karte:", firstCard.field.dataset.pairId);
      return;
    }
    if (!secondCard && field !== firstCard.field) {
      secondCard = createSelectedCard(field, button);
      console.log("Zweite Karte:", secondCard.field.dataset.pairId);
      isChecking = true;
      compareCards();
    }
  });
}

function generateIds(numberOfCards: number): string[] {
  const ids: string[] = [];
  for (let i = 0; i < numberOfCards; i++) {
    ids.push(`card-${i + 1}`);
  }
  return ids;
}

function createSelectedCard (field: HTMLElement, button: HTMLElement): SelectedCard {
  return {field, button};
}

function isMatch(cardOne: SelectedCard, cardTwo: SelectedCard): boolean {
  return cardOne.field.dataset.pairId === cardTwo.field.dataset.pairId;
}

function applyMatchStyles(card: SelectedCard, themeData: any) {
  card.field.classList.add(themeData.cardMatchBorder, themeData.cardMatchBackground, themeData.cardMatchShadow);
}

function unflipCards(cardOne: SelectedCard, cardTwo: SelectedCard) {
  cardOne.field.classList.remove("is-flipped");
  cardTwo.field.classList.remove("is-flipped");
}

function resetSelectedCards() {
  firstCard = null;
  secondCard = null;
}

function compareCards() {
  const themeData = getThemeData();
  if (!themeData || !firstCard || !secondCard) return;
  if (isMatch(firstCard, secondCard)) {
    console.log("Karten stimmen ueberein!");
    applyMatchStyles(firstCard, themeData);
    applyMatchStyles(secondCard, themeData);
    resetSelectedCards();
    isChecking = false;
  } else {
    console.log("Karten stimmen nicht ueberein!");
    setTimeout(() => {
      if (firstCard && secondCard) {
        unflipCards(firstCard, secondCard);
      }
      resetSelectedCards();
      isChecking = false;
    }, 1000);
  }
}

init();