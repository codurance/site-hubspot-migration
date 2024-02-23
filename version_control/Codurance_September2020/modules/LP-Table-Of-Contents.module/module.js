"use strict";

const tableOfContents = document.querySelector(".table-of-contents");
const mostExternalContainer = tableOfContents.closest(".dnd-column > div");

mostExternalContainer.classList.add("sticky-menu");

