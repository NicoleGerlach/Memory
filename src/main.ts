
function init() {
    setupEventListeners();
    console.log('init in main.ts wird ausgeführt');
}

function setupEventListeners() {
    const playLink = document.querySelector('#play_link');
    playLink?.addEventListener('mouseenter', function () {
        exchangeArrow(true);
    });

    playLink?.addEventListener('mouseleave', function () {
        exchangeArrow(false);
    });
}

function exchangeArrow(shouldExchangeArrow: boolean) {
    const arrowIcon = document.querySelector<HTMLImageElement>('#link_arrow');
    if (!arrowIcon) return;
    arrowIcon.src = shouldExchangeArrow ? 'assets/img/ui/arrow_thick.svg' : 'assets/img/ui/arrow.svg';
}

init();
