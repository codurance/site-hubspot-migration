"use strict";

const searchBarButton = document.querySelector(
  ".utilities-menu .search-bar__button"
);
const searchBar = document.querySelector(".utilities-menu .hs-search-field");
const searchBarInput = document.querySelector(
  ".utilities-menu .hs-search-field__input"
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

searchBarInput.addEventListener("blur", () => {
  searchBarButton.setAttribute("aria-expanded", "false");
});
