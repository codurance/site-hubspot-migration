"use strict";

let dynamicVideo;

document.addEventListener("DOMContentLoaded", initDynamicVideo);

function initDynamicVideo() {
    dynamicVideo = document.querySelector(".dynamic-video");

    if(dynamicVideo) initClickableLinks();
}

function initClickableLinks() {
    const clickableLinks = document.querySelectorAll(".listing__item");

    clickableLinks.forEach(clickableLink => 
        clickableLink.addEventListener("click", changeDynamicVideoByLink)
    );
}

function changeDynamicVideoByLink(event) {
    const clickableLink = event.target.closest("a");

    event.preventDefault();

    dynamicVideo.src = clickableLink.href;

    updateVideoSubtitle(clickableLink);

    changeActiveClickableLink(clickableLink);
}

function updateVideoSubtitle(clickableLink) {
    const videoSubtitleContainer = document.querySelector(".js-video-subtitle");
    const videoSubtitleText = clickableLink.dataset.videoSubtitle;

    videoSubtitleContainer.textContent = videoSubtitleText;
}

function changeActiveClickableLink(clickableLink) {
    const activeLink = document.querySelector(".listing__item--active");

    activeLink.classList.remove("listing__item--active");
    clickableLink.classList.add("listing__item--active");
}