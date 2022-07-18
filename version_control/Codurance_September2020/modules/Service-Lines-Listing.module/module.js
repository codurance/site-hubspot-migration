"use strict";

const readMoreCloseButton = 
    document.querySelectorAll(".service-line__read-more-close-button");

readMoreCloseButton.forEach(button => collapseReadMoreOnClick(button));

function collapseReadMoreOnClick(readMoreCloseButton) {
    readMoreCloseButton.addEventListener("click", collapseReadMore);
}

function collapseReadMore(event) {
    const readMoreCloseButton = event.target;
    readMoreCloseButton.parentNode.removeAttribute("open");
}