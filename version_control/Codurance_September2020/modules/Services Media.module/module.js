const SELECTORS = {
    navigationControl: false,
    cardWindowSelector: '[data-services-media-card-window]',
    trackSelector: '[data-services-media-card-track]',
    cardsSelector: '[data-services-media-card]'
  };
  
  function init() {
    const cardSlider = new CardSlider(SELECTORS);
    cardSlider.init();
  }
  
  window.addEventListener('DOMContentLoaded', init);
  