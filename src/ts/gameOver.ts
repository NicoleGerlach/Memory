import "../styles/entries/global.scss";
import "../styles/entries/game.scss";

import {createElementWithoutText, createElementWithText, createImageElement, createSvgElement, createPlayerScoreWrapper} from "./helpers.js";
import { CardData } from "../interfaces/card.interface";
import { ThemeData } from "../interfaces/themes.interface";
import { getThemeData } from "./game.js";
import { safeAddClasses, safeRemoveClasses } from "./card";

/**
 * This file contains functions related to the game over state, including checking if the game is over,
 */
type Winner = "blue" | "orange" | "draw";

/**
 * This type defines the base options required to create a view, including the game field, header, theme data, and player points.
 */
type CreateViewBaseOptions = {
    gameField: HTMLElement,
    header: HTMLElement,
    themeData: ThemeData,
    bluePoints: number;
    orangePoints: number;
};

/**
 * This type extends the base view options to include the winner, which can be either "blue" or "orange".
 */
type CreateWinViewOptions = CreateViewBaseOptions & {
    winner: "blue" | "orange",
};

/**
 * Checks if the game is over by verifying that every card in the provided array has isMatched set to true.
 * @param {CardData[]} cards - An array of card data.
 * @returns {boolean} - True if the game is over, false otherwise.
 */
export function isGameOver(cards: CardData[]): boolean {
    return cards.every(card => card.isMatched);
}

/**
 * This function determines the game winner by comparing the blue and orange points.
 * @param {CreateViewBaseOptions} options - The base view options.
 * @returns {Winner} - The winner of the game.
 */
function getWinner(options: CreateViewBaseOptions): Winner {
    const { bluePoints, orangePoints } = options;
    if (bluePoints > orangePoints) return "blue";
    if (orangePoints > bluePoints) return "orange";
    return "draw";
}

/**
 * Clears the end screen and removes the related theme classes.
 * @param {HTMLElement} field - The game field element.
 * @param {HTMLElement} header - The game header element.
 * @param {ThemeData} themeData - The theme data.
 */
function clearEndScreen(field: HTMLElement, header: HTMLElement, themeData: ThemeData): void {
    field.innerHTML = "";
    header.innerHTML = "";
    safeRemoveClasses(field, themeData.gameBackground, themeData.winnerBackground);
    safeRemoveClasses(header, themeData.headerClass);
}

/**
 * Shows the end screen, rendering the game-over view and after 2.5 seconds clearing it and rendering the final end view.
 * @param {ThemeData} themeData - The theme data.
 * @param {number} bluePoints - The points for the blue player.
 * @param {number} orangePoints - The points for the orange player.
 */
export function showEndScreen(themeData: ThemeData, bluePoints: number, orangePoints: number): void {
    const gameField = document.querySelector("#game_field");
    const header = document.querySelector("#game_header") as HTMLElement | null;
    if (!themeData || !(gameField instanceof HTMLElement) || !(header instanceof HTMLElement)) return;
    clearEndScreen(gameField, header, themeData);
    renderGameOverView({ gameField, header, themeData, bluePoints, orangePoints });

    setTimeout(() => {
        clearEndScreen(gameField, header, themeData);
        renderFinalEndView({ gameField, header, themeData, bluePoints, orangePoints });
        backToStart(themeData);
    }, 2500);
}

/**
 * Renders the final end view based on the winner.
 * @param {CreateViewBaseOptions} options - The base view options.
 */
function renderFinalEndView(options: CreateViewBaseOptions) {
    const { gameField, header, themeData, bluePoints, orangePoints } = options;
    const winner = getWinner(options);
    safeAddClasses(document.body, themeData.winnerBackground);
    if (winner === "draw") {
        renderDrawView({ gameField, header, themeData, bluePoints, orangePoints });
        return;
    }
    renderWinView({ gameField, header, themeData, bluePoints, orangePoints, winner });
}

/**
 * Creates a back button with the specified theme data.
 * @param {ThemeData} themeData - The theme data.
 * @returns {HTMLElement} - The created back button.
 */
function createBackButton(themeData: ThemeData) {
    const backBtn = createElementWithText("button", null, null, themeData.backBtnText);
    safeAddClasses(backBtn, themeData.backBtnClass);
    return backBtn;
}

/**
 * Applies the win state to the game field and header.
 * @param {HTMLElement} gameField - The game field element.
 * @param {HTMLElement} header - The game header element.
 * @param {ThemeData} themeData - The theme data.
 */
