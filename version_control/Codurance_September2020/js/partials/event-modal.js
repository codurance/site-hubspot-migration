"use strict";

const eventModal = document.querySelector(".event-modal");
const eventCardButtons = document.querySelectorAll(
  ".card-slider-item__event-button"
);

eventCardButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const eventCard = button.closest(".card-slider-item");
    loadEventToModal(eventCard);
    eventModal.showModal();
  })
);

function loadEventToModal(eventCard) {
  const eventDescription = eventCard.dataset.eventDescription;
  const eventLink = eventCard.dataset.eventLink;
  const eventType = eventCard.dataset.eventType;
  const eventDate = eventCard.dataset.eventDate;

  loadHeaderBackgroundImage(eventCard);
  loadName(eventCard);
}

function loadHeaderBackgroundImage(eventCard) {
  const eventBackgroundImage = eventCard.dataset.eventBackgroundImage;
  const modalHeader = eventModal.querySelector(".event-modal__header");

  if (eventBackgroundImage) {
    modalHeader.style.backgroundImage = `url(${eventBackgroundImage})`;
  } else {
    modalHeader.style.backgroundImage = "";
  }
}

function loadName(eventCard) {
  const eventName = eventCard.dataset.eventName;
  const modalName = eventModal.querySelector(".event-modal__name");
  modalName.textContent = eventName;

  const eventNameColorTheme = eventCard.dataset.eventNameColorTheme;
  if (eventNameColorTheme === "Dark") {
    modalName.classList.add("event-modal__name--dark");
  } else {
    modalName.classList.remove("event-modal__name--dark");
  }
}
