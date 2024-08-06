"use strict";

const moduleContainer = document.querySelector(".cm-recent-post");

if (moduleContainer.classList.contains("js-lazy-load-images")) {
  const closestSection = moduleContainer.closest("section");

  const moduleObserver = new IntersectionObserver(displayBackground);
  moduleObserver.observe(closestSection);
}

function displayBackground(entries) {
  entries.forEach((entry) => {
    const postThumbnails = entry.target.querySelectorAll(
      ".cm-recent-image-wrapper"
    );

    postThumbnails.forEach((postThumbnail) => {
      const backgroundClass = postThumbnail.dataset.backgroundClass;

      postThumbnail.classList.add(backgroundClass);
    });
  });
}
