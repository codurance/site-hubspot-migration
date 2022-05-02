"use strict";

const searchBar = document.querySelector(".events-search-bar__input");
searchBar.addEventListener("input", filterEvents);

function filterEvents(inputEvent) {
    const searchBarText = inputEvent.target.value;

    checkPromotedEventsVisibility(searchBarText);
    applyFilters(searchBarText);
}

function checkPromotedEventsVisibility(searchBarText) {
    const promotedEventsCollection = document.querySelector(".promoted-events");

    if(searchBarText != "") {
        hidePromotedEvents(promotedEventsCollection);
    }
    else {
        showPromotedEvents(promotedEventsCollection);
    }           
}

function hidePromotedEvents(promotedEventsCollection) {
    promotedEventsCollection.classList.add("card-collection--faded");
}

function showPromotedEvents(promotedEventsCollection) {
    promotedEventsCollection.classList.remove("card-collection--faded");
}

function applyFilters(searchBarText) {
    const pastEventsCollection = document.querySelector(".past-events .card-collection-results");
    const pastEvents = pastEventsCollection.querySelectorAll(".card-item");

    pastEvents.forEach(event => filterEvent(event, searchBarText));
}

function filterEvent(event, searchBarText) {
    if(searchTextInEvent(event, searchBarText)) {
        showEvent(event);            
    }
    else {
        hideEvent(event);
    }
}

function searchTextInEvent(event, searchBarText) {
    const eventItemTitle = event.querySelector(".card-item__title").innerText;
    const eventItemDescription = event.querySelector(".card-item__description").innerText;
    const regExp = createRegExpObject(searchBarText);

    if(eventItemTitle.match(regExp) || 
       eventItemDescription.match(regExp)
    ) {
        return true;
    }

    return false;
}

function createRegExpObject(text) {
    const regexpFlags = "i"; // Case Insensitive Flag
    return new RegExp(text, regexpFlags);
}

function showEvent(event) {
    removeVisibilityModifier(event);

    // Timeout to show the transition before the display property changes
    setTimeout(removeFadeAnimationModifier, getFadingAnimationDuration(), event); 
}

function hideEvent(event) {
    addFadeAnimationModifier(event);
        
    // Timeout to show the transition before the display property changes
    setTimeout(addVisibilityModifier, getFadingAnimationDuration(), event); 
}

function removeFadeAnimationModifier(event) {
    event.classList.remove("card-item--faded");
}

function addFadeAnimationModifier(event) {
    event.classList.add("card-item--faded");
}

function removeVisibilityModifier(event) {
    event.classList.remove("card-item--hidden");
}

function addVisibilityModifier(event) {
    event.classList.add("card-item--hidden");
}


function getFadingAnimationDuration() {
    const rootHtml = document.documentElement;
    const fadingAnimationDurationInMs = 
        getComputedStyle(rootHtml).getPropertyValue("--fading-animation-duration");
    
    return parseInt(fadingAnimationDurationInMs);
}