function applyWinState(gameField: HTMLElement, header: HTMLElement, themeData: ThemeData): void {
    gameField.classList.add(themeData.winnerBackground, "game-field-endscreen", "game-field-win");
    header.classList.add("header-endscreen", "endscreen-enter");
    safeAddClasses(header, themeData.gameBackground);
    safeRemoveClasses(document.body, themeData.gameOverBackground);
}

/**
 * Creates a block with elements to display the winner.
 * @param {ThemeData} themeData - The theme data.
 * @param {Winner} winner - The winner of the game.
 * @returns {Object} - The created win block elements.
 */
function createWinBlock(themeData: ThemeData, winner: Winner) {
    const label = createElementWithText("span", ["winner-text"], null, "The winner is");
    const player = createElementWithText("span", ["winner-player", winner], null, `${winner} Player`);
    const winnerIcon = winner === "blue" ? themeData.winnerIcons.winBlue : themeData.winnerIcons.winOrange;
    const img = createImageElement(`/assets/img/${themeData.id}/`, winnerIcon, ["winner-icon"]);
    return { label, player, img }
}

/**
 * Renders the win view, applies styles and content based on the options, creates UI elements and adds a back button.
 * @param {CreateWinViewOptions} options - The win view options.
 */
function renderWinView(options: CreateWinViewOptions): void {
    const { gameField, header, themeData, winner } = options;
    applyWinState(gameField, header, themeData);
    const animationClass = getEndscreenAnimationClass(themeData);
    const wrapper = createElementWithoutText("section", ["winner-wrapper", animationClass], null);
    const { label, player, img } = createWinBlock(themeData, winner);
    const confetti = createImageElement("/assets/img/ui/", themeData.winnerIcons.decoration, ["confetti"]);
    gameField.append(wrapper);
    wrapper.append(label, player, img, createBackButton(themeData));
    header.append(confetti);
}

/**
 * Applies the game over state to the game field and header.
 * @param {HTMLElement} gameField - The game field element.
 * @param {HTMLElement} header - The game header element.
 * @param {ThemeData} themeData - The theme data.
 */
function applyGameOverState(gameField: HTMLElement, header: HTMLElement, themeData: ThemeData): void {
    gameField.classList.add("game-field-endscreen");
    header.classList.add("header-endscreen");
    safeAddClasses(header, themeData.gameBackground);
    safeAddClasses(document.body, themeData.gameOverBackground);
}

/**
 * Creates a block with elements to display the game over scores.
 * @param {ThemeData} themeData - The theme data.
 * @param {number} bluePoints - The points for the blue player.
 * @param {number} orangePoints - The points for the orange player.
 * @returns {Object} - The created game over score block elements.
 */
function createGameOverScoreBlock(themeData: ThemeData, bluePoints: number, orangePoints: number) {
    const finalScore = createElementWithText("span", ["game-over-score"], null, "Final score");
    const scoreWrapper = createElementWithoutText("section", ["score-wrapper"], null);
    const blueScore = createPlayerScoreWrapper("blue", themeData.playerIcon, bluePoints);
    const orangeScore = createPlayerScoreWrapper("orange", themeData.playerIcon, orangePoints);
    scoreWrapper.append(blueScore, orangeScore);
    safeAddClasses(scoreWrapper, themeData.scoreWrapperClass);
    return { finalScore, scoreWrapper };
}

/**
 * Renders the game over view, applies styles and content based on the options and creates UI elements.
 * @param {CreateViewBaseOptions} options - The game over view options.
 */
function renderGameOverView(options: CreateViewBaseOptions): void {
    const { gameField, header, themeData, bluePoints, orangePoints } = options;
    applyGameOverState(gameField, header, themeData);
    const wrapper = createElementWithoutText("section", ["game-over-wrapper", "endscreen-enter-in"], null);
    const gameOver = createElementWithText("span", ["game-over-text"], null, "Game Over");
    const { finalScore, scoreWrapper } = createGameOverScoreBlock(themeData, bluePoints, orangePoints);
    gameField.append(wrapper);
    wrapper.append(gameOver, finalScore, scoreWrapper);
    safeAddClasses(gameOver, themeData.gameOverTextClass);
}

/**
 * Applies the draw state to the game field and header.
 * @param {HTMLElement} gameField - The game field element.
 * @param {HTMLElement} header - The game header element.
 * @param {ThemeData} themeData - The theme data.
 */
function applyDrawState(gameField: HTMLElement, header: HTMLElement, themeData: ThemeData): void {
    gameField.classList.add(themeData.winnerBackground, "game-field-endscreen");
    header.classList.add("header-endscreen");
    safeAddClasses(header, themeData.gameBackground);
    safeRemoveClasses(document.body, themeData.gameOverBackground);
}

