"use strict";


const getAll = (entity, type) => {
    const selectors = {
        videos: '.videos .card-item',
        options: `[data-${type}-option]`,
        dropdown_containers: '[data-dropdown-options]',
        remove_filter_buttons: `[data-remove-${type}-filter]`
    }

    return Array.from(
        document.querySelectorAll(selectors[entity])
    );
}

const get = (entity, value, type) => {
    const selectors = {
        mobile_filter_toggle: '.mobile-filter-toggle__button',
        mobile_filter_toggle_icon: '.mobile-filter-toggle__icon',
        filters_wrapper: '.filter-dropdown-wrapper',
        dropdown_container: `[data-dropdown-options="${value}"]`,
        dropdown_icon: `[data-dropdown-icon="${value}"]`,
        option: `[data-${type}-option="${value}"]`,
        selected_icon: `[data-${type}-option-selected="${value}"]`,
        applied_filter: `[data-applied-${type}-filter="${value}"]`,
        no_results_message: '.no-results-message',
        search_bar_form: '.videos-search-bar',
        search_bar_input: '.videos-search-bar__input',
        search_bar_reset_button: '.videos-search-bar__reset-button'
    }

    return document.querySelector(selectors[entity]);
}

const allVideos = getAll('videos');

let videos = {
    all: allVideos,
    visible: allVideos,
    hidden: []
}

let filters = {
    types: [ 'topic', 'language' ],
    all: {
      topic: [],
      language: []
    },
    applied: {
      topic: [],
      language: []
    }
};
  
const filterOptions = type => {
    return getAll('options', type)
        .map(option => option.dataset[`${type}Option`])
        .filter( x => x.length > 0);
}

const setFilterOptions = _ => {
    filters.types
        .forEach(type => filters.all[type] = filterOptions(type));
}

const hide = element => {
    element.classList.add('hidden');
}

const show = element => {
    element.classList.remove('hidden');
}

const toggleShowHideFilters = _ => {
    const filtersWrapper = get('filters_wrapper');
    const mobileFilterIcon = get('mobile_filter_toggle_icon');

    filtersWrapper.classList.toggle('show');
    mobileFilterIcon.classList.toggle('mobile-filter-toggle__icon--selected')
}

const addFilterToggleListener = _ => {
    const filterToggleButton = get('mobile_filter_toggle');
    filterToggleButton.addEventListener('click', toggleShowHideFilters)
}

const showDropdown = container => {
    show(container);

    const type = container.dataset.dropdownOptions;

    get('dropdown_icon', type).classList.add('filter-dropdown-icon--selected');
}

const hideDropdown = container => {
    hide(container);

    const type = container.dataset.dropdownOptions;

    get('dropdown_icon', type).classList
        .remove('filter-dropdown-icon--selected');
}

const closeOtherDropdowns = type => {
    const dropdownContainers = getAll('dropdown_containers');

    dropdownContainers
        .filter(dropdown => dropdown.dataset.dropdownOptions != type)
        .forEach(hideDropdown);
}

const openDropdown = type => {
    closeOtherDropdowns(type);

    const dropdown = get('dropdown_container', type);
        
    if (dropdown.classList.contains('hidden')) {
        showDropdown(dropdown);
    } else {
        hideDropdown(dropdown);
    }
}

const isDropdownButton = element => {
    return !!element.dataset.dropdownButton
}

const optionTypeFrom = element => {
    const dataAttributes = Object.keys(element.dataset);
    const optionMatcher = new RegExp('^(topic|language)(?=Option)');

    for (let i = 0; i < dataAttributes.length; i++) {
        const key = dataAttributes[i];
        const match = key.match(optionMatcher);
        if (match) {
            return match[0];
        }
    }
}

const addDropdownListeners = _ => {
    window.addEventListener('click', ({ target }) => {
        if (isDropdownButton(target)) {
            openDropdown(target.dataset.dropdownButton);
        } else {
            const optionType = optionTypeFrom(target);
            closeOtherDropdowns(optionType);
        }
    });
}

const updateAppliedFilters = _ => {
    Object.keys(filters.applied).forEach(type => {
        const all = filters.all[type];
        const applied = filters.applied[type];
        const unapplied = arrayDifference(all, applied);

        applied.forEach(filter => {
            showAppliedFilter(type, filter);
            markOptionSelected(type, filter);
        });

        unapplied.forEach(filter => {
            hideUnappliedFilter(type, filter);
            markOptionDeselected(type, filter);
        });
    });
}

