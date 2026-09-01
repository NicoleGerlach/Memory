import "../styles/entries/global.scss";
import "../styles/entries/home.scss";

function init(): void {
  setupEventListeners();
}

function setupEventListeners(): void {
  const playLink = document.querySelector("#play_link");
  playLink?.addEventListener("mouseenter", function () {
    exchangeArrow(true);
  });
  playLink?.addEventListener("mouseleave", function () {
    exchangeArrow(false);
  });
}

function exchangeArrow(shouldExchangeArrow: boolean): void {
  const arrowIcon = document.querySelector<HTMLImageElement>("#link_arrow");
  if (!arrowIcon) return;
  arrowIcon.src = shouldExchangeArrow
    ? "/assets/img/ui/arrow_thick.svg"
    : "/assets/img/ui/arrow.svg";
}

init();