/**
 * Creates a block with elements to display the draw message.
 * @returns {Object} - The created draw block elements.
 */
function createDrawBlock() {
    const text = createElementWithText("span", null, null, "It's a");
    const draw = createElementWithText("span", null, null, "Draw");
    const scales = createSvgElement("scales.svg", ["scales-svg"]);
    return { text, draw, scales };
}

/**
 * Renders the draw view, applies styles and content based on the options, creates UI elements and adds a back button.
 * @param {CreateViewBaseOptions} options - The draw view options.
 */
function renderDrawView(options: CreateViewBaseOptions): void {
    const { gameField, header, themeData } = options;
    applyDrawState(gameField, header, themeData);
    const animationClass = getEndscreenAnimationClass(themeData);
    const wrapper = createElementWithoutText("section", ["game-over-wrapper", animationClass], null);
    const { text, draw, scales } = createDrawBlock();
    gameField.append(wrapper);
    wrapper.append(text, draw, scales, createBackButton(themeData));
    safeAddClasses(text, themeData.drawTextClass);
    safeAddClasses(draw, themeData.drawClass);
}

/**
 * Creates an exit overlay block with two buttons to use in another function.
 * @param {ThemeData} themeData - The theme data.
 * @returns {Object} - The created exit overlay block elements.
 */
function createExitOverlayBlock(themeData: ThemeData) {
    const buttonWrapper = createElementWithoutText("div", ["exit-buttons"], null);
    const cancelBtn = createElementWithText("button", null, null, `${themeData.exitCancelBtn}`);
    const confirmBtn = createElementWithText("button", null, null, `${themeData.exitConfirmBtn}`);
    buttonWrapper.append(cancelBtn, confirmBtn);
    safeAddClasses(cancelBtn, themeData.exitCancelBtnClass);
    safeAddClasses(confirmBtn, themeData.exitConfirmBtnClass);
    return { buttonWrapper };
}

/**
 * Creates an exit overlay as an HTML element.
 * @returns {HTMLElement} - The created exit overlay element.
 */
function createExitOverlay(): HTMLElement {
    const themeData = getThemeData();
    const overlay = createElementWithoutText("div", ["exit-overlay", "d-none"], "exit_overlay");
    const modal = createElementWithoutText("dialog", ["exit-modal"], null);
    const text = createElementWithText("p", ["exit-text-overlay"], null, "Are you sure you want to quit the game?");
    overlay.append(modal);
    modal.append(text, createExitOverlayBlock(themeData).buttonWrapper);
    safeAddClasses(modal, themeData.exitModalClass);
    safeAddClasses(text, themeData.exitTextClass);
    return overlay;
}

/**
 * Creates and appends an exit overlay to the document body.
 */
export function createAndAppendExitOverlay(): void {
    const existingOverlay = document.querySelector("#exit_overlay");
    if (existingOverlay) return;
    const overlay = createExitOverlay();
    document.body.append(overlay);
}

/**
 * Binds a click handler to the element with class exit-btn.
 * On click, the exit overlay is shown by removing the "d-none" class from the overlay.
 */
export function bindExitButton(): void {
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

/**
 * Binds a click handler to the exit overlay's cancel button.
 * On click, the exit overlay is hidden by adding the "d-none" class to the overlay.
 */
function closeExitOverlay(): void {
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

/**
 * Binds a click handler to the exit overlay's confirm button.
 * On click, the user is redirected to the settings page and a sessionStorage item is set to restore settings.
 */
function backToSettings(): void {
    const themeData = getThemeData();
    const confirmBtn = document.querySelector(`.${themeData.exitConfirmBtnClass}`);
    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            sessionStorage.setItem("restoreSettings", "true");
            window.location.href = "/settings.html";
        });
    }
}

/**
 * Binds a click handler to the exit overlay's back button.
 * @param {ThemeData} themeData - The theme data containing the back button class.
 */
function backToStart(themeData: ThemeData): void {
    const backBtn = document.querySelector(`.${themeData.backBtnClass}`);
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "/settings.html";
        });
    }
}

/**
 * Returns the corresponding endscreen animation class, based on themeData.id.
 * @param {ThemeData} themeData - The theme data containing the animation class.
 * @returns {string} The corresponding endscreen animation class.
 */
function getEndscreenAnimationClass(themeData: ThemeData): string {
    switch (themeData.id) {
        case "code":
            return "endscreen-enter-top";
        case "gaming":
            return "endscreen-enter-bottom";
        case "daProjects":
            return "endscreen-enter-left";
        case "food":
            return "endscreen-enter-right";
        default:
            return "endscreen-enter-top";
    }
}