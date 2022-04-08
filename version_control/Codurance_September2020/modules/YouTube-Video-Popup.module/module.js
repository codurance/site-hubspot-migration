const ungatedLinks = document.querySelectorAll(".icon-ungated");

ungatedLinks.forEach(openVideoPopupOnClick);

function openVideoPopupOnClick(ungatedLink){
    ungatedLink.addEventListener("click", setVideoOnPopup);
}

function setVideoOnPopup(event) {
    const ungatedLinkHref = event.target.href;
    let popupVideo = document.querySelector(".popup__video");

    event.preventDefault();
    popupVideo.src = ungatedLinkHref;
}

