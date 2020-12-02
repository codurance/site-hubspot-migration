const SELECTORS = {
  cardWindowSelector: '[data-card-window]',
  trackSelector: '[data-card-track]',
  cardsSelector: '[data-card]',
  leftButtonSelector: '[data-up-events-button-left]',
  rightButtonSelector: '[data-up-events-button-right]'
}

const cardSlider = new CardSlider(SELECTORS);

window.addEventListener('DOMContentLoaded', cardSlider.init);
