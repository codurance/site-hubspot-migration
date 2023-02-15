"use strict";

const ungatedButtons = document.querySelectorAll(".icon-ungated");
const overlay = document.querySelector(".overlay");
const popupVideo = document.querySelector(".modal__video");
const closeModalButton = document.querySelector(".close-button");
const modal = document.querySelector(".modal");

ungatedButtons.forEach(openVideoPopupOnClick);

closeModalButton.addEventListener("click", () => hideModal());

document.addEventListener("click", function(event) {
  if (event.target.className === "overlay") hideModal();
});

document.addEventListener("keyup", function(event) {
  if (event.code === "Escape") hideModal();
});

function openVideoPopupOnClick(ungatedButton) {
  ungatedButton.addEventListener("click", setVideoOnPopup);
}

function setVideoOnPopup(event) {
  event.preventDefault();

  const youtubeId = stripYoutubeID(event.target.href);
  const embedPreferences = "?autoplay=1";
  popupVideo.src = `https://www.youtube.com/embed/${youtubeId}${embedPreferences}`;

  showModal();
}

function stripYoutubeID(str) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = str.match(regExp);
  const idLength = 11;

  if (match && match[2].length == idLength) return match[2];

  throw new Error("Expression not found");
}

function showModal() {
  document.body.classList.add("overflow-hidden");
  overlay.style.display = "flex";
  modal.style.opacity = "1";
}

function hideModal() {
  document.body.classList.remove("overflow-hidden");
  overlay.style.display = "none";
  modal.style.opacity = "0";
  popupVideo.src = "";
}
