import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithoutText, createElementWithText, createSvgElement, createPlayerScoreWrapper } from "./helpers.js";
import { CardData } from "../interfaces/card.interface";
import { ThemeId, Player, Settings } from "../interfaces/settings-data.interface.js";
import { ThemeData } from "../interfaces/themes.interface";
import { isGameOver, showEndScreen, createAndAppendExitOverlay, bindExitButton } from "./gameOver";
import { SelectedCard } from "./card";
import { createCards, buildCardElement, generateIds, isMatch, applyMatchStyles, safeAddClasses, safeRemoveClasses } from "./card";

/**
 * Represents the winner of the game, which can be either "blue", "orange", or a "draw".
 */
type Winner = "blue" | "orange" | "draw";

/**
 * Represents the options required to create a view in the game, including references to the game field, header, and theme data.
 */
type CreateViewBaseOptions = {
  gameField: HTMLElement,
  header: HTMLElement,
  themeData: ThemeData,
};

/**
 * Represents the options required to create a win view in the game, extending the base view options with the winner information.
 */
type CreateWinViewOptions = CreateViewBaseOptions & {
  winner: "blue" | "orange",
};

let currentSettings = {} as Settings;
let activePlayer: Player = "blue";
let currentTheme: ThemeId = "codeVibes";
let firstCard: SelectedCard | null;
let secondCard: SelectedCard | null;
let isChecking: boolean = false;
let cards: CardData[] = [];

/**
 * Initializes the game by loading user settings, setting up game data, binding card flip events, generating card IDs
 * and resetting player points.
 */
function init(): void {
  loadData();
  initializeGameData();
  flipCard();
  generateIds(+currentSettings.size);
  resetPoints();
}

/**
 * Returns the theme data for the currently selected theme.
 * @returns 
 */
export function getThemeData() {
  return themes[currentTheme];
}

/**
 * Loads the user settings from localStorage and updates the currentSettings variable.
 */
function loadData(): void {
  const data = localStorage.getItem("settings");
  if (data) {
    currentSettings = JSON.parse(data) as Settings;
  }
}

/**
 * Initializes the game data by setting the active player, current theme, and selected player based on the loaded settings.
 * It also calculates the number of pairs, applies theme styles, renders the header, and renders the current theme on the game field.
 */
