import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import { CardData } from "../interfaces/card.interface";
import { ThemeData } from "../interfaces/themes.interface";
import { createElementWithoutText, createImageElement, } from "./helpers.js";
import { createCardOptions, shuffleCards } from "./game.js";

/**
 * Represents a selected card in the game, containing references to its field element, button element, and associated card data.
 */
export type SelectedCard = {
  field: HTMLElement;
  button: HTMLElement;
  cardData: CardData;
}

/**
 * Creates an array of CardData objects for the specified number of pairs and motifs.
 * @param {number} numberOfPairs - The number of card pairs to create.
 * @param {string[]} motifs - An array of motif strings to use for the cards.
 * @returns {CardData[]} An array of CardData objects.
 */
export function createCards(numberOfPairs: number, motifs: string[]): CardData[] {
  let idCounter = 1;
  const cardData = motifs.slice(0, numberOfPairs).flatMap((motif, index) => {
    const pairId = index + 1;
    return [createCardOptions(idCounter++, pairId, motif), createCardOptions(idCounter++, pairId, motif)];
  });
  return shuffleCards(cardData);
}

/**
 * Builds an HTMLElement for a card based on CardData and ThemeData.
 * @param {CardData} card - The card data used to build the element.
 * @param {ThemeData} themeData - The theme data used to style the card.
 * @returns {HTMLElement} The built card element.
 */
export function buildCardElement(card: CardData, themeData: ThemeData): HTMLElement {
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

/**
 * Generates an array of unique IDs for the specified number of cards.
 * @param {number} numberOfCards - The number of card IDs to generate.
 * @returns {string[]} An array of unique card IDs.
 */
export function generateIds(numberOfCards: number): string[] {
  const ids: string[] = [];
  for (let i = 0; i < numberOfCards; i++) {
    ids.push(`card-${i + 1}`);
  }
  return ids;
}

/**
  * Checks if two selected cards form a matching pair.
  * @param {SelectedCard} cardOne - The first selected card.
  * @param {SelectedCard} cardTwo - The second selected card.
  * @returns {boolean} True if the cards form a matching pair, false otherwise.
  */
export function isMatch(cardOne: SelectedCard, cardTwo: SelectedCard): boolean {
  return cardOne.cardData.pairId === cardTwo.cardData.pairId;
}

/**
 * Applies match-specific styles to a card based on the provided theme data.
 * @param {SelectedCard} card - The card to apply styles to.
 * @param {ThemeData} themeData - The theme data containing the match-specific styles.
 */
export function applyMatchStyles(card: SelectedCard, themeData: any): void {
  const img = card.button.querySelector(".card-button__face--back");
  if (img) {
    safeAddClasses(img, themeData.cardMatchBackground);
    if (themeData.cardBackground) {
      img.classList.remove(themeData.cardBackground);
    }
  }
  safeAddClasses(card.button, themeData.cardMatchBorder, themeData.cardMatchShadow);
}

/**
 * Adds only valid string class names to the given element.
 * @param {Element} element The element to add classes to.
 * @param {...(string | undefined | null)} classes The class names to add.
 */
export function safeAddClasses(element: Element, ...classes: (string | undefined | null)[]): void {
  const valid = classes
    .filter((c): c is string => Boolean(c) && typeof c === "string" && c.trim() !== "");
  if (valid.length) {
    element.classList.add(...valid);
  }
}

/**
 * Removes only valid string class names from the given element.
 * @param {Element} element The element to remove classes from.
 * @param {...(string | undefined | null)} classes The class names to remove. 
 */
export function safeRemoveClasses(element: Element, ...classes: (string | undefined | null)[]): void {
  const valid = classes
    .filter((c): c is string => Boolean(c) && typeof c === "string" && c.trim() !== "");
  if (valid.length) {
    element.classList.remove(...valid);
  }
}