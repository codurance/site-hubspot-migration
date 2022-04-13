"use strict";

const ungatedButtons = document.querySelectorAll(".icon-ungated");
const overlay = document.querySelector(".overlay");
const popupVideo = document.querySelector(".modal__video");
const closeModalButton = document.querySelector(".close-button");

ungatedButtons.forEach(openVideoPopupOnClick);

closeModalButton.addEventListener("click", () => hideModal(overlay) );

document.addEventListener('click', function(event){
    if(event.target.className !== "overlay") return;

    hideModal(overlay);
})

document.addEventListener('keyup', function(event){
    if(event.code !== "Escape") return;

    hideModal(overlay);
})

function openVideoPopupOnClick(ungatedButton){
    ungatedButton.addEventListener("click", setVideoOnPopup);
}

function setVideoOnPopup(event) {
    event.preventDefault();
    
    const youtubeId = stripYoutubeID(event.target.href);
    const embedPreferences = '?autoplay=1';
    popupVideo.src = `https://www.youtube.com/embed/${youtubeId}${embedPreferences}`;
    
    showModal(overlay);
    
}

function stripYoutubeID(str){
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;    
    const match = str.match(regExp);
    const idLength = 11;

    if (match && match[2].length == idLength) return match[2];
    
    throw new Error('Expression not found');  
}

function showModal(elem) {
    document.body.classList.add('overflow-hidden');
    return elem.style.display = 'flex';
}

function hideModal(elem) {
    document.body.classList.remove('overflow-hidden');
    elem.style.display = 'none';
    popupVideo.src = "";
}




