const SELECTORS = {
    cardWindowSelector: '[data-past-card-window]',
    trackSelector: '[data-past-card-track]',
    cardsSelector: '[data-past-card]',
    leftButtonSelector: '[data-past-events-button-left]',
    rightButtonSelector: '[data-past-events-button-right]',
  };
  
  const cardSlider = new CardSlider(SELECTORS);
  
  window.addEventListener('DOMContentLoaded', cardSlider.init);