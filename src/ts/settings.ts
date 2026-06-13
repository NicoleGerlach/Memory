
import { SettingsData, SettingsDatas } from "./interfaces/settings-data.interface";
import { createElementWithText } from "./helpers";
import { createElementWithoutText } from "./helpers";
import { createList } from "./helpers";
import { createImageElement } from "./helpers";

function init() {
    renderSettings();
    addRadioButtonsListeners();
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
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });
}

function updatePreview() {
    const selectedTheme = getSelectedValue('game-theme');
    const selectedPlayer = getSelectedValue('player');
    renderPreview(selectedTheme, selectedPlayer);
}

function getSelectedValue(radioName: string): string | null {
    const el = document.querySelector(
        `input[name="${radioName}"]:checked`
    ) as HTMLInputElement | null;
    return el ? el.value : null;
}

function renderPreview(theme: string | null, player: string | null) {
    let previewContainer = document.querySelector('#preview_game_theme') as HTMLElement | null;

    if (!previewContainer) {
        previewContainer = createElementWithoutText('div', 'preview-game-theme', 'preview_game_theme');
        document.body.append(previewContainer);
    }

    previewContainer.innerHTML = '';

    const preview = createElementWithoutText('div', 'preview', null,);

    if (theme) {
        const themePreview = createElementWithoutText('div', 'player-preview', null);
        if (theme === 'Code vibes theme') {
            preview.style.color = '#00ff00';
            themePreview.textContent = '💻 Code Vibes Theme';
        } else if (theme === 'Gaming theme' || theme === 'Game theme' || theme === 'Gaming Theme') {
            preview.style.color = '#ffffff';
            themePreview.textContent = '🎮 Gaming Theme';
        } else {
            themePreview.textContent = theme;
        }
        preview.appendChild(themePreview);
    }

    if (player) {
        const currentPlayer = document.querySelector('#current_player') as HTMLElement | null;
        if (currentPlayer) {
            const old = currentPlayer.querySelector('.player-preview');
            if (old) old.remove();
        }
        const playerWrapper = createElementWithoutText('div', 'player-preview', null);
        const map: Record<string, string> = {
            blue: '/public/assets/img/code_blue.svg',
            orange: '/public/assets/img/code_orange.svg',
        };
        const key = player.trim().toLowerCase();
        const src = map[key];
        if (src) {
            const img = createImageElement(src);
            img.alt = `${player} Player`;
            playerWrapper.appendChild(img);
        }
        currentPlayer?.appendChild(playerWrapper);
    }
    previewContainer.appendChild(preview);
}

init();
