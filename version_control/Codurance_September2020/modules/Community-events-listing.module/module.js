const SELECTORS = {
  navigationControl: true,
  cardWindowSelector: '[data-community-card-window]',
  trackSelector: '[data-community-card-track]',
  cardsSelector: '[data-community-card]',
  leftButtonSelector: '[data-community-events-button-left]',
  rightButtonSelector: '[data-community-events-button-right]',
  ctaContainerSelector: '[data-community-events-newsletter-cta]'
};

function init() {
  const cardSlider = new CardSlider(SELECTORS);
  cardSlider.init();
}

window.addEventListener('DOMContentLoaded', init);
