 
import { SettingsData, SettingsDatas } from "./interfaces/settings-data.interface";
import { createElementWithText } from "./helpers";
import { createElementWithoutText } from "./helpers";
import { createList } from "./helpers";
import { createImageElement } from "./helpers";

function init() {
    renderSettings();
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

init();
