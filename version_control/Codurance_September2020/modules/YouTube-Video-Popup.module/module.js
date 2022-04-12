
const ungatedButtons = document.querySelectorAll(".icon-ungated");
const overlay = document.querySelector(".overlay");
const popupVideo = document.querySelector(".modal__video");
const closeModalButton = document.querySelector(".close-button");


ungatedButtons.forEach(openVideoPopupOnClick);

closeModalButton.addEventListener("click", function(){ hideModal(overlay) });

function openVideoPopupOnClick(ungatedButton){
    ungatedButton.addEventListener("click", setVideoOnPopup);
}

function showModal(elem) {
    return elem.style.display = 'block';
}

function hideModal(elem) {
    return elem.style.display = 'none';
}


function stripYoutubeID(str){
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;    
    const match = str.match(regExp);
    const idLength = 11;

    if (match && match[2].length == idLength) return match[2];
    
    throw new Error('Expression not found');  
}

function setVideoOnPopup(event) {
    event.preventDefault();

    const youtubeId = stripYoutubeID(event.target.href);
    const embedPreferences = '?autoplay=1';
    popupVideo.src = `https://www.youtube.com/embed/${youtubeId}${embedPreferences}`;
    
    showModal(overlay);

}







