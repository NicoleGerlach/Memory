import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithoutText, createElementWithText } from "./helpers.js";
import { createImageElement } from "./helpers.js";
import { createSvgElement } from "./helpers.js";
import { createPlayerScoreWrapper } from "./helpers.js";
import { CardData } from "../interfaces/card.interface";

import { ThemeId, Player, Settings, PlayerPoints, BoardSize } from "../interfaces/settings-data.interface.js";
import { ThemeData } from "../interfaces/themes.interface";

type SelectedCard = {
  field: HTMLElement;
  button: HTMLElement;
  cardData: CardData;
}

type Winner = "blue" | "orange" | "draw";

let currentSettings = {} as Settings;
let activePlayer: Player = "blue";
let currentTheme: ThemeId = "codeVibes";
let firstCard: SelectedCard | null;
let secondCard: SelectedCard | null;
let isChecking: boolean = false;
let cards: CardData[] = [];

function init() {
  loadData();
  initializeGameData();
  createAndAppendExitOverlay();
  bindExitButton();
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
  activePlayer = currentSettings.player ?? "blue";
  currentTheme = currentSettings.theme ?? "codeVibes";
  if (!currentSettings.selectedPlayer) {
    currentSettings.selectedPlayer = currentSettings.player;
  }

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
  safeAddClasses(gameSection, themeData.gameBackground);
  const allBodyClasses = Object.values(themes).map((theme) => theme.bodyClass);
  document.body.classList.remove(...allBodyClasses);
  document.body.classList.add(themeData.bodyClass);
}

function applyHeaderStyles() {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  // const allHeaderClasses = Object.values(themes).map((theme) => theme.headerClass);
  // header.classList.remove(...allHeaderClasses);
  safeRemoveClasses(header, themeData.headerClass);
  safeAddClasses(header, themeData.headerClass);
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
    const imgBack = createImageElement(`/assets/img/${themeData.id}/`, "back.svg", ["card-button__face", themeData.cardStyle]);
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
  const scoreWrapper = createElementWithoutText("section", ["score-wrapper", themeData.scoreWrapperClass], null);
  const bluePlayerScoreWrapper = createPlayerScoreWrapper("blue", themeData.playerIcon, currentSettings.points.pointsBlue);
  const orangePlayerScoreWrapper = createPlayerScoreWrapper("orange", themeData.playerIcon, currentSettings.points.pointsOrange);
  scoreWrapper.append(bluePlayerScoreWrapper, orangePlayerScoreWrapper);
  header.prepend(scoreWrapper);
}

function renderCurrentPlayer() {
  const currentPlayerElement = document.querySelector("#current_player");
  if (!currentPlayerElement) return;
  const activePlayer = currentSettings.player;
  currentPlayerElement.textContent = "";
  const playerText = document.createElement("span");
  playerText.textContent = "Current player: ";
  const iconName = currentTheme === "codeVibes" ? "player-code.svg" : "player.svg";
  const playerSvg = createSvgElement(iconName, ["player-svg", activePlayer]);
  currentPlayerElement.append(playerText, playerSvg);
}

function renderExitBtn() {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  const exitWrapper = createElementWithoutText("section", ["exit-wrapper", "exit-btn"], null);
  const exitSvg = createSvgElement("exit.svg", ["exit-icon"]);
  const exitText = createElementWithText("p", ["exit-text"], null, "Exit game");
  header.append(exitWrapper);
  exitWrapper.append(exitSvg, exitText);
  exitWrapper.classList.add(themeData.exitBtnClass);
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
  if (!cardData) {
    throw new Error("Karte nicht gefunden");
  }
  return { field, button, cardData };
}

function isMatch(cardOne: SelectedCard, cardTwo: SelectedCard): boolean {
  return cardOne.cardData.pairId === cardTwo.cardData.pairId;
}

function applyMatchStyles(card: SelectedCard, themeData: any) {
  // BG auf das img (dort liegt auch card-bg-*)
  const img = card.button.querySelector(".card-button__face--back");
  if (img) {
    safeAddClasses(img, themeData.cardMatchBackground);
    if (themeData.cardBackground) {
      img.classList.remove(themeData.cardBackground);
    }
  }
  // Border und Shadow auf den Button
  safeAddClasses(card.button, themeData.cardMatchBorder, themeData.cardMatchShadow);
}

function safeAddClasses(element: Element, ...classes: (string | undefined | null)[]): void {
  const valid = classes
    .filter((c): c is string => Boolean(c) && typeof c === "string" && c.trim() !== "");

  if (valid.length) {
    element.classList.add(...valid);
  }
}

