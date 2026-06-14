
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
  list.classList.add(listClass, `group-${radioName}`);
  array.forEach((item, idx) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const radioBtn = document.createElement('input');
    const text = document.createElement('span');
    const element = document.createElement('div');
    const lineSmall = document.createElement('div');
    const diamondSmall = document.createElement('div');
    const id = `${radioName}-${idx}`;
    radioBtn.type = 'radio';
    radioBtn.name = radioName;
    radioBtn.value = item;
    radioBtn.id = id;
    label.setAttribute('for', id);
    text.textContent = item;
    element.append(lineSmall, diamondSmall);
    element.classList.add('line-wrap-small');
    lineSmall.classList.add('line-small');
    diamondSmall.classList.add('diamond-small');
    label.append(text, element);
    li.classList.add(itemClass);
    li.append(radioBtn, label);
    list.append(li);
  });
  return list;
}

export function createImageElement(iconPath: string): HTMLImageElement {
    const img = document.createElement('img');
    const pathPrefix = '';
    img.src = pathPrefix + iconPath;
    img.alt = '';
    return img;
}
