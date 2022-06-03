"use strict";

const searchBarForm = document.querySelector(".events-search-bar");
const searchBar = searchBarForm.querySelector(".events-search-bar__input");
const searchBarResetButton = searchBarForm.querySelector(".events-search-bar__reset-button");

searchBar.addEventListener("input", filterEventsOnInputValueChange);
searchBarResetButton.addEventListener("click", filterEventsOnResetButtonClick);

function filterEventsOnInputValueChange(inputEvent) {
    const searchBarText = inputEvent.target.value;
    
    togglePromotedEvents(searchBarText);
    toggleSearchResultsTitle(searchBarText);       
    toggleSearchBarResetButton(searchBarText);
    applyFilters(searchBarText);

    // Timeout to adjust to the event card items animations
    setTimeout(
        toggleNoSearchResultsMessage,
        getFadingAnimationDuration()
    );
}

function filterEventsOnResetButtonClick() {
    togglePromotedEvents();
    toggleSearchResultsTitle();    
    hideSearchBarResetButton();
    applyFilters();
}

function togglePromotedEvents(searchBarText) {
    const promotedEventsCollection = document.querySelector(".promoted-events");

    if(searchBarText == "" || searchBarText == undefined) {
        showWithAnimation(promotedEventsCollection);
    }
    else {
        hideWithAnimation(promotedEventsCollection);
    }           
}

function toggleSearchResultsTitle(searchBarText) {
    const generalTitle = document.querySelector(".past-events .card-collection__title");
    const searchResultsTitle = document.querySelector(".past-events .card-collection__search-results-title");

    if (searchBarText == "" || searchBarText == undefined) {
        setTimeout(
            hideSearchResultsTitle, 
            getFadingAnimationDuration(), 
            generalTitle, searchResultsTitle
        );
    }
    else {
        showSearchResultsTitle(generalTitle, searchResultsTitle);
    }
}

function showSearchResultsTitle(generalTitle, searchResultsTitle) {
    addHiddenModifier(generalTitle);
    removeHiddenModifier(searchResultsTitle);
}

function hideSearchResultsTitle(generalTitle, searchResultsTitle) {
    removeHiddenModifier(generalTitle);
    addHiddenModifier(searchResultsTitle);
}

function toggleSearchBarResetButton(searchBarText) {
    if (searchBarText != "") {
        showSearchBarResetButton();
    }
    else {
        hideSearchBarResetButton();
    }
}

function showSearchBarResetButton() {
    searchBarForm.classList.add("events-search-bar--icon-hidden");
    removeHiddenModifier(searchBarResetButton);
}

function hideSearchBarResetButton() {
    searchBarForm.classList.remove("events-search-bar--icon-hidden");
    addHiddenModifier(searchBarResetButton);
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
    if(isSearchTextInEvent(event, searchBarText)) {
        showWithAnimation(event);            
    }
    else {
        hideWithAnimation(event);
    }
}

function isSearchTextInEvent(event, searchBarText) {
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

function toggleNoSearchResultsMessage() {
    const noSearchResultsMessage = document.querySelector(".card-collection-results__no-results-message");

    if(areSearchResultsDisplayed()) {
        hideWithAnimation(noSearchResultsMessage);
    }
    else {
        showWithAnimation(noSearchResultsMessage);
    }
}

function areSearchResultsDisplayed() {
    const pastEventsCollection = document.querySelector(".past-events .card-collection-results");
    const pastEvents = pastEventsCollection.querySelectorAll(".card-item");
    
    let searchResultsDisplayed = false;

    pastEvents.forEach((event) => {
        if(!event.classList.contains("hidden")) {
            searchResultsDisplayed = true;
        }
    });

    return searchResultsDisplayed;
}

function showWithAnimation(element) {
    removeHiddenModifier(element);

    // Timeout to show the transition before the display property changes
    setTimeout(removeFadeAnimationModifier, getFadingAnimationDuration(), element); 
}

function hideWithAnimation(element) {
    addFadeAnimationModifier(element);
        
    // Timeout to show the transition before the display property changes
    setTimeout(addHiddenModifier, getFadingAnimationDuration(), element); 
}

function getFadingAnimationDuration() {
    const rootHtml = document.documentElement;
    const fadingAnimationDurationInMs = 
        getComputedStyle(rootHtml).getPropertyValue("--fading-animation-duration");
    
    return parseInt(fadingAnimationDurationInMs);
}

function removeFadeAnimationModifier(element) {
    element.classList.remove("fade-animation");
}

function addFadeAnimationModifier(element) {
    element.classList.add("fade-animation");
}

function removeHiddenModifier(element) {
    element.classList.remove("hidden");
}

function addHiddenModifier(element) {
    element.classList.add("hidden");
}