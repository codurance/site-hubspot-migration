"use strict";

const moduleContainers = document.querySelectorAll(".cta-block");

moduleContainers.forEach((container) => {
  const closestSection = container.closest("section");
  const moduleObserver = new IntersectionObserver(displayBackground);
  moduleObserver.observe(closestSection);
});

function displayBackground(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const moduleContainer = entry.target.querySelector(".cta-block");

      moduleContainer.classList.add("js-display-background");
    }
  });
}
