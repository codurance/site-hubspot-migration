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
  const eventTitle = eventCard.dataset.eventTitle;
  const eventDescription = eventCard.dataset.eventDescription;
  const eventLink = eventCard.dataset.eventLink;
  const eventType = eventCard.dataset.eventType;
  const eventDate = eventCard.dataset.eventDate;
  const eventBackgroundImage = eventCard.dataset.eventBackgroundImage;

  const modalTitle = eventModal.querySelector(".event-modal__title");
  modalTitle.textContent = eventTitle;
}