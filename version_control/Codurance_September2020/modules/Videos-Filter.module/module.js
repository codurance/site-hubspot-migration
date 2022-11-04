class VideosFilter {
    constructor(filtersTypes) {
        this.filters = {
            types: filtersTypes,
            all: {
              topic: []
            },
            applied: {
              topic: []
            }
        }

        if( filtersTypes.includes('language') ) {
            this.filters.all['language'] = [];
            this.filters.applied['language'] = [];
        }

        this.allVideos = this.getAll('videos');
        
        this.videos = {
            all: this.allVideos,
            visible: this.allVideos,
            hidden: []
        }
        
        this.initialiseFilters();
    }

    getAll = (entity, type) => {
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
    
    get = (entity, value, type) => {
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

    initialiseFilters = () => {
        this.setFilterOptions();
        this.addListeners();
    }

    setFilterOptions = _ => {
        this.filters.types
            .forEach(type => this.filters.all[type] = this.filterOptions(type));
    }

    filterOptions = type => {
        return this.getAll('options', type)
            .map(option => option.dataset[`${type}Option`])
            .filter( x => x.length > 0);
    }

    addListeners = () => {
        this.addFilterToggleListener();
        this.addDropdownListeners();
        this.addFilterOptionListeners();
        this.addRemoveFilterListeners();
        this.addSearchBarListeners();
    }

    addFilterToggleListener = _ => {
        const filterToggleButton = this.get('mobile_filter_toggle');
        filterToggleButton.addEventListener(
            'click', this.toggleShowHideFilters
        );
    }

    toggleShowHideFilters = _ => {
        const filtersWrapper = this.get('filters_wrapper');
        const mobileFilterIcon = this.get('mobile_filter_toggle_icon');

        filtersWrapper.classList.toggle('show');
        mobileFilterIcon.classList.toggle('mobile-filter-toggle__icon--selected')
    }

    addDropdownListeners = () => {
        window.addEventListener('click', ({ target }) => {
            if (this.isDropdownButton(target)) {
                this.openDropdown(target.dataset.dropdownButton);
            } else {
                const optionType = this.optionTypeFrom(target);
                this.closeOtherDropdowns(optionType);
            }
        });
    }

    addFilterOptionListeners = () => {
        this.filters.types.forEach(type => {
            this.getAll('options', type).forEach( button => {
                this.addFilterListener(button, type)
            });
        });
    }

    addRemoveFilterListeners = () => {
        Object.keys(this.filters.all).forEach(type => {
            this.getAll('remove_filter_buttons', type).forEach(button =>
                this.addRemoveFilterListener(type, button));
        });
    }

    addSearchBarListeners = () => {
        this.get("search_bar_input").addEventListener(
            "keypress", this.dismissEnterKey
        );

        this.get("search_bar_input").addEventListener(
            "input", this.filterVideosOnInputValueChange
        );

        this.get("search_bar_reset_button").addEventListener(
            "click", this.filterVideosOnResetButtonClick
        );
    }

    showDropdown = container => {
        this.show(container);

        const type = container.dataset.dropdownOptions;

        this.get('dropdown_icon', type).classList.add(
            'filter-dropdown-icon--selected'
        );
    }

    hideDropdown = container => {
        this.hide(container);

        const type = container.dataset.dropdownOptions;

        this.get('dropdown_icon', type).classList
            .remove('filter-dropdown-icon--selected');
    }

    closeOtherDropdowns = type => {
        const dropdownContainers = this.getAll('dropdown_containers');

        dropdownContainers
            .filter(dropdown => dropdown.dataset.dropdownOptions != type)
            .forEach(this.hideDropdown);
    }

    openDropdown = type => {
        this.closeOtherDropdowns(type);

        const dropdown = this.get('dropdown_container', type);
            
        if (dropdown.classList.contains('hidden')) {
            this.showDropdown(dropdown);
        } else {
            this.hideDropdown(dropdown);
        }
    }

    isDropdownButton = element => {
        return !!element.dataset.dropdownButton
    }

    optionTypeFrom = element => {
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

    updateAppliedFilters = () => {
        Object.keys(this.filters.applied).forEach(type => {
            const all = this.filters.all[type];
            const applied = this.filters.applied[type];
            const unapplied = this.arrayDifference(all, applied);

            applied.forEach(filter => {
                this.showAppliedFilter(type, filter);
                this.markOptionSelected(type, filter);
            });

            unapplied.forEach(filter => {
                this.hideUnappliedFilter(type, filter);
                this.markOptionDeselected(type, filter);
            });
        });
    }

    showAppliedFilter = (type, filter) => {
        const filterPill = this.get('applied_filter', filter, type);
        this.show(filterPill);
    }

    hideUnappliedFilter = (type, filter) => {
        const filterPill = this.get('applied_filter', filter, type);
        this.hide(filterPill);
    }

    markOptionSelected = (type, filter) => {
        const selectedIcon = this.get('selected_icon', filter, type);
        const option = this.get('option', filter, type);
        
        this.show(selectedIcon);
        option.classList.add('filter-dropdown-option--selected');
    }

    markOptionDeselected = (type, filter) => {
        const selectedIcon = this.get('selected_icon', filter, type);
        const option = this.get('option', filter, type);

        this.hide(selectedIcon);
        option.classList.remove('filter-dropdown-option--selected');
    }

    onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    }

    arrayDifference = (a, b) => {
        return a.filter(item => !b.includes(item));
    }

    filtersAvailableFor = type => {
        const opts = {
            topic: {
                video_dataset_name: 'videoTopic',
                remaining: videos => videos.filter(this.byLanguage)
            },
            language: {
                video_dataset_name: 'videoLanguage',
                remaining: videos => videos.filter(this.byTopic)
            }  
        };

        let videos = this.videos.all;

        if(this.filters.types.includes('language')) {
            videos = opts[type].remaining(videos);
        }

        return videos.map(video => {    
            const videoType = opts[type].video_dataset_name;
            return video.dataset[videoType];
            }
        );
    }

    updateAvailableFilters = () => {
        this.filters.types.forEach(type => {

            const availableFilters = 
                this.filtersAvailableFor(type)
                    .flat(Infinity)
                    .filter(this.onlyUnique) 
                    .filter(element => element.trim().length > 0);

            const unavailableFilters = 
                this.arrayDifference(this.filters.all[type], availableFilters);

            availableFilters.forEach(filter => 
                this.enableButton(this.get('option', filter, type))
            );
            unavailableFilters.forEach(filter => 
                this.disableButton(this.get('option', filter, type))
            );
        });
    }

    enableButton = button => {
        button.removeAttribute('disabled');
    }

    disableButton = button => {
        button.setAttribute('disabled', 'true');
    }

    refilter = () => {
        this.videos.visible = this.calculateVisibleVideos();
        this.videos.hidden = this.arrayDifference(
            this.videos.all, this.videos.visible
        );

        this.videos.visible.forEach(this.showWithAnimation);
        this.videos.hidden.forEach(this.hideWithAnimation);
    }

    calculateVisibleVideos = () => {
        let visibleVideos = this.videos.all;

        this.filters.types.forEach(type => {
            const capitalisedType = type.charAt(0).toUpperCase() + 
                type.slice(1);

            visibleVideos = visibleVideos.filter(this['by' + capitalisedType]);
        });

        visibleVideos = visibleVideos.filter(this.byTextInput);

        return visibleVideos;
    }

    byTopic = video => {
        let topicFilters = this.filters.applied.topic;
        const videoTopics = video.dataset.videoTopic;
        return topicFilters.length === 0 ||
            topicFilters.some(filter => videoTopics.includes(filter));
    }

    byLanguage = video => {
        let languageFilters = this.filters.applied.language;
        const videoLanguages = video.dataset.videoLanguage;
        return languageFilters.length === 0 ||
            languageFilters.some(filter => videoLanguages.includes(filter));
    }

    byTextInput = video => {
        const inputText = this.get("search_bar_input").value;

        return this.isSearchTextInVideo(video, inputText);
    }

    updateNoResultsMessage = () => {
        const noResultsMessage = this.get('no_results_message');

        if (this.videos.visible.length > 0) {
            this.hideWithAnimation(noResultsMessage);
        } else {
            this.showWithAnimation(noResultsMessage);
        }
    }

    update = () => {
        this.refilter();
        this.updateAppliedFilters();
        this.updateAvailableFilters();
        this.updateNoResultsMessage();
    }

    applyFilter = (type, value) => {
        this.filters.applied[type].push(value);

        this.togglePromotedVideos();
        this.toggleSearchResultsTitle();
        
        this.update();
    }

    addFilterListener = (button, type) => {
        button.addEventListener('click', _ =>
            this.filterSelected(type, button.dataset[`${type}Option`]));
    }

    filterSelected = (type, value) => {
        this.filterAlreadyApplied(type, value) ? this.removeFilter(type, value) 
            : this.applyFilter(type, value);
    }

    filterAlreadyApplied = (type, value) => {
        const appliedFiltersForType = this.filters.applied[type];
        return appliedFiltersForType.includes(value);
    }

    removeItemFromArray = (array, value) => {
        const removableIndex = array.indexOf(value);
        if (removableIndex >= 0) {
            array.splice(removableIndex, 1);
        }
    }

    removeFilter = (type, value) => {
        this.removeItemFromArray(this.filters.applied[type], value);

        this.togglePromotedVideos();
        this.toggleSearchResultsTitle();

        this.update();
    }

    capitalise = string => {
        return string.charAt(0).toUpperCase() + string.substring(1);
    }

    addRemoveFilterListener = (type, button) => {
        button.addEventListener('click', _ => {
            const value = button.dataset[
                `remove${this.capitalise(type)}Filter`
            ];
            this.removeFilter(type, value);
        });
    }

    dismissEnterKey = keypressEvent => {
        // The 13 key code corresponds to the enter key
        if (keypressEvent.keyCode == 13)
            keypressEvent.preventDefault();
    }

    filterVideosOnInputValueChange = inputEvent => {
        const searchBarText = inputEvent.target.value;
    
        this.togglePromotedVideos(searchBarText);
        this.toggleSearchResultsTitle(searchBarText);       
        this.toggleSearchBarResetButton(searchBarText);
        
        this.update();
    }

    filterVideosOnResetButtonClick = () => {
        this.get("search_bar_input").value = "";
        
        this.togglePromotedVideos();
        this.toggleSearchResultsTitle();    
        this.hideSearchBarResetButton();

        this.update();
    }

    togglePromotedVideos = searchBarText => {
        const promotedVideos = document.querySelector(".promoted-videos");
        const isSearchBarEmpty = searchBarText === "" || 
            searchBarText === undefined;
        const areFiltersEmpty = this.areFiltersEmpty();

        if(areFiltersEmpty && isSearchBarEmpty) {
            this.showWithAnimation(promotedVideos);
        }else {
            this.hideWithAnimation(promotedVideos);
        }           
    }

    areFiltersEmpty = () => {
        let areFiltersEmpty = true;

        this.filters.types.forEach( filterType => {
            if( this.filters.applied[filterType].length !== 0 )
                areFiltersEmpty = false;
        });

        return areFiltersEmpty;
    }

    toggleSearchResultsTitle = searchBarText => {
        const generalTitle = 
            document.querySelector(".videos .card-collection__title");
        const searchResultsTitle = document
            .querySelector(".videos .card-collection__search-results-title");

        if (searchBarText === "" || searchBarText === null) {
            setTimeout(
                this.hideSearchResultsTitle, 
                this.getFadingAnimationDuration(), 
                generalTitle, searchResultsTitle
            );
        }
        else {
            this.showSearchResultsTitle(generalTitle, searchResultsTitle);
        }
    }

    showSearchResultsTitle = (generalTitle, searchResultsTitle) => {
        this.addHiddenModifier(generalTitle);
        this.removeHiddenModifier(searchResultsTitle);
    }

    hideSearchResultsTitle = (generalTitle, searchResultsTitle) => {
        this.removeHiddenModifier(generalTitle);
        this.addHiddenModifier(searchResultsTitle);
    }

    toggleSearchBarResetButton = searchBarText => {
        if (searchBarText != "") {
            this.showSearchBarResetButton();
        }
        else {
            this.hideSearchBarResetButton();
        }
    }

    showSearchBarResetButton = () => {
        this.get("search_bar_form")
            .classList
            .add("videos-search-bar--icon-hidden");
        this.removeHiddenModifier(this.get("search_bar_reset_button"));
    }

    hideSearchBarResetButton = () => {
        this.get("search_bar_form")
            .classList
            .remove("videos-search-bar--icon-hidden");
        this.addHiddenModifier(this.get("search_bar_reset_button"));
    }

    isSearchTextInVideo = (video, searchBarText) => {
        const videoItemTitle = 
            video.querySelector(".card-item__title").innerText;
        const videoItemDescription = 
            video.querySelector(".card-item__description").innerText;
        const regExp = this.createRegExpObject(searchBarText);

        if(videoItemTitle.match(regExp) || videoItemDescription.match(regExp)) {
            return true;
        }

        return false;
    }

    createRegExpObject = text => {
        const regexpFlags = "i"; // Case Insensitive Flag
        return new RegExp(text, regexpFlags);
    }

    show = element => {
        element.classList.remove('hidden');
    }

    hide = element => {
        element.classList.add('hidden');
    }

    showWithAnimation = element => {
        const animationDuration = 
            parseInt(
                getComputedStyle(document.documentElement)
                .getPropertyValue("--fading-animation-duration")
            );

        this.removeHiddenModifier(element);

        // Timeout to show the transition before the display property changes
        setTimeout(
            this.removeFadeAnimationModifier, 
            animationDuration, 
            element
        );
    }

    hideWithAnimation = element => {
        const animationDuration = 
            parseInt(
                getComputedStyle(document.documentElement)
                .getPropertyValue("--fading-animation-duration")
            );

        this.addFadeAnimationModifier(element);
            
        // Timeout to show the transition before the display property changes
        setTimeout(
            this.addHiddenModifier, 
            animationDuration, 
            element
        ); 
    }

    removeFadeAnimationModifier = element => {
        element.classList.remove("fade-animation");
    }

    addFadeAnimationModifier = element => {
        element.classList.add("fade-animation");
    }

    removeHiddenModifier = element => {
        element.classList.remove("hidden");
    }

    addHiddenModifier = element => {
        element.classList.add("hidden");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const filtersWrapper = document.querySelector('.filters-wrapper');
    let filtersEnabled = ['topic'];

    if(filtersWrapper.classList.contains('filters-wrapper--language-enabled'))
        filtersEnabled.push('language')

    new VideosFilter(filtersEnabled);
});


