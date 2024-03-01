"use strict";

const listOfModules = document.querySelectorAll(".modules-listing__button");
const firstModuleOfList = listOfModules[0];

loadModule(firstModuleOfList);

function loadModule(module) {
  setActiveModule(module);
  loadModuleInfo(module);
}

listOfModules.forEach((module) =>
  module.addEventListener("click", buttonHandler)
);

function buttonHandler(event) {
  const module = event.target;
  unsetCurrentActiveModule();
  loadModule(module);
}

function unsetCurrentActiveModule() {
  const currentActiveModule = document.querySelector(
    ".modules-listing__button--active"
  );

  currentActiveModule.classList.remove("modules-listing__button--active");
}

function setActiveModule(module) {
  module.classList.add("modules-listing__button--active");
}

function loadModuleInfo(module) {
  const moduleImage = module.dataset.image;
  const moduleTitle = module.dataset.title;
  const moduleDescription = module.dataset.description;

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