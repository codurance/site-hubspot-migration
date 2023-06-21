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

searchBarButton.addEventListener("mouseenter", () => {
  searchBarButton.setAttribute("aria-expanded", "true");
});

searchBarButton.addEventListener("focus", () => {
  searchBarButton.setAttribute("aria-expanded", "true");
});

searchBar.addEventListener("mouseleave", () => {
  if (searchBarInput === document.activeElement) return;
  searchBarButton.setAttribute("aria-expanded", "false");
});

searchBarButton.addEventListener("mouseenter", () => {
  searchBarButton.setAttribute("aria-expanded", "true");
});

searchBarInput.addEventListener("blur", () => {
  searchBarButton.setAttribute("aria-expanded", "false");
});

// This is required to stop the blur event when clicking on suggestions
searchSuggestions.addEventListener("mousedown", (event) => {
  event.preventDefault();
});
