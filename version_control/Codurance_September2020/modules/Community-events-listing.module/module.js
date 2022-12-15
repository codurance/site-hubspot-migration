const SELECTORS = {
  navigationControl: true,
  cardWindowSelector: "[data-community-card-window]",
  trackSelector: "[data-community-card-track]",
  cardsSelector: "[data-community-card]",
  leftButtonSelector: "[data-community-events-button-left]",
  rightButtonSelector: "[data-community-events-button-right]",
  ctaContainerSelector: "[data-community-events-newsletter-cta]"
};

function init() {
  const cardSlider = new CardSlider(SELECTORS);
  cardSlider.init();
  getLocalTimeDate();
}

function getLocalTimeDate() {
  let dateArray = document.querySelectorAll(".commmuity-events");

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
