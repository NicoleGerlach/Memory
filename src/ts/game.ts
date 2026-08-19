import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithoutText, createElementWithText } from "./helpers.js";
import { createImageElement } from "./helpers.js";
import { createSvgElement } from "./helpers.js";
import { createPlayerScoreWrapper } from "./helpers.js";
import { CardData } from "../interfaces/card.interface";
import { ThemeId, Player, Settings } from "../interfaces/settings-data.interface.js";
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

function getAllGameBackgrounds() {
  return Object.values(themes).map((theme) => theme.gameBackground);
}

function getAllBodyClasses() {
  return Object.values(themes).map((theme) => theme.bodyClass);
}

function getAllStateBackgrounds() {
  return Object.values(themes).flatMap((theme) => [
    theme.gameBackground,
    theme.winnerBackground,
  ]);
}

function applyThemeStyles() {
  const themeData = getThemeData();
  const gameSection = document.querySelector("#game_field");
  if (!themeData || !gameSection) return;
  gameSection.classList.remove(...getAllGameBackgrounds());
  safeAddClasses(gameSection, themeData.gameBackground);
  document.body.classList.remove(...getAllBodyClasses(), ...getAllStateBackgrounds());
  document.body.classList.add(themeData.bodyClass);
  safeAddClasses(document.body, themeData.gameBackground);
}

function applyHeaderStyles() {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  safeRemoveClasses(header, themeData.headerClass);
  safeAddClasses(header, themeData.headerClass);
}

function createCardOptions(id: number, pairId: number, motif: string): CardData {
  return { id, pairId, motif, isFlipped: false, isMatched: false };
}

function createCards(numberOfPairs: number, motifs: string[]): CardData[] {
  let idCounter = 1;
  const cardData = motifs.slice(0, numberOfPairs).flatMap((motif, index) => {
    const pairId = index + 1;
    return [createCardOptions(idCounter++, pairId, motif), createCardOptions(idCounter++, pairId, motif)];
  });
  return shuffleCards(cardData);
}

function buildCardElement(card: CardData, themeData: ThemeData): HTMLElement {
  const field = createElementWithoutText("section", ["field"], null);
  field.id = String(card.id);
  field.dataset.cardId = String(card.id);
  field.dataset.pairId = String(card.pairId);
  const button = createElementWithoutText("button", ["card-button"], null);
  if (card.isFlipped) button.classList.add("is-flipped");
  const box = createElementWithoutText("div", ["card-button__inner"], null);
  const front = createImageElement(`/assets/img/${themeData.id}/`, card.motif, ["card-button__face", "card-button__face--back", themeData.cardBackground,]);
  const back = createImageElement(`/assets/img/${themeData.id}/`, "back.svg", ["card-button__face", themeData.cardStyle,]);
  box.append(back, front);
  button.append(box);
  field.append(button);
  return field;
}

function renderCurrentTheme(numberOfPairs: number) {
  const gameField = document.querySelector("#game_field");
  const themeData = themes[currentTheme];
  if (!gameField || !themeData) return;
  gameField.classList.remove("game-field-endscreen");
  gameField.innerHTML = "";
  cards = createCards(numberOfPairs, themeData.motifs);
  cards.forEach((card) => gameField.append(buildCardElement(card, themeData)));
  gameField.classList.add(`size-${numberOfPairs * 2}`);
}

function renderHeader() {
  applyHeaderStyles();
  renderScores();
  renderCurrentPlayer();
  renderExitBtn();
}

function createScoreWrapper(themeData: ThemeData) {
  const wrapper = createElementWithoutText("section", ["score-wrapper", themeData.scoreWrapperClass], null);
  const blue = createPlayerScoreWrapper("blue", themeData.playerIcon, currentSettings.points.pointsBlue);
  const orange = createPlayerScoreWrapper("orange", themeData.playerIcon, currentSettings.points.pointsOrange);
  wrapper.append(blue, orange);
  return wrapper;
}

