"use strict";

const eventModal = document.querySelector(".event-modal");
const eventCardButtons = document.querySelectorAll(
  ".card-slider-item__event-button"
);

eventCardButtons.forEach((button) =>
  button.addEventListener("click", () => {
    eventModal.showModal();
  })
);
