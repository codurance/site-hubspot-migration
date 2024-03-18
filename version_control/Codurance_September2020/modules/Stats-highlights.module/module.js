"use strict";

const highlightCards = document.querySelectorAll(".highlight__wrapper");

highlightCards.forEach((card) => {
  card.addEventListener("click", mobileToggle);
});

function mobileToggle(event) {
  const highlightCard = event.target.closest(".highlight__wrapper");

  highlightCard.classList.toggle("hover");
}
