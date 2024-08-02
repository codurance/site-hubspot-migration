"use strict";

const moduleContainer = document.querySelector(".cm-recent-post");

if (moduleContainer.classList.contains("js-lazy-load-images")) {
  console.log("Hola");
  const closestSection = moduleContainer.closest("section");

  let moduleObserver = new IntersectionObserver(showPostThumbnails);
  moduleObserver.observe(closestSection);
}

function showPostThumbnails(entries) {
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
