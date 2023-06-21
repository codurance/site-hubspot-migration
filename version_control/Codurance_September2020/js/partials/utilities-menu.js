"use strict";

const searchBarButton = document.querySelector(
  ".utilities-menu .search-bar__button"
);
const searchBar = document.querySelector(".utilities-menu .hs-search-field");

searchBarButton.addEventListener("mouseenter", () => {
  searchBarButton.setAttribute("aria-expanded", "true");
});

searchBar.addEventListener("mouseleave", () => {
  searchBarButton.setAttribute("aria-expanded", "false");
});
