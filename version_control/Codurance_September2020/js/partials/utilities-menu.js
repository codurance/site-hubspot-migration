"use strict";

const searchBarButton = document.querySelector(
  ".utilities-menu .search-bar__button"
);
const searchBar = document.querySelector(".utilities-menu .hs-search-field");
const searchBarInput = document.querySelector(
  ".utilities-menu .hs-search-field__input"
);
const searchSuggestions = document.querySelector(
  ".utilities-menu .hs-search-field__suggestions"
);

searchBarButton.addEventListener("click", () => {
  searchBarButton.setAttribute("aria-expanded", "true");
  setTimeout(() => searchBarInput.focus(), 500);
});

searchBarButton.addEventListener("focus", () => {
  searchBarButton.setAttribute("aria-expanded", "true");
  setTimeout(() => searchBarInput.focus(), 500);
});

searchBar.addEventListener("click", () => {
  if (searchBarInput === document.activeElement) return;
  searchBarButton.setAttribute("aria-expanded", "false");
});

searchBarInput.addEventListener("blur", () => {
  if (searchBar.classList.contains("hs-search-field--open")) return;
  searchBarButton.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    searchBarButton.setAttribute("aria-expanded", "false");
  }
});

// This is required to stop the blur event when clicking on suggestions
searchSuggestions.addEventListener("mousedown", (event) => {
  event.preventDefault();
});
