const SELECTORS = {
  navigationControl: false,
  cardWindowSelector: "[data-services-media-card-window]",
  trackSelector: "[data-services-media-card-track]",
  cardsSelector: "[data-services-media-card]",
  filters: true,
  filterButtonSelector: "[data-card-filter-button]",
  cardTypeSelector: "[data-card-type]",
  cardHeadingSelector: "[data-card-heading]",
  watchAllCtaSelector: "[data-watch-all-cta]"
};

function init() {
  const cardSlider = new CardSlider(SELECTORS);
  cardSlider.init();
}

window.addEventListener("DOMContentLoaded", init);
