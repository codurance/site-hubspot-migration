"use strict";

const moduleContainers = document.querySelectorAll(".cta-block");

moduleContainers.forEach((container) => {
  const moduleObserver = new IntersectionObserver(displayBackground);
  moduleObserver.observe(container);
});

function displayBackground(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("js-display-background");
    }
  });
}
