"use strict";

const highlightCards = document.querySelectorAll(".highlight__wrapper");

highlightCards.forEach((card) => {
  card.addEventListener("click", toggleCardSide);
});

function toggleCardSide(event) {
  const highlightCard = event.target.closest(".highlight__wrapper");

  highlightCard.classList.toggle("hover");
}
