"use strict";

const languageSelector = document.querySelector(".language-selector__button");

languageSelector.addEventListener("click", function() {
  toggleLanguageDropdown(languageSelector);
});

function toggleLanguageDropdown(languageSelector) {
  let ariaExpanded = languageSelector.getAttribute("aria-expanded");

  if (ariaExpanded === "false") {
    return languageSelector.setAttribute("aria-expanded", "true");
  }

  languageSelector.setAttribute("aria-expanded", "false");
}
