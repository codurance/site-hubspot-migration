"use strict";

const listOfModules = document.querySelectorAll(".modules-listing__button");

listOfModules.forEach((button) =>
  button.addEventListener("click", loadModuleInfo)
);

function loadModuleInfo(event) {
  const button = event.target;
  const moduleImage = button.dataset.image;
  const moduleTitle = button.dataset.title;
  const moduleDescription = button.dataset.description;

  hideDescriptionContainer();

  const imageContainer = document.querySelector(".module-description__image");
  const titleContainer = document.querySelector(".module-description__title");
  const descriptionContainer = document.querySelector(
    ".module-description__text"
  );
  imageContainer.src = moduleImage;
  titleContainer.textContent = moduleTitle;
  descriptionContainer.textContent = moduleDescription;

  setTimeout(showDescriptionContainer, "100");
}

function hideDescriptionContainer() {
  const descriptionContainer = document.querySelector(".module-description");
  descriptionContainer.classList.add("module-description--hidden");
}

function showDescriptionContainer() {
  const descriptionContainer = document.querySelector(".module-description");
  descriptionContainer.classList.remove("module-description--hidden");
}