function renderScores() {
  const header = document.querySelector("#game_header");
  const themeData = getThemeData();
  if (!header || !themeData) return;
  header.querySelector(".score-wrapper")?.remove();
  header.prepend(createScoreWrapper(themeData));
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

function getClickedCard(target: HTMLElement): SelectedCard | null {
  const button = target.closest(".card-button") as HTMLElement | null;
  const field = target.closest(".field") as HTMLElement | null;
  if (!button || !field || button.classList.contains("is-flipped")) return null;
  const selectedCard = createSelectedCard(field, button);
  if (selectedCard.cardData.isMatched || selectedCard.cardData.isFlipped) return null;
  return selectedCard;
}

function handleCardSelection(selectedCard: SelectedCard) {
  selectedCard.button.classList.add("is-flipped");
  selectedCard.cardData.isFlipped = true;
  if (!firstCard) return void (firstCard = selectedCard);
  if (!secondCard && selectedCard.field !== firstCard.field) {
    secondCard = selectedCard;
    isChecking = true;
    compareCards();
  }
}

function flipCard() {
  document.addEventListener("click", (e) => {
    if (isChecking) return;
    const target = e.target as HTMLElement;
    const selectedCard = getClickedCard(target);
    if (!selectedCard) return;
    handleCardSelection(selectedCard);
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
  const img = card.button.querySelector(".card-button__face--back");
  if (img) {
    safeAddClasses(img, themeData.cardMatchBackground);
    if (themeData.cardBackground) {
      img.classList.remove(themeData.cardBackground);
    }
  }
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

function handleMatch(themeData: ThemeData) {
  if (!firstCard || !secondCard) return;
  firstCard.cardData.isMatched = true;
  secondCard.cardData.isMatched = true;
  applyMatchStyles(firstCard, themeData);
  applyMatchStyles(secondCard, themeData);
  countPoints();
  if (isGameOver(cards)) renderEndScreen();
  resetSelectedCards();
  isChecking = false;
}

function handleMismatch() {
  setTimeout(() => {
    if (firstCard && secondCard) unflipCards(firstCard, secondCard);
    resetSelectedCards();
    changeCurrentPlayer();
    isChecking = false;
  }, 1000);
}

function compareCards() {
  const themeData = getThemeData();
  if (!themeData || !firstCard || !secondCard) return;
  isMatch(firstCard, secondCard) ? handleMatch(themeData) : handleMismatch();
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

function clearEndScreen(field: HTMLElement, header: HTMLElement, themeData: ThemeData) {
  field.innerHTML = "";
  header.innerHTML = "";
  safeRemoveClasses(field, themeData.gameBackground, themeData.winnerBackground);
  safeRemoveClasses(header, themeData.headerClass);
}

function renderEndScreen() {
  const winner = getWinner();
  const themeData = getThemeData();
  const gameField = document.querySelector("#game_field");
  const header = document.querySelector("#game_header") as HTMLElement | null;
  if (!themeData || !(gameField instanceof HTMLElement) || !(header instanceof HTMLElement)) return;
  clearEndScreen(gameField, header, themeData);
  safeAddClasses(document.body, themeData.winnerBackground);
  winner === "draw"
    ? renderDrawView({gameField, header, themeData})
    : winner === currentSettings.selectedPlayer
      ? renderWinView({ gameField, header, themeData, winner })
      : renderWinView({ gameField, header, themeData, winner });
  backToStart();
}

function createBackButton(themeData: ThemeData) {
  const backBtn = createElementWithText("button", null, null, themeData.backBtnText);
  safeAddClasses(backBtn, themeData.backBtnClass);
  return backBtn;
}

type CreateViewBaseOptions = {
  gameField: HTMLElement,
  header: HTMLElement,
  themeData: ThemeData,
};

type CreateWinViewOptions = CreateViewBaseOptions & {
  winner: "blue" | "orange",
};

function renderWinView(options: CreateWinViewOptions) {
  const { gameField, header, themeData, winner } = options;
  gameField.classList.add(themeData.winnerBackground, "game-field-endscreen", "game-field-win");
  header.classList.add("header-endscreen");
  const wrapper = createElementWithoutText("section", ["winner-wrapper"], null);
  const label = createElementWithText("span", ["winner-text"], null, "The winner is");
  const player = createElementWithText("span", ["winner-player", winner], null, `${winner} Player`);
  const winnerIcon = winner === "blue" ? themeData.winnerIcons.winBlue : themeData.winnerIcons.winOrange;
  const img = createImageElement(`/assets/img/${themeData.id}/`, winnerIcon, ["winner-icon"]);
  const confetti = createImageElement("/assets/img/ui/", themeData.winnerIcons.decoration, ["confetti"]);
  gameField.append(wrapper);
  wrapper.append(label, player, img, createScoreWrapper(themeData), createBackButton(themeData));
  safeAddClasses(header, themeData.gameBackground);
  header.append(confetti);
}

function renderDrawView(options: CreateViewBaseOptions) {
  const { gameField, header, themeData } = options;
  gameField.classList.add(themeData.winnerBackground, "game-field-endscreen");
  header.classList.add("header-endscreen");
  const wrapper = createElementWithoutText("section", ["game-over-wrapper"], null);
  const text = createElementWithText("span", null, null, "It's a");
  const draw = createElementWithText("span", null, null, "Draw");
  const scales = createSvgElement("scales.svg", ["scales-svg"]);
  gameField.append(wrapper);
  wrapper.append(text, draw, scales, createScoreWrapper(themeData), createBackButton(themeData));
  safeAddClasses(header, themeData.gameBackground);
  safeAddClasses(text, themeData.drawTextClass);
  safeAddClasses(draw, themeData.drawClass);
}

function createExitOverlayBlock(themeData: ThemeData) {
  const buttonWrapper = createElementWithoutText("div", ["exit-buttons"], null);
  const cancelBtn = createElementWithText("button", null, null, `${themeData.exitCancelBtn}`);
  const confirmBtn = createElementWithText("button", null, null, `${themeData.exitConfirmBtn}`);
  buttonWrapper.append(cancelBtn, confirmBtn);
  safeAddClasses(cancelBtn, themeData.exitCancelBtnClass);
  safeAddClasses(confirmBtn, themeData.exitConfirmBtnClass);
  return { buttonWrapper };
}

function createExitOverlay(): HTMLElement {
  const themeData = getThemeData();
  const overlay = createElementWithoutText("div", ["exit-overlay", "d-none"], "exit_overlay");
  const modal = createElementWithoutText("section", ["exit-modal"], null);
  const text = createElementWithText("p", ["exit-text-overlay"], null, "Are you sure you want to quit the game?");
  overlay.append(modal);
  modal.append(text, createExitOverlayBlock(themeData).buttonWrapper);
  safeAddClasses(modal, themeData.exitModalClass);
  safeAddClasses(text, themeData.exitTextClass);
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