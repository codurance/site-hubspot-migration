const SELECTORS = {
  navigationControl: true,
  cardWindowSelector: '[data-upcoming-card-window]',
  trackSelector: '[data-upcoming-card-track]',
  cardsSelector: '[data-upcoming-card]',
  leftButtonSelector: '[data-upcoming-events-button-left]',
  rightButtonSelector: '[data-upcoming-events-button-right]',
  ctaContainerSelector: '[data-upcoming-events-newsletter-cta]'
};

function init() {
  const cardSlider = new CardSlider(SELECTORS);
  cardSlider.init();
}

window.addEventListener('DOMContentLoaded', init);
