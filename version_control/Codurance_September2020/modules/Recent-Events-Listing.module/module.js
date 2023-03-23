const SELECTORS = {
  navigationControl: true,
  trackSelector: "[data-past-card-track]",
  cardsSelector: "[data-past-card]",
  leftButtonSelector: "[data-past-events-button-left]",
  rightButtonSelector: "[data-past-events-button-right]",
  ctaContainerSelector: "[data-past-events-newsletter-cta]"
};

function init() {
  SELECTORS.slider = document.querySelector("[data-past-card-window]");

  const cardSlider = new CardSlider(SELECTORS);
  cardSlider.init();
}

window.addEventListener("DOMContentLoaded", init);
