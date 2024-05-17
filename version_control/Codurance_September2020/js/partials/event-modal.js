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
  const eventType = eventCard.dataset.eventType;
  const eventDate = eventCard.dataset.eventDate;

  loadHeaderBackgroundImage(eventCard);
  loadName(eventCard);
  loadDescription(eventCard);
  loadLink(eventCard);
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
                               const modalName = eventModal.querySelector(
                                 ".event-modal__name"
                               );
                               modalName.textContent = eventName;

                               const eventNameColorTheme =
                                 eventCard.dataset.eventNameColorTheme;
                               if (eventNameColorTheme === "Dark") {
                                 modalName.classList.add(
                                   "event-modal__name--dark"
                                 );
                               } else {
                                 modalName.classList.remove(
                                   "event-modal__name--dark"
                                 );
                               }
                             }

function loadDescription(eventCard) {
  const eventDescription = eventCard.dataset.eventDescription;
  const modalText = eventModal.querySelector(".event-modal__text");

  modalText.innerHTML = eventDescription;
}

function loadLink(eventCard) {
  const eventLink = eventCard.dataset.eventLink;
  const modalLink = eventModal.querySelector(".event-modal__link");

  modalLink.href = eventLink;
}