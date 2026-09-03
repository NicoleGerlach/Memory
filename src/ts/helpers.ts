import { themes } from "./data.js";
import { SVG_ICONS } from "./svgIcons.js";
import {
  BoardSize,
  SettingsItem,
  ThemeId,
  Player,
} from "../interfaces/settings-data.interface.js";
import { preSelectedTheme } from "./data.js";

/** 
 * Creates a new element with the given tag name for functions with text, sets its text content, adds optional classes,
 * and optionally assigns an ID. 
 * @param {string} el - The tag name of the element to be created.
 * @param {string[] | null} elClasses - An array of CSS classes to be added to the element, or null if no classes are to be added.
 * @param {string | null} elId - The ID to be assigned to the element, or null if no ID is to be assigned.
 * @param {string} elText - The text content to be set for the element.
 * @returns {HTMLElement} The newly created HTML element with the specified properties.
 */
export function createElementWithText(el: string, elClasses: string[] | null, elId: string | null, elText: string): HTMLElement {
  const element = document.createElement(el);
  element.textContent = elText;
  if (elClasses && elClasses?.length > 0) {
    for (const elClass of elClasses) {
      element.classList.add(elClass);
    }
  }
  if (elId) {
    element.id = elId;
  }
  return element;
}

/** 
 * Creates a new element with the given tag name, adds optional classes,
 * and optionally assigns an ID. 
 * @param {string} el - The tag name of the element to be created.
 * @param {string[] | null} elClasses - An array of CSS classes to be added to the element, or null if no classes are to be added.
 * @param {string | null} elId - The ID to be assigned to the element, or null if no ID is to be assigned.
 * @returns {HTMLElement} The newly created HTML element with the specified properties.
 */
export function createElementWithoutText(el: string, elClasses: string[] | null, elId: string | null): HTMLElement {
  const element = document.createElement(el);
  if (elClasses && elClasses?.length > 0) {
    for (const elClass of elClasses) {
      element.classList.add(elClass);
    }
  }
  if (elId) {
    element.id = elId;
  }
  return element;
}

/** 
 * Creates and returns a wrapper. 
 * @returns {HTMLDivElement} The newly created div wrapper with the specified properties.
*/
function createDecoratorWrapper() {
  const wrapper = document.createElement("div");
  const lineSmall = document.createElement("div");
  const diamondSmall = document.createElement("div");
  wrapper.classList.add("line-wrap-small");
  lineSmall.classList.add("line-small");
  diamondSmall.classList.add("diamond-small");
  wrapper.append(lineSmall, diamondSmall);
  return wrapper;
}

/** 
 * Creates and returns list elements. 
 * @param {SettingsItem} item - The settings item containing the label and ID for the list item.
 * @param {string} itemClass - The CSS class to be added to the list item.
 * @param {string} radioName - The name attribute for the radio input field.
 * @returns {HTMLLIElement} The newly created list item with the specified properties.
*/
function createListItem(item: SettingsItem, itemClass: string, radioName: string) {
  const li = document.createElement("li");
  const label = document.createElement("label");
  const radioBtn = createInputField("radio", radioName, item.id);
  const text = document.createElement("span");
  text.textContent = item.label;
  text.classList.add("list-text");
  li.classList.add(itemClass);
  label.append(radioBtn, text, createDecoratorWrapper());
  li.append(label);
  return li;
}

/** 
 * Creates and returns a complete list off all elements. 
 * @param {string} listClass - The CSS class to be added to the unordered list.
 * @param {string} itemClass - The CSS class to be added to each list item.
 * @param {SettingsItem[]} array - An array of settings items to be included in the list.
 * @param {string} radioName - The name attribute for the radio input fields within the list items. 
 * @returns {HTMLUListElement} The newly created unordered list with the specified properties.
 */
export function createList(listClass: string, itemClass: string, array: SettingsItem[], radioName: string): HTMLUListElement {
  const list = document.createElement("ul");
  list.classList.add(listClass);
  array.forEach((item) => list.append(createListItem(item, itemClass, radioName)));
  return list;
}