function initializeGameData(): void {
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

/**
 * Returns an array of all game background classes from the themes.
 * @returns {string[]} An array of game background class names.
 */
function getAllGameBackgrounds() {
  return Object.values(themes).map((theme) => theme.gameBackground);
}

/**
 * Returns an array of all body classes from the themes.
 * @returns {string[]} An array of body class names.
 */
function getAllBodyClasses() {
  return Object.values(themes).map((theme) => theme.bodyClass);
}

/**
 * Returns an array of all state background classes from the themes.
 * @returns {string[]} An array of state background class names.
 */
function getAllStateBackgrounds() {
  return Object.values(themes).flatMap((theme) => [
    theme.gameBackground,
    theme.winnerBackground,
  ]);
}

/**
 * Applies the theme styles to the game field and body elements.
 */
function applyThemeStyles(): void {
  const themeData = getThemeData();
  const gameSection = document.querySelector("#game_field");
  if (!themeData || !gameSection) return;
  gameSection.classList.remove(...getAllGameBackgrounds());
  safeAddClasses(gameSection, themeData.gameBackground);
  document.body.classList.remove(...getAllBodyClasses(), ...getAllStateBackgrounds());
  document.body.classList.add(themeData.bodyClass);
  safeAddClasses(document.body, themeData.gameBackground);
}

/**
 * Applies the header styles based on the current theme.
 */
function applyHeaderStyles(): void {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  safeRemoveClasses(header, themeData.headerClass);
  safeAddClasses(header, themeData.headerClass);
}

/**
 * Creates a CardData object for a card with the given ids and motif.
 * @param {number} id - The unique identifier for the card.
 * @param {number} pairId - The identifier for the pair to which the card belongs.
 * @param {string} motif - The motif for the card.
 * @returns {CardData} The created card data object.
 */
export function createCardOptions(id: number, pairId: number, motif: string): CardData {
  return { id, pairId, motif, isFlipped: false, isMatched: false };
}

/**
 * Renders the current theme onto the game field by generating cards based on the selected theme's motifs.
 * Also applies a size class corresponding to the number of pairs.
 * @param {number} numberOfPairs - The number of pairs to generate.
 */
function renderCurrentTheme(numberOfPairs: number): void {
  const gameField = document.querySelector("#game_field");
  const themeData = themes[currentTheme];
  if (!gameField || !themeData) return;
  gameField.classList.remove("game-field-endscreen");
  gameField.innerHTML = "";
  cards = createCards(numberOfPairs, themeData.motifs);
  cards.forEach((card) => gameField.append(buildCardElement(card, themeData)));
  gameField.classList.add(`size-${numberOfPairs * 2}`);
}

/**
 * Renders the game header by applying header styles, rendering scores, current player indicator, exit button,
 */
function renderHeader(): void {
  applyHeaderStyles();
  renderScores();
  renderCurrentPlayer();
  renderExitBtn();
  createAndAppendExitOverlay();
  bindExitButton();
}

/**
 * Creates a score wrapper section for the current theme, containing the
 * blue and orange player score sub-wrappers with the configured icons and initial points.
 * @param {ThemeData} themeData - The theme data containing score-related configurations.
 * @returns {HTMLElement} The created score wrapper element.
 */
function createScoreWrapper(themeData: ThemeData) {
  const wrapper = createElementWithoutText("section", ["score-wrapper", themeData.scoreWrapperClass], null);
  const blue = createPlayerScoreWrapper("blue", themeData.playerIcon, currentSettings.points.pointsBlue);
  const orange = createPlayerScoreWrapper("orange", themeData.playerIcon, currentSettings.points.pointsOrange);
  wrapper.append(blue, orange);
  return wrapper;
}

/**
 * Renders the scores in the game header.
 */
function renderScores(): void {
  const header = document.querySelector("#game_header");
  const themeData = getThemeData();
  if (!header || !themeData) return;
  header.querySelector(".score-wrapper")?.remove();
  header.prepend(createScoreWrapper(themeData));
}

/**
 * Renders the current player indicator on the UI.
 */
function renderCurrentPlayer(): void {
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

/**
 * Renders the exit button in the game header.
 */
function renderExitBtn(): void {
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

/**
 * Shuffles the elements of an array using the Fisher-Yates algorithm.
 * @param {CardData[]} array - The array to shuffle.
 * @returns {CardData[]} The shuffled array.
 */
export function shuffleCards(array: CardData[]): CardData[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

/**
 * Returns the clicked card as a selectedCard, or null if the click does not correspond to a valid, unflipped card.
 * @param {HTMLElement} target - The clicked element.
 * @returns {SelectedCard | null} The selected card or null if invalid.
 */
function getClickedCard(target: HTMLElement): SelectedCard | null {
  const button = target.closest(".card-button") as HTMLElement | null;
  const field = target.closest(".field") as HTMLElement | null;
  if (!button || !field || button.classList.contains("is-flipped")) return null;
  const selectedCard = createSelectedCard(field, button);
  if (selectedCard.cardData.isMatched || selectedCard.cardData.isFlipped) return null;
  return selectedCard;
}

/**
 * Handles the selection of a card: flip it, track first/second card, and start comparison.
 * @param {SelectedCard} selectedCard - The selected card.
 */
function handleCardSelection(selectedCard: SelectedCard): void {
  selectedCard.button.classList.add("is-flipped");
  selectedCard.cardData.isFlipped = true;
  if (!firstCard) return void (firstCard = selectedCard);
  if (!secondCard && selectedCard.field !== firstCard.field) {
    secondCard = selectedCard;
    isChecking = true;
    compareCards();
  }
}

/**
 * Binds a click event listener to the document that handles card flipping and selection.
 */
function flipCard(): void {
  document.addEventListener("click", (e) => {
    if (isChecking) return;
    const target = e.target as HTMLElement;
    const selectedCard = getClickedCard(target);
    if (!selectedCard) return;
    handleCardSelection(selectedCard);
  });
}

/**
 * Creates a SelectedCard object by linking a field's data-id to a card from the global cards array, paired with a button element.
 * @param {HTMLElement} field - The field element containing the card data.
 * @param {HTMLElement} button - The button element representing the card.
 * @returns {SelectedCard} The created selected card object.
 */
function createSelectedCard(field: HTMLElement, button: HTMLElement): SelectedCard {
  const cardId = Number(field.dataset.cardId);
  const cardData = cards.find(card => card.id === cardId);
  if (!cardData) {
    throw new Error("Card not found");
  }
  return { field, button, cardData };
}

/**
 * Unflips two cards by removing the is-flipped class from both buttons and setting their flipped state to false.
 * @param {SelectedCard} cardOne - The first card to unflip.
 * @param {SelectedCard} cardTwo - The second card to unflip.
 */
function unflipCards(cardOne: SelectedCard, cardTwo: SelectedCard): void {
  cardOne.button.classList.remove("is-flipped");
  cardTwo.button.classList.remove("is-flipped");
  cardOne.cardData.isFlipped = false;
  cardTwo.cardData.isFlipped = false;
}

/**
 * Resets the selected cards by setting firstCard and secondCard to null.
 */
function resetSelectedCards(): void {
  firstCard = null;
  secondCard = null;
}

/**
 * Resets the points for both players to zero and updates the score display.
 */
function resetPoints(): void {
  currentSettings.points.pointsBlue = 0;
  currentSettings.points.pointsOrange = 0;
  renderScores();
}

/**
 * Handles the logic for when two cards match.
 * @param {ThemeData} themeData - The theme data for styling.
 */
function handleMatch(themeData: ThemeData): void {
  if (!firstCard || !secondCard) return;
  firstCard.cardData.isMatched = true;
  secondCard.cardData.isMatched = true;
  applyMatchStyles(firstCard, themeData);
  applyMatchStyles(secondCard, themeData);
  countPoints();
  if (isGameOver(cards))
    setTimeout(() => {
      showEndScreen(themeData, currentSettings.points.pointsBlue, currentSettings.points.pointsOrange);
    }, 1000);
  resetSelectedCards();
  isChecking = false;
}

/**
 * Handles the logic for when two cards do not match.
 */
function handleMismatch(): void {
  setTimeout(() => {
    if (firstCard && secondCard) unflipCards(firstCard, secondCard);
    resetSelectedCards();
    changeCurrentPlayer();
    isChecking = false;
  }, 1000);
}

/**
 * Compares the currently selected cards and then either handles a match or a mismatch.
 */
function compareCards(): void {
  const themeData = getThemeData();
  if (!themeData || !firstCard || !secondCard) return;
  isMatch(firstCard, secondCard) ? handleMatch(themeData) : handleMismatch();
}

/**
 * Toggles the current player between blue and orange and updates the UI.
 */
function changeCurrentPlayer(): void {
  currentSettings.player = currentSettings.player === 'blue' ? 'orange' : 'blue';
  renderCurrentPlayer();
}

/**
 * Increments the score for the current player and updates the score display.
 */
function countPoints(): void {
  if (currentSettings.player === 'blue') {
    currentSettings.points.pointsBlue++;
  } else if (currentSettings.player === 'orange') {
    currentSettings.points.pointsOrange++;
  }
  renderScores();
}

init();