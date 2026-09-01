import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { themes } from "./data.js";
import { createElementWithoutText, createElementWithText, createImageElement,
  createSvgElement, createPlayerScoreWrapper } from "./helpers.js";
import { CardData } from "../interfaces/card.interface";
import { ThemeId, Player, Settings } from "../interfaces/settings-data.interface.js";
import { ThemeData } from "../interfaces/themes.interface";
import { isGameOver, showEndScreen, createAndAppendExitOverlay, bindExitButton } from "./gameOver";

type SelectedCard = {
  field: HTMLElement;
  button: HTMLElement;
  cardData: CardData;
}

type Winner = "blue" | "orange" | "draw";

type CreateViewBaseOptions = {
  gameField: HTMLElement,
  header: HTMLElement,
  themeData: ThemeData,
};

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

function init(): void {
  loadData();
  initializeGameData();
  flipCard();
  generateIds(+currentSettings.size);
  resetPoints();
}

/** Returns the theme data for the currently selected theme. */
export function getThemeData() {
  return themes[currentTheme];
}

/** Loads user settings from Local Storage and stores them in `currentSettings`. */
function loadData(): void {
  const data = localStorage.getItem("settings");
  if (data) {
    const settings = JSON.parse(data) as Settings;
    currentSettings = settings;
  }
}

/** Initializes game data based on `currentSettings`
 * Sets activePlayer to currentSettings.player or fallback to "blue".
 * Sets currentTheme to currentSettings.theme or fallback to "codeVibes".
 * If currentSettings.selectedPlayer is not set, it will be set to currentSettings.player.
 * Calculates numberOfPairs as half of the size.
 * Applies theme styles, renders the header, and renders the current theme based on the calculated pairs.
 */
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

/** Iterates over all values of themes and returns an array containing each theme's gameBackground property. */
function getAllGameBackgrounds() {
  return Object.values(themes).map((theme) => theme.gameBackground);
}

/** Iterates over all theme values and returns an array of the bodyClass properties. */
function getAllBodyClasses() {
  return Object.values(themes).map((theme) => theme.bodyClass);
}

/** Iterates over all theme values, builds an array with gameBackground and winnerBackground for each theme,
 * and flattens it into a single array. */
function getAllStateBackgrounds() {
  return Object.values(themes).flatMap((theme) => [
    theme.gameBackground,
    theme.winnerBackground,
  ]);
}

/** Loads the theme data, selects the game field element (#game_field),
 * removes all existing background classes, applies the theme's background classes,
 * and updates the document body with the corresponding theme classes. */
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

/** Applies header styles based on the theme. It retrieves the theme data, selects the header,
 * removes any existing header classes, and adds the new header classes from the theme.  */
function applyHeaderStyles(): void {
  const header = document.querySelector("#game_header");
  if (!header) return;
  const themeData = getThemeData();
  if (!themeData) return;
  safeRemoveClasses(header, themeData.headerClass);
  safeAddClasses(header, themeData.headerClass);
}

/** Creates a CardData object for a card with the given ids and motif. */
function createCardOptions(id: number, pairId: number, motif: string): CardData {
  return { id, pairId, motif, isFlipped: false, isMatched: false };
}

/** Creates an array of CardData objects for a given number of pairs.
 * Takes the first numberOfPairs motifs from motifs.
 * For each motif, two cards are created with the same pairId.
 * The resulting card data is then shuffled using shuffleCards. */
function createCards(numberOfPairs: number, motifs: string[]): CardData[] {
  let idCounter = 1;
  const cardData = motifs.slice(0, numberOfPairs).flatMap((motif, index) => {
    const pairId = index + 1;
    return [createCardOptions(idCounter++, pairId, motif), createCardOptions(idCounter++, pairId, motif)];
  });
  return shuffleCards(cardData);
}

/** Builds an HTMLElement for a card based on CardData and ThemeData.
 * Creates a field Section with the card ID as the DOM id and data attributes.
 * Contains a button with the card content according to the theme. */
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

/** Renders the current theme onto the game field by generating cards based on the selected theme's.
 * Also applies a size class corresponding to the number of pairs. */
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

function renderHeader(): void {
  applyHeaderStyles();
  renderScores();
  renderCurrentPlayer();
  renderExitBtn();
  createAndAppendExitOverlay();
  bindExitButton();
}

/** Builds a score wrapper section for the current theme, containing the
 * blue and orange player score sub-wrappers with the configured icons and initial points. */
function createScoreWrapper(themeData: ThemeData) {
  const wrapper = createElementWithoutText("section", ["score-wrapper", themeData.scoreWrapperClass], null);
  const blue = createPlayerScoreWrapper("blue", themeData.playerIcon, currentSettings.points.pointsBlue);
  const orange = createPlayerScoreWrapper("orange", themeData.playerIcon, currentSettings.points.pointsOrange);
  wrapper.append(blue, orange);
  return wrapper;
}

/** Renders the current score UI by removing any existing score wrapper and inserting a fresh one for the current theme. */
function renderScores(): void {
  const header = document.querySelector("#game_header");
  const themeData = getThemeData();
  if (!header || !themeData) return;
  header.querySelector(".score-wrapper")?.remove();
  header.prepend(createScoreWrapper(themeData));
}

