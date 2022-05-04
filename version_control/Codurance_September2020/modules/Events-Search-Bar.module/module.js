"use strict";

const searchBarForm = document.querySelector(".events-search-bar");
const searchBar = searchBarForm.querySelector(".events-search-bar__input");
const searchBarResetButton = searchBarForm.querySelector(".events-search-bar__reset-button");

searchBar.addEventListener("input", filterEventsOnInputValueChange);
searchBarResetButton.addEventListener("click", filterEventsOnResetButtonClick);

function filterEventsOnInputValueChange(inputEvent) {
    const searchBarText = inputEvent.target.value;
    
    checkPromotedEventsVisibility(searchBarText);
    checkSearchResultsTitleVisibility(searchBarText);       
    applyFilters(searchBarText);
    checkSearchBarResetButtonVisibility(searchBarText);
}

function filterEventsOnResetButtonClick() {
    checkPromotedEventsVisibility();
    checkSearchResultsTitleVisibility();    
    applyFilters();
    hideSearchBarResetButton();
}

function checkPromotedEventsVisibility(searchBarText) {
    const promotedEventsCollection = document.querySelector(".promoted-events");

    if(searchBarText != "" && searchBarText != undefined) {
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

function checkSearchResultsTitleVisibility(searchBarText) {
    const generalTitle = document.querySelector(".past-events .card-collection__title");
    const searchResultsTitle = document.querySelector(".past-events .card-collection__search-results-title");

    if (searchBarText != "" && searchBarText != undefined) {
        showSearchResultsTitle(generalTitle, searchResultsTitle);
    }
    else {
        hideSearchResultsTitle(generalTitle, searchResultsTitle);
    }
}

function showSearchResultsTitle(generalTitle, searchResultsTitle) {
    generalTitle.classList.add("card-collection__title--hidden");
    searchResultsTitle.classList.add("card-collection__search-results-title--shown");
}

function hideSearchResultsTitle(generalTitle, searchResultsTitle) {
    generalTitle.classList.remove("card-collection__title--hidden");
    searchResultsTitle.classList.remove("card-collection__search-results-title--shown");
}

function applyFilters(searchBarText) {
    if(arguments.length == 0) {
        searchBarText = "";
    }

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

function checkSearchBarResetButtonVisibility(searchBarText) {
    if (searchBarText != "") {
        showSearchBarResetButton();
    }
    else {
        hideSearchBarResetButton();
    }
}

function showSearchBarResetButton() {
    searchBarForm.classList.add("events-search-bar--icon-hidden");
    searchBarResetButton.classList.add("events-search-bar__reset-button--shown");
}

function hideSearchBarResetButton() {
    searchBarForm.classList.remove("events-search-bar--icon-hidden");
    searchBarResetButton.classList.remove("events-search-bar__reset-button--shown");
}

function getFadingAnimationDuration() {
    const rootHtml = document.documentElement;
    const fadingAnimationDurationInMs = 
        getComputedStyle(rootHtml).getPropertyValue("--fading-animation-duration");
    
    return parseInt(fadingAnimationDurationInMs);
}