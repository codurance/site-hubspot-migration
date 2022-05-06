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
    checkSearchBarResetButtonVisibility(searchBarText);
    applyFilters(searchBarText);

    // Timeout to adjust to the event card items animations
    setTimeout(
        checkNoSearchResultsMessageVisibility,
        getFadingAnimationDuration()
    );
}

function filterEventsOnResetButtonClick() {
    checkPromotedEventsVisibility();
    checkSearchResultsTitleVisibility();    
    hideSearchBarResetButton();
    applyFilters();
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
    addFadeAnimationModifier(promotedEventsCollection);

    // Timeout to show the transition before the display property changes
    setTimeout(addHiddenModifier, getFadingAnimationDuration(), promotedEventsCollection); 
}

function showPromotedEvents(promotedEventsCollection) {
    removeHiddenModifier(promotedEventsCollection);

    // Timeout to show the transition before the display property changes
    setTimeout(removeFadeAnimationModifier, getFadingAnimationDuration(), promotedEventsCollection); 
}

function checkSearchResultsTitleVisibility(searchBarText) {
    const generalTitle = document.querySelector(".past-events .card-collection__title");
    const searchResultsTitle = document.querySelector(".past-events .card-collection__search-results-title");

    if (searchBarText != "" && searchBarText != undefined) {
        showSearchResultsTitle(generalTitle, searchResultsTitle);
    }
    else {
        setTimeout(
            hideSearchResultsTitle, 
            getFadingAnimationDuration(), 
            generalTitle, searchResultsTitle
        );
    }
}

function showSearchResultsTitle(generalTitle, searchResultsTitle) {
    addHiddenModifier(generalTitle);
    addShownModifier(searchResultsTitle);
}

function hideSearchResultsTitle(generalTitle, searchResultsTitle) {
    removeHiddenModifier(generalTitle);
    removeShownModifier(searchResultsTitle);
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
    addShownModifier(searchBarResetButton);
}

function hideSearchBarResetButton() {
    searchBarForm.classList.remove("events-search-bar--icon-hidden");
    removeShownModifier(searchBarResetButton);
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

function checkNoSearchResultsMessageVisibility() {
    const noSearchResultsMessage = document.querySelector(".card-collection-results__no-results-message");

    if(checkIfSearchResultsAreDisplayed()) {
        removeShownModifier(noSearchResultsMessage);
    }
    else {
        addShownModifier(noSearchResultsMessage);
    }
}

function checkIfSearchResultsAreDisplayed() {
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

function showEvent(event) {
    removeHiddenModifier(event);

    // Timeout to show the transition before the display property changes
    setTimeout(removeFadeAnimationModifier, getFadingAnimationDuration(), event); 
}

function hideEvent(event) {
    addFadeAnimationModifier(event);
        
    // Timeout to show the transition before the display property changes
    setTimeout(addHiddenModifier, getFadingAnimationDuration(), event); 
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

function removeShownModifier(element) {
    element.classList.remove("shown");
}

function addShownModifier(element) {
    element.classList.add("shown");
}

function getFadingAnimationDuration() {
    const rootHtml = document.documentElement;
    const fadingAnimationDurationInMs = 
        getComputedStyle(rootHtml).getPropertyValue("--fading-animation-duration");
    
    return parseInt(fadingAnimationDurationInMs);
}