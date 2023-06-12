"use strict";

const languageSelector = document.querySelector(".language-selector__button");
const SCREEN_SIZE = 1023;

function toggleLanguageDropdown(languageSelector) {
  let ariaExpanded = languageSelector.getAttribute("aria-expanded");

  if (ariaExpanded === "false") {
    return languageSelector.setAttribute("aria-expanded", "true");
  }

  languageSelector.setAttribute("aria-expanded", "false");
}

function addClickEvent() {
  languageSelector.addEventListener("click", () =>
    toggleLanguageDropdown(languageSelector)
  );
}

function removeClickEvent() {
  languageSelector.removeEventListener("click", () =>
    toggleLanguageDropdown(languageSelector)
  );
}

window.addEventListener("resize", () => {
  window.innerWidth > SCREEN_SIZE ? removeClickEvent() : addClickEvent();
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth < SCREEN_SIZE) addClickEvent();

  languageSelector.addEventListener("focus", function() {
    languageSelector.parentElement.classList.add("focus");
    toggleLanguageDropdown(languageSelector);
  });

});