const showAppliedFilter = (type, filter) => {
    const filterPill = get('applied_filter', filter, type)
    show(filterPill);
}

const hideUnappliedFilter = (type, filter) => {
    const filterPill = get('applied_filter', filter, type)
    hide(filterPill);
}

const markOptionSelected = (type, filter) => {
    const selectedIcon = get('selected_icon', filter, type);
    const option = get('option', filter, type);
    
    show(selectedIcon);
    option.classList.add('filter-dropdown-option--selected');
}

const markOptionDeselected = (type, filter) => {
    const selectedIcon = get('selected_icon', filter, type);
    const option = get('option', filter, type);

    hide(selectedIcon);
    option.classList.remove('filter-dropdown-option--selected')
}

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

const arrayDifference = (a, b) => {
    return a.filter(item => !b.includes(item))
}

const filtersAvailableFor = type => {
    const opts = {
        topic: {
            video_dataset_name: 'videoTopic',
            remaining: videos => videos.filter(byLanguage)
        },
        language: {
            video_dataset_name: 'videoLanguage',
            remaining: videos => videos.filter(byTopic)
        }  
    };

    const remainingVideos = opts[type].remaining(videos.all);

    return remainingVideos.map(video => {    
        const videoType = opts[type].video_dataset_name;
        return video.dataset[videoType];
        }
    );
}

const disableButton = button => {
    button.setAttribute('disabled', 'true');
}

const enableButton = button => {
    button.removeAttribute('disabled');
}

const updateAvailableFilters = _ => {
    filters.types.forEach(type => {

        const availableFilters = 
            filtersAvailableFor(type)
                .flat(Infinity)
                .filter(onlyUnique) 
                .filter(element => element.trim().length > 0);

        const unavailableFilters = 
            arrayDifference(filters.all[type], availableFilters);

        availableFilters
            .forEach(filter => enableButton(get('option', filter, type)));
        unavailableFilters
            .forEach(filter => disableButton(get('option', filter, type)));
    });
}


const byLanguage = video => {
    let languageFilters = filters.applied.language;
    const videoLanguages = video.dataset.videoLanguage;
    return languageFilters.length === 0 ||
        languageFilters.some(filter => videoLanguages.includes(filter));
}


const byTopic = video => {
    let topicFilters = filters.applied.topic;
    const videoTopics = video.dataset.videoTopic;
    return topicFilters.length === 0 ||
        topicFilters.some(filter => videoTopics.includes(filter));
}

const byTextInput = video => {
    const inputText = get("search_bar_input").value;

    return isSearchTextInVideo(video, inputText);
}

const calculateVisibleVideos = _ => {
    return videos.all.filter(byTopic).filter(byLanguage).filter(byTextInput);
}

const refilter = _ => {

    videos.visible = calculateVisibleVideos();
    videos.hidden = arrayDifference(videos.all, videos.visible);

    videos.visible.forEach(showWithAnimation);
    videos.hidden.forEach(hideWithAnimation);
}

const updateNoResultsMessage = _ => {
    const noResultsMessage = get('no_results_message');

    if (videos.visible.length > 0) {
        hideWithAnimation(noResultsMessage);
    } else {
        showWithAnimation(noResultsMessage);
    }
}

const update = _ => {
    refilter();
    updateAppliedFilters();
    updateAvailableFilters();
    updateNoResultsMessage();
}

const applyFilter = (type, value) => {
    filters.applied[type].push(value);

    togglePromotedVideos();
    toggleSearchResultsTitle();
    
    update();
}


const addFilterOptionListeners = _ => {
    filters.types.forEach(type => {
        getAll('options', type).forEach( button => {
            addFilterListener(button, type)
        });
    });
}


const addFilterListener = (button, type) => {
    button.addEventListener('click', _ =>
        filterSelected(type, button.dataset[`${type}Option`]));
}

const filterSelected = (type, value) => {
    filterAlreadyApplied(type, value) ? removeFilter(type, value) 
                                     : applyFilter(type, value);
}

const filterAlreadyApplied = (type, value) => {
    const appliedFiltersForType = filters.applied[type];
    return appliedFiltersForType.includes(value);
}


