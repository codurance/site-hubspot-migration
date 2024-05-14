"use strict";

window.addEventListener("load", () => {
  const utilitiesMenu = document.querySelector(".utilities-menu");
  const searchBarButton = utilitiesMenu.querySelector(".search-bar__button");
  const searchBarInput = utilitiesMenu.querySelector("#___gcse_0");
  const searchBarInputControlContainer = utilitiesMenu.querySelector(
    ".gsc-control-cse"
  );

  if (searchBarInputControlContainer.classList.contains("gsc-control-cse-en")) {
    const searchBarInputElement = utilitiesMenu.querySelector(
      "input.gsc-input"
    );

    searchBarInputElement.placeholder = "Search";
  } else if (
    searchBarInputControlContainer.classList.contains("gsc-control-cse-es")
  ) {
    const searchBarInputElement = utilitiesMenu.querySelector(
      "input.gsc-input"
    );

    searchBarInputElement.placeholder = "Buscar";
  } else if (
    searchBarInputControlContainer.classList.contains("gsc-control-cse-pt-PT")
  ) {
    const searchBarInputElement = utilitiesMenu.querySelector(
      "input.gsc-input"
    );

    searchBarInputElement.placeholder = "Buscar";
  }

  searchBarButton.addEventListener("click", () => {
    searchBarButton.setAttribute("aria-expanded", "true");
    setTimeout(() => searchBarInput.focus(), 300);
  });

  searchBarButton.addEventListener("focus", () => {
    searchBarButton.setAttribute("aria-expanded", "true");
    setTimeout(() => searchBarInput.focus(), 300);
  });

  document.addEventListener("click", (e) => {
    if (utilitiesMenu.contains(e.target)) return;
    searchBarButton.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      searchBarButton.setAttribute("aria-expanded", "false");
    }
  });
});
