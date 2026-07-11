import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithoutText } from "./helpers.js";
import { createImageElement } from "./helpers.js";
import { createPlayerScoreWrapper } from "./helpers.js";
import { CardData } from "../interfaces/card.interface";

import {
  ThemeId,
  Settings,
  Player,
} from "../interfaces/settings-data.interface.js";

type SelectedCard = {
  field: HTMLElement;
  button: HTMLElement;
  cardData: CardData;
}

type Winner = "blue" | "orange" | "draw";

let currentSettings = {} as Settings;
let currentPlayer: Player = "blue";
let currentTheme: ThemeId = "codeVibes";
let firstCard: SelectedCard | null;
let secondCard: SelectedCard | null;
let isChecking: boolean = false;
let cards: CardData[] = [];

function init() {
  loadData();
  initializeGameData();
  flipCard();
  generateIds(+currentSettings.size);
  resetPoints();
}

function getThemeData() {
  return themes[currentTheme];
}

function loadData() {
  const data = localStorage.getItem("settings");
  if (data) {
    const settings = JSON.parse(data) as Settings;
    currentSettings = settings;
  }
}

function initializeGameData() {
  currentPlayer = currentSettings.player ?? "blue";
  currentTheme = currentSettings.theme ?? "codeVibes";
  const numberOfPairs = +currentSettings.size / 2;
  applyThemeStyles();
  renderHeader();
  renderCurrentTheme(numberOfPairs);
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

function createCards(numberOfPairs: number, motifs: string[]): CardData[] {
  const selectedMotifs = motifs.slice(0, numberOfPairs);
  const cardData: CardData[] = [];
  let idCounter = 1;
  selectedMotifs.forEach((motif, index) => {
    const pairId = index + 1;
    cardData.push({
      id: idCounter++,
      pairId,
      motif,
      isFlipped: false,
      isMatched: false,
    });
    cardData.push({
      id: idCounter++,
      pairId,
      motif,
      isFlipped: false,
      isMatched: false,
    });
  });
  return shuffleCards(cardData);
}
function renderCurrentTheme(numberOfPairs: number) {
  const gameField = document.querySelector("#game_field");
  if (!gameField) return;
  const themeData = themes[currentTheme];
  if (!themeData) return;
  gameField.innerHTML = "";
  cards = createCards(numberOfPairs, themeData.motifs);
  for (const card of cards) {
    const field = createElementWithoutText("section", ["field"], null);
    field.id = String(card.id);
    field.dataset.cardId = String(card.id);
    field.dataset.pairId = String(card.pairId);
    const button = createElementWithoutText("button", ["card-button"], null);
    if (card.isFlipped) {
      button.classList.add("is-flipped");
    }
    const box = createElementWithoutText("div", ["card-button__inner"], null);
    const imgObj = createImageElement(`/assets/img/${themeData.id}/`, card.motif, ["card-button__face", "card-button__face--back", themeData.cardBackground]);
    const imgBack = createImageElement(`/assets/img/${themeData.id}/`, "back.svg", ["card-button__face"]);
    gameField.append(field);
    field.append(button);
    button.append(box);
    box.append(imgBack, imgObj)
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
  const bluePlayerScoreWrapper = createPlayerScoreWrapper("blue", themeData.playerIcons.blue, currentSettings.points.pointsBlue);
  const orangePlayerScoreWrapper = createPlayerScoreWrapper("orange", themeData.playerIcons.orange, currentSettings.points.pointsOrange);
  scoreWrapper.append(bluePlayerScoreWrapper, orangePlayerScoreWrapper);
  header.prepend(scoreWrapper);
}

function renderCurrentPlayer() {
  const currentPlayerElement = document.querySelector("#current_player");
  if (!currentPlayerElement) return;
  const themeData = getThemeData();
  if (!themeData) return;
  const currentPlayer = currentSettings.player;
  const iconPath = themeData.playerIcons[currentPlayer];
  currentPlayerElement.textContent = "";
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

function shuffleCards(array: CardData[]): CardData[] {
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
    const selectedCard = createSelectedCard(field, button);
    if (selectedCard.cardData.isMatched || selectedCard.cardData.isFlipped) return;
    button.classList.add("is-flipped");
    selectedCard.cardData.isFlipped = true;
    if (!firstCard) {
      firstCard = selectedCard;
      return;
    }
    if (!secondCard && field !== firstCard.field) {
      secondCard = selectedCard;
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

function createSelectedCard(field: HTMLElement, button: HTMLElement): SelectedCard {
  const cardId = Number(field.dataset.cardId);
  const cardData = cards.find(card => card.id === cardId);
  if (!cardId) {
    throw new Error("Karte nicht gefunden");
  }
  return { field, button, cardData };
}

function isMatch(cardOne: SelectedCard, cardTwo: SelectedCard): boolean {
  return cardOne.cardData.pairId === cardTwo.cardData.pairId;
}

function applyMatchStyles(card: SelectedCard, themeData: any) {
  card.field.classList.add(themeData.cardMatchBorder, themeData.cardMatchBackground, themeData.cardMatchShadow);
}

function unflipCards(cardOne: SelectedCard, cardTwo: SelectedCard) {
  cardOne.button.classList.remove("is-flipped");
  cardTwo.button.classList.remove("is-flipped");
  cardOne.cardData.isFlipped = false;
  cardTwo.cardData.isFlipped = false;
}

function resetSelectedCards() {
  firstCard = null;
  secondCard = null;
}

function resetPoints() {
  currentSettings.points.pointsBlue = 0;
  currentSettings.points.pointsOrange = 0;
  renderScores();
}

function compareCards() {
  const themeData = getThemeData();
  if (!themeData || !firstCard || !secondCard) return;
  if (isMatch(firstCard, secondCard)) {
    firstCard.cardData.isMatched = true;
    secondCard.cardData.isMatched = true;
    applyMatchStyles(firstCard, themeData);
    applyMatchStyles(secondCard, themeData);
    countPoints();
    if (isGameOver(cards)) {
      endGame();
    }
    resetSelectedCards();
    isChecking = false;
  } else {
    setTimeout(() => {
      if (firstCard && secondCard) {
        unflipCards(firstCard, secondCard);
      }
      resetSelectedCards();
      changeCurrentPlayer();
      isChecking = false;
    }, 1000);
  }
}

function changeCurrentPlayer() {
  currentSettings.player =
  currentSettings.player === 'blue' ? 'orange' : 'blue';
  renderCurrentPlayer();
}

function countPoints() {
  if (currentSettings.player === 'blue') {
    currentSettings.points.pointsBlue++;
  } else if (currentSettings.player === 'orange') {
    currentSettings.points.pointsOrange++;
  }
  renderScores();
}

function isGameOver(cards: CardData[]): boolean {
  return cards.every(card => card.isMatched);
}

function endGame() {
  console.log("Das Spiel ist zu Ende!", getWinner());
}


function getWinner(): Winner {
  const bluePoints = currentSettings.points.pointsBlue;
  const orangePoints = currentSettings.points.pointsOrange;
  if (bluePoints > orangePoints) return "blue";
  if (orangePoints > bluePoints) return "orange";
  return "draw";
}


// function renderGameOverScreen() {
//   const themeData = getThemeData();
//   if (!themeData) return;
//   const winner = getWinner();
//   const endScreen = document.querySelector("#game_over_screen");
//   const resultText = document.querySelector("#game_over_text");
//   const resultIcon = document.querySelector("#game_over_icon") as HTMLImageElement | null;
//   if (!endScreen || !resultText || !resultIcon) return;
//   endScreen.classList.remove(
//     themeData.gameBackground,
//     themeData.gameOverBackground,
//     themeData.winnerBackground
//   );
//   if (winner === "draw") {
//     endScreen.classList.add(themeData.gameOverBackground);
//     resultText.textContent = "It's a draw!";
//     resultIcon.src = `/assets/img/ui/${themeData.winnerIcons.draw}`;
//     resultIcon.style.display = "block";
//     return;
//   }
//   endScreen.classList.add(themeData.winnerBackground);
//   resultText.textContent = `${winner} wins!`;
//   resultIcon.src = `/assets/img/ui/${themeData.winnerIcons.win}`;
//   resultIcon.style.display = "block";
// }

// function renderLoseScreen() {
//   const themeData = getThemeData();
//   if (!themeData) return;
//   const endScreen = document.querySelector("#game_over_screen");
//   const resultText = document.querySelector("#game_over_text");
//   const resultIcon = document.querySelector("#game_over_icon") as HTMLImageElement | null;
//   if (!endScreen || !resultText || !resultIcon) return;
//   endScreen.classList.remove(
//     themeData.gameBackground,
//     themeData.winnerBackground
//   );
//   endScreen.classList.add(themeData.gameOverBackground);
//   resultText.textContent = "Game Over";
//   resultIcon.style.display = "none";
// }


init();