const removeItemFromArray = (array, value) => {
    const removableIndex = array.indexOf(value);
    if (removableIndex >= 0) {
        array.splice(removableIndex, 1);
    }
}

const removeFilter = (type, value) => {
    removeItemFromArray(filters.applied[type], value);

    togglePromotedVideos();
    toggleSearchResultsTitle();

    update();
}

const capitalise = string => {
    return string.charAt(0).toUpperCase() + string.substring(1);
}

const addRemoveFilterListener = (type, button) => {
    button.addEventListener('click', _ => {
        const value = button.dataset[`remove${capitalise(type)}Filter`];
        removeFilter(type, value);
    });
}

const addRemoveFilterListeners = _ => {
    Object.keys(filters.all).forEach(type => {
        getAll('remove_filter_buttons', type).forEach(button =>
            addRemoveFilterListener(type, button));
    });
}

const addListeners = _ => {
    addFilterToggleListener();
    addDropdownListeners();
    addFilterOptionListeners();
    addRemoveFilterListeners();
}

const initialiseFilters = _ => {
    setFilterOptions();
    addListeners();
}
  
window.addEventListener('DOMContentLoaded', initialiseFilters);

get("search_bar_input")
    .addEventListener("keypress", dismissEnterKey);

get("search_bar_input")
    .addEventListener("input", filterVideosOnInputValueChange);

get("search_bar_reset_button")
    .addEventListener("click", filterVideosOnResetButtonClick);

function dismissEnterKey(keypressEvent) {
    // The 13 key code corresponds to the enter key
    if (keypressEvent.keyCode == 13)
        keypressEvent.preventDefault();
}

function filterVideosOnInputValueChange(inputEvent) {
    const searchBarText = inputEvent.target.value;
 
    togglePromotedVideos(searchBarText);
    toggleSearchResultsTitle(searchBarText);       
    toggleSearchBarResetButton(searchBarText);
    
    update();
}

function filterVideosOnResetButtonClick() {
    get("search_bar_input").value = "";
    
    togglePromotedVideos();
    toggleSearchResultsTitle();    
    hideSearchBarResetButton();

    update();
}

function togglePromotedVideos(searchBarText) {
    const promotedVideos = document.querySelector(".promoted-videos");
    const isSearchBarEmpty = searchBarText === "" || searchBarText === undefined;
    const isDropDownEmpty = filters.applied.language.length === 0 && filters.applied.topic.length === 0;

    if(isDropDownEmpty && isSearchBarEmpty) {
        showWithAnimation(promotedVideos);
    }else {
        hideWithAnimation(promotedVideos);
    }           
}

function toggleSearchResultsTitle(searchBarText) {
    const generalTitle = 
        document.querySelector(".videos .card-collection__title");
    const searchResultsTitle = 
        document.querySelector(".videos .card-collection__search-results-title");

    if (searchBarText === "" || searchBarText === null) {
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
    get("search_bar_form").classList.add("videos-search-bar--icon-hidden");
    removeHiddenModifier(get("search_bar_reset_button"));
}

function hideSearchBarResetButton() {
    get("search_bar_form").classList.remove("videos-search-bar--icon-hidden");
    addHiddenModifier(get("search_bar_reset_button"));
}

function isSearchTextInVideo(video, searchBarText) {
    const videoItemTitle = video.querySelector(".card-item__title").innerText;
    const videoItemDescription = video.querySelector(".card-item__description").innerText;
    const regExp = createRegExpObject(searchBarText);

    if(videoItemTitle.match(regExp) || 
       videoItemDescription.match(regExp)
    ) {
        return true;
    }

    return false;
}

function createRegExpObject(text) {
    const regexpFlags = "i"; // Case Insensitive Flag
    return new RegExp(text, regexpFlags);
}

function showWithAnimation(element) {
    const animationDuration = 
    parseInt(
      getComputedStyle(document.documentElement)
      .getPropertyValue("--fading-animation-duration")
    );

    removeHiddenModifier(element);

    // Timeout to show the transition before the display property changes
    setTimeout(removeFadeAnimationModifier, animationDuration, element);
}

function hideWithAnimation(element) {
    const animationDuration = 
    parseInt(
      getComputedStyle(document.documentElement)
      .getPropertyValue("--fading-animation-duration")
    );

    addFadeAnimationModifier(element);
        
    // Timeout to show the transition before the display property changes
    setTimeout(addHiddenModifier, animationDuration, element); 
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