import { themes } from "./data.js";

import {
  BoardSize,
  SettingsItem,
  ThemeId,
  Player,
} from "../interfaces/settings-data.interface.js";
import { preSelectedTheme } from "./data.js";

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

export function createList(
  listClass: string,
  itemClass: string,
  array: SettingsItem[],
  radioName: string,
): HTMLUListElement {
  const list = document.createElement("ul");
  list.classList.add(listClass);

  for (const item of array) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const radioBtn = createInputField("radio", radioName, item.id);
    const text = document.createElement("span");

    const element = document.createElement('div');
    const lineSmall = document.createElement('div');
    const diamondSmall = document.createElement('div');

    text.textContent = item.label;

    element.append(lineSmall, diamondSmall);
    element.classList.add('line-wrap-small');
    lineSmall.classList.add('line-small');
    diamondSmall.classList.add('diamond-small');

    li.classList.add(itemClass);
    label.append(radioBtn, text, element);
    li.append(label);
    list.append(li);
  }
  return list;
}

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

export function createPlayerScoreWrapper(
  color: string,
  imgPath: string,
  score: number,
): HTMLElement {
  const wrapper = createElementWithoutText("div", [color, "player-score"], null,);
  const playerIcon = createImageElement("/assets/img/ui/", imgPath, null);
  const playerDescription = createElementWithText("span", [color], null, color);
  const playerScore = createElementWithText("span", [color], null, String(score));
  wrapper.append(playerIcon, playerDescription, playerScore);
  return wrapper;
}


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

export function getPlayerSelection(item: Player) {
  switch (item) {
    case "blue":
      return "Blue Player";
    case "orange":
      return "Orange Player";
  }
}

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