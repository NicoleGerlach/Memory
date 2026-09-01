import { themes } from "./data.js";
import { SVG_ICONS } from "./svgIcons.js";
import {
  BoardSize,
  SettingsItem,
  ThemeId,
  Player,
} from "../interfaces/settings-data.interface.js";
import { preSelectedTheme } from "./data.js";

/** Creates a new element with the given tag name for functions with text, sets its text content, adds optional classes,
 * and optionally assigns an ID. */
export function createElementWithText(
  el: string,
  elClasses: string[] | null,
  elId: string | null,
  elText: string,
): HTMLElement {
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

/** Creates a new element with the given tag name, adds optional classes,
 * and optionally assigns an ID. */
export function createElementWithoutText(
  el: string,
  elClasses: string[] | null,
  elId: string | null,
): HTMLElement {
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

/** Creates and returns a wrapper. */
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

/** Creates and returns list elements. */
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

/** Creates and returns a complete list off all elements. */
export function createList(
  listClass: string,
  itemClass: string,
  array: SettingsItem[],
  radioName: string,
): HTMLUListElement {
  const list = document.createElement("ul");
  list.classList.add(listClass);
  array.forEach((item) => list.append(createListItem(item, itemClass, radioName)));
  return list;
}

/** Creates an input field of the given type, assigns name and value, and marks it as checked if it matches the
 * predefined theme preSelectedTheme. If there is no match, it remains unchecked. */
export function createInputField(
  type: string,
  btnName: string,
  btnValue: string,
): HTMLInputElement {
  const newInputElement = document.createElement("input");
  newInputElement.type = type;
  newInputElement.name = btnName;
  newInputElement.value = btnValue;
  if (newInputElement.value === preSelectedTheme) {
    newInputElement.checked = true;
  }
  return newInputElement;
}

/** The function creates a new image Element and adds optional CSS classes. */
export function createImageElement(
  pathPrefix: string,
  iconPath: string,
  imgClasses: string[] | null,
): HTMLImageElement {
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

/** Creates a new svg element and adds optional CSS classes. */
export function createSvgElement(
  iconPath: string,
  svgClasses: string[] | null,
): HTMLElement {
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

/** Creates a player score wrapper element:
 * - builds a div wrapper with color and layout classes,
 * - adds an SVG icon,
 * - displays the score */
export function createPlayerScoreWrapper(
  color: string,
  iconName: string,
  score: number,
): HTMLElement {
  const wrapper = createElementWithoutText("div", [color, "player-score"], null);
  const playerIcon = createSvgElement(iconName, ["score-player-icon", color]);
  const pointsSpan = createElementWithText("span", ["score-value", "score-points"], null, String(score));
  const playerSpan = createElementWithText("span", ["score-value", "score-player"], null, color);
  wrapper.append(playerIcon, pointsSpan, playerSpan);
  return wrapper;
}

/** The function returns the corresponding theme. */
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

/** The function returns the corresponding player. */
export function getPlayerSelection(item: Player) {
  switch (item) {
    case "blue":
      return "Blue Player";
    case "orange":
      return "Orange Player";
  }
}

/** The function returns the corresponding board size. */
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