const SELECTORS = {
  navigationControl: true,
  cardWindowSelector: "[data-upcoming-card-window]",
  trackSelector: "[data-upcoming-card-track]",
  cardsSelector: ".card-slider-item",
  leftButtonSelector: "[data-upcoming-events-button-left]",
  rightButtonSelector: "[data-upcoming-events-button-right]",
  ctaContainerSelector: "[data-upcoming-events-newsletter-cta]"
};

function init() {
  const sliders = document.querySelectorAll(SELECTORS.cardWindowSelector);

  sliders.forEach((slider) => {
    SELECTORS.slider = slider;

    const cardSlider = new CardSlider(SELECTORS);
    cardSlider.init();
  });

  getLocalTimeDate();
}

function getLocalTimeDate() {
  let dateArray = document.querySelectorAll(".upcoming-events");

  Array.from(dateArray).map((item) => {
    let timeToConvers = item.getAttribute("data-time");

    const timeOptions = {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "long"
    };
    let localTime = new Date(parseInt(timeToConvers)).toLocaleTimeString(
      "en-US",
      timeOptions
    );

    const dateOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    let localDate = new Date(parseInt(timeToConvers)).toLocaleDateString(
      "en-US",
      dateOptions
    );
    localDate = localDate.replace(/,/g, " ");

    item.innerHTML = `${localDate} | ${localTime} `;
  });
}

window.addEventListener("DOMContentLoaded", init);
