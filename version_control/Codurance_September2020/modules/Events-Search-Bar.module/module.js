"use strict";

const searchBar = document.querySelector(".events-search-bar");
searchBar.addEventListener("input", filterEvents);

function filterEvents(inputEvent) {
    let searchBarText = inputEvent.target.value;

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
    if(!promotedEventsCollection.classList.contains("card-collection--hidden")) {
        promotedEventsCollection.classList.add("card-collection--hidden");
    }
}

function showPromotedEvents(promotedEventsCollection) {
    if(promotedEventsCollection.classList.contains("card-collection--hidden")) {
        promotedEventsCollection.classList.remove("card-collection--hidden");
    }
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
    if(event.classList.contains("card-item--hidden")) {
        event.style.display = "block";

        // Required to display the transition correctly
        setTimeout(function() {
            event.classList.remove("card-item--hidden");
        }, 100); 
    }
}

function hideEvent(event) {
    if(!event.classList.contains("card-item--hidden")) {
        event.classList.add("card-item--hidden");
        
        // Required to display the transition correctly
        setTimeout(function() {
            event.style.display = "none";
        }, 100);
    }
}