/** Renders the current player indicator on the UI. */
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

/** Renders the exit button UI in the header. */
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

/** Returns a new array with the elements of the input array shuffled using a simple random sort-based approach. */
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

/** Returns the clicked card as a selectedCard, or null if the click does not correspond to a valid, unflipped card. */
function getClickedCard(target: HTMLElement): SelectedCard | null {
  const button = target.closest(".card-button") as HTMLElement | null;
  const field = target.closest(".field") as HTMLElement | null;
  if (!button || !field || button.classList.contains("is-flipped")) return null;
  const selectedCard = createSelectedCard(field, button);
  if (selectedCard.cardData.isMatched || selectedCard.cardData.isFlipped) return null;
  return selectedCard;
}

/** Handles the selection of a card: flip it, track first/second card, and start comparison. */
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

/** Attach a global click listener to flip cards when allowed. */
function flipCard(): void {
  document.addEventListener("click", (e) => {
    if (isChecking) return;
    const target = e.target as HTMLElement;
    const selectedCard = getClickedCard(target);
    if (!selectedCard) return;
    handleCardSelection(selectedCard);
  });
}

/** Generate a sequence of card IDs. */
function generateIds(numberOfCards: number): string[] {
  const ids: string[] = [];
  for (let i = 0; i < numberOfCards; i++) {
    ids.push(`card-${i + 1}`);
  }
  return ids;
}

/** Create and return a SelectedCard object by linking a field's data-id to a card from the global cards array,
 * paired with a button element. */
function createSelectedCard(field: HTMLElement, button: HTMLElement): SelectedCard {
  const cardId = Number(field.dataset.cardId);
  const cardData = cards.find(card => card.id === cardId);
  if (!cardData) {
    throw new Error("Card not found");
  }
  return { field, button, cardData };
}

/** Check if two SelectedCard objects form a matching pair. */
function isMatch(cardOne: SelectedCard, cardTwo: SelectedCard): boolean {
  return cardOne.cardData.pairId === cardTwo.cardData.pairId;
}

/** Apply the match styling to a card based on the provided theme data. The function adds match-specific 
 * background/border/shadow classes and removes the previous card background class if present. */
function applyMatchStyles(card: SelectedCard, themeData: any): void {
  const img = card.button.querySelector(".card-button__face--back");
  if (img) {
    safeAddClasses(img, themeData.cardMatchBackground);
    if (themeData.cardBackground) {
      img.classList.remove(themeData.cardBackground);
    }
  }
  safeAddClasses(card.button, themeData.cardMatchBorder, themeData.cardMatchShadow);
}

/** Adds only valid string class names to the given element. */
export function safeAddClasses(element: Element, ...classes: (string | undefined | null)[]): void {
  const valid = classes
    .filter((c): c is string => Boolean(c) && typeof c === "string" && c.trim() !== "");
  if (valid.length) {
    element.classList.add(...valid);
  }
}

/** Removes only valid string class names from the given element. */
export function safeRemoveClasses(element: Element, ...classes: (string | undefined | null)[]): void {
  const valid = classes
    .filter((c): c is string => Boolean(c) && typeof c === "string" && c.trim() !== "");
  if (valid.length) {
    element.classList.remove(...valid);
  }
}

/** Unflips two cards by removing the is-flipped class from both buttons and setting their flipped state to false. */
function unflipCards(cardOne: SelectedCard, cardTwo: SelectedCard): void {
  cardOne.button.classList.remove("is-flipped");
  cardTwo.button.classList.remove("is-flipped");
  cardOne.cardData.isFlipped = false;
  cardTwo.cardData.isFlipped = false;
}

/** Resets the currently selected cards by clearing the references to firstCard and secondCard. */
function resetSelectedCards(): void {
  firstCard = null;
  secondCard = null;
}

/** Resets both blue and orange points to zero and re-renders the score display. */
function resetPoints(): void {
  currentSettings.points.pointsBlue = 0;
  currentSettings.points.pointsOrange = 0;
  renderScores();
}

/** Marks two matched cards, applies match styles using the provided themeData, counts points,
 * shows end screen if the game is over and resets the selected cards */
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

/** Flipping the cards back after a delay, resets selections and advances to the next player. */
function handleMismatch(): void {
  setTimeout(() => {
    if (firstCard && secondCard) unflipCards(firstCard, secondCard);
    resetSelectedCards();
    changeCurrentPlayer();
    isChecking = false;
  }, 1000);
}

/** Compares the currently selected cards and then either handles a match or a mismatch. */
function compareCards(): void {
  const themeData = getThemeData();
  if (!themeData || !firstCard || !secondCard) return;
  isMatch(firstCard, secondCard) ? handleMatch(themeData) : handleMismatch();
}

/** This function toggles the current player between blue and orange and updates the UI. */
function changeCurrentPlayer(): void {
  currentSettings.player = currentSettings.player === 'blue' ? 'orange' : 'blue';
  renderCurrentPlayer();
}

/** This function increments the score for the current player and then updates the score display. */
function countPoints(): void {
  if (currentSettings.player === 'blue') {
    currentSettings.points.pointsBlue++;
  } else if (currentSettings.player === 'orange') {
    currentSettings.points.pointsOrange++;
  }
  renderScores();
}

init();