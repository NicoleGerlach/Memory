
import { SettingsData, SettingsDatas } from "./interfaces/settings-data.interface";
import { createElementWithText } from "./helpers";
import { createElementWithoutText } from "./helpers";
import { createList } from "./helpers";
import { createImageElement } from "./helpers";

const DEFAULT_THEME_LABEL = 'Code vibes theme';
function init() {
  renderSettings();
  addRadioButtonsListeners();
  // const DEFAULT_THEME_LABEL = 'Code vibes theme';
  const defaultThemeRadio = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="game-theme"]')
  ).find(r => r.value.trim().toLowerCase() === DEFAULT_THEME_LABEL.toLowerCase());
  if (defaultThemeRadio) defaultThemeRadio.checked = true;
  updateGroupSelectedClass('game-theme');
  renderPreview(DEFAULT_THEME_LABEL);
}

function renderSettings() {
  const settingsBox = document.querySelector('#settings_box');
  if (settingsBox) {
    for (const sectionData of SettingsDatas) {
      const section = renderSettingsBox(sectionData);
      settingsBox.append(section);
    }
  }
}

function renderSettingsBox(data: SettingsData): HTMLElement {
  const box = createElementWithoutText('section', `${data.type}-box`, null);
  const titleWrapper = createElementWithoutText('span', 'title-wrapper', null);
  const img = createImageElement(data.iconPath);
  const title = createElementWithText('h2', `${data.type}-title`, null, data.title);
  titleWrapper.append(img, title);
  const list = createList(`${data.type}-list`, 'list-element', data.items, data.radioName);
  box.append(titleWrapper, list);
  return box;
}

function addRadioButtonsListeners() {
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      const groupName = input.name;
      updateGroupSelectedClass(groupName);
      if (groupName === 'game-theme') {
        const selectedTheme = getSelectedValue('game-theme');
        renderPreview(selectedTheme);
      }
    });
  });
}

function updateGroupSelectedClass(groupName: string) {
  const groupUl = document.querySelector(`.group-${groupName}`) as HTMLUListElement | null;
  if (!groupUl) return;
  const hasChecked = !!groupUl.querySelector('input[type="radio"]:checked');
  groupUl.classList.toggle('selected', hasChecked);
  activateStartBtn();

}

function getSelectedValue(radioName: string): string | null {
  const el = document.querySelector(
    `input[name="${radioName}"]:checked`
  ) as HTMLInputElement | null;
  return el ? el.value : null;
}

function renderPreview(theme: string | null) {
  let previewContainer = document.querySelector('#preview_box') as HTMLElement | null;
  if (!previewContainer) {
    previewContainer = createElementWithoutText('div', 'preview-game-theme', 'preview_game_theme');
    document.body.append(previewContainer);
  }
  previewContainer.innerHTML = '';
  const preview = createElementWithoutText('div', 'preview', null);
  const themeImageMap: Record<string, string> = {
    'code vibes theme': '/assets/img/code/codepreview.svg',
    'gaming theme': '/assets/img/gaming/gamepreview.svg',
  };
  const normalizedTheme = (theme ?? DEFAULT_THEME_LABEL).trim().toLowerCase();
  const themeImgSrc = themeImageMap[normalizedTheme] ?? '/assets/img/code/codepreview.svg';
  const themePreview = createElementWithoutText('div', 'theme-preview', null);
  const img = createImageElement(themeImgSrc);
  img.alt = `${theme ?? DEFAULT_THEME_LABEL} Preview`;
  img.classList.add('theme-image');
  themePreview.appendChild(img);
  preview.appendChild(themePreview);
  previewContainer.appendChild(preview);
}

function activateStartBtn() {
  const selectedTheme = getSelectedValue('game-theme');
  const selectedPlayer = getSelectedValue('player');
  const selectedBoard = getSelectedValue('board-size');
  if (selectedTheme && selectedPlayer && selectedBoard) {
    console.log(selectedTheme, selectedPlayer, selectedBoard);
    const btn = document.querySelector('#start_btn');
    if (btn) {
      btn.removeAttribute('disabled');
    }
  }
}

function startGame() {
  window.location.assign('/src/pages/game.html');
};
document.querySelector('#start_btn')?.addEventListener('click', startGame);

init();
