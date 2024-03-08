"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const tableOfContents = document.querySelector(".table-of-contents");
  const mostExternalContainer = tableOfContents.closest(".dnd-column > div");

  mostExternalContainer.classList.add("sticky-menu");

  const anchorLinks = document.querySelectorAll("a[data-hs-anchor]");
  const observer = new IntersectionObserver(handleObserve);
  anchorLinks.forEach((anchorLink) => {
    const textSection = anchorLink.parentElement;
    observer.observe(textSection);
  });

  function handleObserve(textSections) {
    textSections.forEach(showSubmenu);
  }

  function showSubmenu(textSection) {
    const anchorId = textSection.target.querySelector("a[data-hs-anchor]").id;
    const tableLink = document.querySelector(
      "a[role='menuitem'][href='#" + anchorId + "']"
    );
    let menu;

    if (tableLink) {
      menu = tableLink.parentElement;

      menu.classList.toggle("table-of-contents__menu--shown");
    }

    if (tableLink && !textSection.isIntersecting) {
      menu.classList.remove("table-of-contents__menu--shown");
    }
  }
});

