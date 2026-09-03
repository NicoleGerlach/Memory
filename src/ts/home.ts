import "../styles/entries/global.scss";
import "../styles/entries/home.scss";

/**
 * Initializes the application, calls setupEventListeners.
 */
function init(): void {
  setupEventListeners();
}

/**
 * Adds mouse enter/mouse leave listeners to #play_link and calls exchangeArrow in the process.
 */
function setupEventListeners(): void {
  const playLink = document.querySelector("#play_link");
  playLink?.addEventListener("mouseenter", function () {
    exchangeArrow(true);
  });
  playLink?.addEventListener("mouseleave", function () {
    exchangeArrow(false);
  });
}

/**
 * Exchanges the arrow icon based on the hover state.
 * @param {boolean} shouldExchangeArrow - Determines whether to exchange the arrow icon or not.
 */
function exchangeArrow(shouldExchangeArrow: boolean): void {
  const arrowIcon = document.querySelector<HTMLImageElement>("#link_arrow");
  if (!arrowIcon) return;
  arrowIcon.src = shouldExchangeArrow
    ? "/assets/img/ui/arrow_thick.svg"
    : "/assets/img/ui/arrow.svg";
}

init();