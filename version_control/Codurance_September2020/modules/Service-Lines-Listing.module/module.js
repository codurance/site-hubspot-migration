"use strict";

const readMoreBlocks = document.querySelectorAll(".service-line__read-more");

readMoreBlocks.forEach((readMoreBlock) => toggleReadMoreButton(readMoreBlock));

function toggleReadMoreButton(readMoreBlock) {
  const readMoreOpenButton = readMoreBlock.querySelector(
    ".service-line__read-more-open-button"
  );
  const readMoreCloseButton = readMoreBlock.querySelector(
    ".service-line__read-more-close-button"
  );

  readMoreOpenButton.addEventListener("click", () => {
    toggleReadMoreOverflow(readMoreBlock);
  });
  readMoreCloseButton.addEventListener("click", (event) => {
    toggleReadMoreOverflow(readMoreBlock);
    collapseReadMore(event);
  });
}

function collapseReadMore(event) {
  const readMoreCloseButton = event.target;

  readMoreCloseButton.parentNode.removeAttribute("open");
}

function toggleReadMoreOverflow(readMoreBlock) {
  const serviceLineDescription = readMoreBlock.previousElementSibling;

  serviceLineDescription.classList.toggle(
    "service-line__description--read-more"
  );
}
