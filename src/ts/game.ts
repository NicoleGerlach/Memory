
import { createElementWithoutText } from "./helpers";
import { createImageElement } from "./helpers";

function getGameSettings() {
    return {
        theme: localStorage.getItem('selectedTheme'),
        player: localStorage.getItem('selectedPlayer'),
        board: localStorage.getItem('selectedBoard')
    };
}

function init() {
    const settings = getGameSettings();
    renderCurrentPlayer(settings.player);
    console.log('init game.ts wird ausgeführt');
}

function renderCurrentPlayer(player: string | null): void {
    const currentPlayer = document.querySelector('#current_player') as HTMLImageElement | null;
    if (!currentPlayer || !player) return
    // currentPlayer.innerHTML = '';
    const playerImageMap: Record<string, string> = {
        blue: '/assets/img/ui/code_blue.svg',
        orange: '/assets/img/ui/code_orange.svg'
    };
    console.log(player);
    
    const normalizedPlayer = player.trim().toLowerCase();
  const playerImgSrc = playerImageMap[normalizedPlayer];
  if (!playerImgSrc) return;
  const wrapper = createElementWithoutText('div', 'current-player-preview', null);
  const img = createImageElement(playerImgSrc);
  img.alt = `${player} player`;
  img.classList.add('current-player-image');
  wrapper.appendChild(img);
  currentPlayer.appendChild(wrapper);
}

init();