/** 
 * Creates an input field of the given type, assigns name and value, and marks it as checked if it matches the
 * predefined theme preSelectedTheme. If there is no match, it remains unchecked. 
 * @param {string} type - The type of the input field (e.g., "radio", "checkbox").
 * @param {string} btnName - The name attribute for the input field.
 * @param {string} btnValue - The value attribute for the input field.
 * @returns {HTMLInputElement} The newly created input element with the specified properties.
 */
export function createInputField(type: string, btnName: string, btnValue: string): HTMLInputElement {
  const newInputElement = document.createElement("input");
  newInputElement.type = type;
  newInputElement.name = btnName;
  newInputElement.value = btnValue;
  if (newInputElement.value === preSelectedTheme) {
    newInputElement.checked = true;
  }
  return newInputElement;
}

/** 
 * The function creates a new image Element and adds optional CSS classes. 
 * @param {string} pathPrefix - The prefix to be added to the image path.
 * @param {string} iconPath - The path to the image icon.
 * @param {string[] | null} imgClasses - An array of CSS classes to be added to the image element, or null if no classes are to be added.
 * @returns {HTMLImageElement} The newly created image element with the specified properties.
 */
export function createImageElement(pathPrefix: string, iconPath: string, imgClasses: string[] | null): HTMLImageElement {
  const img = document.createElement("img");
  img.src = pathPrefix + iconPath;
  img.alt = "";
  if (imgClasses && imgClasses?.length > 0) {
    for (const elClass of imgClasses) {
      img.classList.add(elClass);
    }
  }
  return img;
}

/** 
 * Creates a new svg element and adds optional CSS classes. 
 * @param {string} iconPath - The path to the SVG icon.
 * @param {string[] | null} svgClasses - An array of CSS classes to be added to the SVG element, or null if no classes are to be added.
 * @returns {HTMLElement} The newly created svg element with the specified properties.
 */
export function createSvgElement(iconPath: string, svgClasses: string[] | null): HTMLElement {
  const markup = SVG_ICONS[iconPath];
  if (!markup) throw new Error (`SVG nicht gefunden: ${iconPath}`);
  const temp = document.createElement("div");
  temp.innerHTML = markup;
  const svg = temp.querySelector("svg") as HTMLElement | null;
  if (!svg) throw new Error (`Kein <svg> in ${iconPath}`);
  if (svgClasses && svgClasses.length >  0) {
    svg.classList.add(...svgClasses);
  }
  return svg;
}

/** 
 * Creates a player score wrapper element witdh the specified color, icon, and score.
 * @param {string} color - The color to be applied to the player score wrapper.
 * @param {string} iconName - The name of the icon to be used for the player score.
 * @param {number} score - The score value to be displayed in the player score wrapper.
 * @returns {HTMLElement} The newly created player score wrapper element with the specified properties.
 */
export function createPlayerScoreWrapper(color: string, iconName: string, score: number): HTMLElement {
  const wrapper = createElementWithoutText("div", [color, "player-score"], null);
  const playerIcon = createSvgElement(iconName, ["score-player-icon", color]);
  const pointsSpan = createElementWithText("span", ["score-value", "score-points"], null, String(score));
  const playerSpan = createElementWithText("span", ["score-value", "score-player"], null, color);
  wrapper.append(playerIcon, pointsSpan, playerSpan);
  return wrapper;
}

/** 
 * The function returns the corresponding theme.
 * @param {ThemeId} item - The theme ID for which to return the label.
 * @returns {string} The label for the specified theme ID.
 */
export function getThemeSelection(item: ThemeId) {
  switch (item) {
    case "codeVibes":
      return themes.codeVibes.label;
    case "gaming":
      return themes.gaming.label;
    case "daProjects":
      return themes.daProjects.label;
    case "food":
      return themes.food.label;
  }
}

/** 
 * The function returns the corresponding player.
 * @param {Player} item - The player for which to return the label.
 * @returns {string} The label for the specified player.
 */
export function getPlayerSelection(item: Player) {
  switch (item) {
    case "blue":
      return "Blue Player";
    case "orange":
      return "Orange Player";
  }
}

/** 
 * The function returns the corresponding board size.
 * @param {BoardSize} item - The board size for which to return the label.
 * @returns {string} The label for the specified board size.
 */
export function getBoardSizeSelection(item: BoardSize) {
  switch (item) {
    case "16":
      return "16 cards";
    case "24":
      return "24 cards";
    case "36":
      return "36 cards";
  }
}