function safeRemoveClasses(element: Element, ...classes: (string | undefined | null)[]): void {
  const valid = classes
    .filter((c): c is string => Boolean(c) && typeof c === "string" && c.trim() !== "");

  if (valid.length) {
    element.classList.remove(...valid);
  }
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
      renderEndScreen();
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
  currentSettings.player = currentSettings.player === 'blue' ? 'orange' : 'blue';
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

function getWinner(): Winner {
  const bluePoints = currentSettings.points.pointsBlue;
  const orangePoints = currentSettings.points.pointsOrange;
  if (bluePoints > orangePoints) return "blue";
  if (orangePoints > bluePoints) return "orange";
  return "draw";
}

function renderEndScreen() {
  const winner = getWinner();
  const themeData = getThemeData();
  if (!themeData) return;
  const gameField = document.querySelector("#game_field");
  const header = document.querySelector("#game_header") as HTMLElement | null;
  if (!(gameField instanceof HTMLElement) || !(header instanceof HTMLElement)) return;
  gameField.innerHTML = "";
  header.innerHTML = "";
  safeRemoveClasses(gameField, themeData.gameBackground, themeData.gameOverBackground, themeData.winnerBackground);
  safeRemoveClasses(header, themeData.headerClass);
  const userPlayer = currentSettings.selectedPlayer;  // ← statt .player
  const isDraw = winner === "draw";
  const hasWon = winner === userPlayer;
  if (isDraw) {
    renderDrawView(gameField, header, themeData);
  } else if (hasWon) {
    renderWinView(gameField, header, themeData, winner);
  } else {
    renderLoseView(gameField, header, themeData);
  }
  backToStart();
}

function renderWinView(
  gameField: HTMLElement,
  header: HTMLElement,
  themeData: ThemeData,
  winner: "blue" | "orange",
) {
  gameField.classList.add(themeData.winnerBackground);
  const wrapper = createElementWithoutText("section", ["winner-wrapper"], null);
  const label = createElementWithText("span", ["winner-text"], null, "The winner is");
  const player = createElementWithText("span", ["winner-player"], null, `${winner} Player`);
  const winnerIcon = winner === "blue" ? themeData.winnerIcons.winBlue : themeData.winnerIcons.winOrange
  const img = createImageElement(`/assets/img/${themeData.id}/`, winnerIcon, ["winner-icon"]);
  const confetti = createImageElement("/assets/img/ui/", themeData.winnerIcons.decoration, ["confetti"]);
  gameField.append(wrapper);
  wrapper.append(label, player, img);
  safeAddClasses(header, themeData.gameBackground);
  header.append(confetti);
}

function renderLoseView(
  gameField: HTMLElement,
  header: HTMLElement,
  themeData: ThemeData,
) {
  const wrapper = createElementWithoutText("section", ["game-over-wrapper"], null);
  const gameOver = createElementWithText("span", ["game-over-text"], null, "Game Over");
  const finalScore = createElementWithText("span", ["game-over-score"], null, "Final score");
  const scoreWrapper = createElementWithoutText("section", ["score-wrapper"], null);
  const blueScore = createPlayerScoreWrapper("blue", themeData.playerIcon, currentSettings.points.pointsBlue);
  const orangeScore = createPlayerScoreWrapper("orange", themeData.playerIcon, currentSettings.points.pointsOrange);
  gameField.append(wrapper, scoreWrapper);
  wrapper.append(gameOver, finalScore, scoreWrapper);
  scoreWrapper.append(blueScore, orangeScore);
  safeAddClasses(header, themeData.gameBackground);
}

function renderDrawView(
  gameField: HTMLElement,
  header: HTMLElement,
  themeData: ThemeData,
) {
  const wrapper = createElementWithoutText("section", ["game-over-wrapper"], null);
  const text = createElementWithText("span", null, null, "It's a");
  const draw = createElementWithText("span", null, null, "Draw");
  const scales = createImageElement(`/assets/img/${themeData.id}/`, themeData.winnerIcons.draw, ["winner-icon"]);
  const backBtn = createElementWithText("button", null, null, `${themeData.backBtnText}`);
  gameField.append(wrapper);
  wrapper.append(text, draw, scales, backBtn);
  safeAddClasses(header, themeData.gameBackground);
  safeAddClasses(text, themeData.drawTextClass);
  safeAddClasses(draw, themeData.drawClass);
  safeAddClasses(backBtn, themeData.backBtnClass);
}

function createExitOverlay(): HTMLElement {
  const themeData = getThemeData();
  const overlay = createElementWithoutText("div", ["exit-overlay", "d-none"], "exit_overlay");
  const modal = createElementWithoutText("section", ["exit-modal"], null);
  const text = createElementWithText("p", null, null, "Are you sure you want to quit the game?");
  const buttonWrapper = createElementWithoutText("div", ["exit-buttons"], null);
  const cancelBtn = createElementWithText("button", null, null, `${themeData.exitCancelBtn}`);
  const confirmBtn = createElementWithText("button", null, null, `${themeData.exitConfirmBtn}`);
  overlay.append(modal);
  modal.append(text, buttonWrapper);
  buttonWrapper.append(cancelBtn, confirmBtn);
  safeAddClasses(modal, themeData.exitModalClass);
  safeAddClasses(text, themeData.exitTextClass);
  safeAddClasses(cancelBtn, themeData.exitCancelBtnClass);
  safeAddClasses(confirmBtn, themeData.exitConfirmBtnClass);
  return overlay;
}

function createAndAppendExitOverlay() {
  const existingOverlay = document.querySelector("#exit_overlay");
  if (existingOverlay) return;
  const overlay = createExitOverlay();
  document.body.append(overlay);
}

function bindExitButton() {
  const exitBtn = document.querySelector(".exit-btn");
  if (!exitBtn) return;
  exitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const overlay = document.querySelector("#exit_overlay");
    overlay?.classList.remove("d-none");
  });
  closeExitOverlay();
  backToSettings();

}

function closeExitOverlay() {
  const themeData = getThemeData();
  const backToGame = document.querySelector(`.${themeData.exitCancelBtnClass}`);
  if (backToGame) {
    backToGame.addEventListener("click", () => {
      const overlay = document.querySelector("#exit_overlay");
      overlay?.classList.add("d-none");
    }
    )
  };
}

function backToSettings() {
  const themeData = getThemeData();
  const confirmBtn = document.querySelector(`.${themeData.exitConfirmBtnClass}`);
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      window.location.href = "/settings.html";
    });
  }
}

function backToStart() {
  const themeData = getThemeData();
  const backBtn = document.querySelector(`.${themeData.backBtnClass}`);
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/index.html";
    });
  }
}

init();