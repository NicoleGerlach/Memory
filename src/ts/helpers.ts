export function createElementWithText(
    el: string,
    elClass: string | null,
    elId: string | null,
    elText: string,
): HTMLElement {
    const element = document.createElement(el);
    element.textContent = elText;
    if (elClass) {
        element.classList.add(elClass);
    }
    if (elId) {
        element.id = elId;
    }
    return element;
}

export function createElementWithoutText(
    el: string,
    elClass: string | null,
    elId: string | null,
): HTMLElement {
    const element = document.createElement(el);
    if (elClass) {
        element.classList.add(elClass);
    }
    if (elId) {
        element.id = elId;
    }
    return element;
}

export function createList(
    listClass: string,
    itemClass: string,
    array: string[],
    radioName: string
): HTMLUListElement {
    const list = document.createElement('ul');
    list.classList.add(listClass);
    for (const item of array) {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const radioBtn = document.createElement('input');
        const text = document.createElement('span');

        radioBtn.type = 'radio';
        radioBtn.name = radioName;
        radioBtn.value = item;
        text.textContent = item;
        li.classList.add(itemClass);
        label.append(radioBtn, text);
        li.append(label);
        list.append(li);
    }
    return list;
}

export function createImageElement(iconPath: string): HTMLImageElement {
    const img = document.createElement('img');
    const pathPrefix = '../../public/assets/img/';
    img.src = pathPrefix + iconPath;
    img.alt = '';
    return img;
}