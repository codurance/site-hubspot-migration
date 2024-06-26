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
  loadHeaderBackgroundImage(eventCard);
  loadName(eventCard);
  loadDescription(eventCard);
  loadLink(eventCard);
  loadType(eventCard);
  loadDatetime(eventCard);
  loadAddress(eventCard);
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

function loadDescription(eventCard) {
  const eventDescription = eventCard
    .querySelector(".card-slider-item__description")
    .content.cloneNode(true);
  const modalText = eventModal.querySelector(".event-modal__text");

  modalText.innerHTML = "";
  modalText.append(eventDescription);
}

function loadLink(eventCard) {
  const eventLink = eventCard.dataset.eventLink;
  const modalLink = eventModal.querySelector(".event-modal__link");

  modalLink.href = eventLink;
}

function loadType(eventCard) {
  const eventType = eventCard.dataset.eventType;
  const modalType = eventModal.querySelector(".event-modal__type");

  modalType.textContent = eventType;
}

function loadDatetime(eventCard) {
  const eventDatetime = eventCard.dataset.eventDatetime;
  const modalDatetime = eventModal.querySelector(".event-modal__datetime");

  modalDatetime.textContent = eventDatetime;
}

function loadAddress(eventCard) {
  const eventAddress = eventCard.dataset.eventAddress;
  const modalAddress = eventModal.querySelector(".event-modal__address");
  const modalDetails = eventModal.querySelector(".event-modal__details");
  const googleMap = document
    .querySelector(".event-map-template")
    .content.cloneNode(true);

  removeModalMapIfExists();

  if (eventAddress) {
    modalAddress.textContent = eventAddress;

    const encodedAddress = encodeURIComponent(eventAddress);
    const googleMapElement = googleMap.querySelector("iframe");
    googleMapElement.src = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    modalDetails.append(googleMapElement);
  } else {
    modalAddress.textContent = "Zoom";
  }
}

function removeModalMapIfExists() {
  const modalMap = eventModal.querySelector(".event-modal__map");

  if (modalMap) modalMap.remove();
}