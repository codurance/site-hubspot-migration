const SELECTORS = {
  cardWindowSelector: '[data-upcoming-card-window]',
  trackSelector: '[data-upcoming-card-track]',
  cardsSelector: '[data-upcoming-card]',
  leftButtonSelector: '[data-upcoming-events-button-left]',
  rightButtonSelector: '[data-upcoming-events-button-right]',
};

const cardSlider = new CardSlider(SELECTORS);

window.addEventListener('DOMContentLoaded', cardSlider.init);