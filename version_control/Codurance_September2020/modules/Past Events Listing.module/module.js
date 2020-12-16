const SELECTORS = {
  navigationControl: true,
  cardWindowSelector: '[data-past-card-window]',
  trackSelector: '[data-past-card-track]',
  cardsSelector: '[data-past-card]',
  leftButtonSelector: '[data-past-events-button-left]',
  rightButtonSelector: '[data-past-events-button-right]',
};

function init() {
  const cardSlider = new CardSlider(SELECTORS);
  cardSlider.init();
}

window.addEventListener('DOMContentLoaded', init);
