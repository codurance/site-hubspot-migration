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
  
const getAll = (entity, type) => {
    const selectors = {
        videos: '.videos .card-item',
        options: `[data-${type}-option]`,
        dropdown_containers: '[data-dropdown-options]'
    }

    return Array.from(
        document.querySelectorAll(selectors[entity])
    )
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
        no_clients_message: '[data-no-clients-message]',
        grid_container: '[data-grid-container]'
    }

    return document.querySelector(selectors[entity]);
}

const allVideos = getAll('videos');

let videos = {
    all: allVideos,
    visible: allVideos,
    hidden: []
}


const filterOptions = type => {
    return getAll('options', type).map(option => option.dataset[`${type}Option`]).filter( x => x.length > 0);
}

const setFilterOptions = _ => {
    filters.types.forEach(type =>
        filters.all[type] = filterOptions(type));
}

const hide = element => {
element.classList.add('hidden');
}

const show = element => {
element.classList.remove('hidden');
}

const toggleShowHideFilters = _ => {
    const filtersWrapper = get('filters_wrapper');
    if (filtersWrapper.classList.contains('hidden')) {
        show(filtersWrapper);
        get('mobile_filter_toggle_icon').classList.add('mobile-filter-toggle__icon--selected');
    } else {
        hide(filtersWrapper);
        get('mobile_filter_toggle_icon').classList.remove('mobile-filter-toggle__icon--selected');
    }
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

    get('dropdown_icon', type).classList.remove('filter-dropdown-icon--selected');
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


const updateAppliedFilters = _ => {
    Object.keys(filters.applied).forEach(type => {
        const all = filters.all[type];
        const applied = filters.applied[type];
        const unapplied = arrayDifference(all, applied);

        applied.forEach(filter => {
            // showAppliedFilter(type, filter);
            markOptionSelected(type, filter);
        });

        unapplied.forEach(filter => {
            // hideUnappliedFilter(type, filter);
            markOptionDeselected(type, filter);
        });
    });
}


// const onlyUnique = (value, index, self) => {
//     return self.indexOf(value) === index;
// }

// const flatten = array => {
//     return Array.prototype.concat.apply([], array);
// }

const arrayDifference = (a, b) => {
    return a.filter(item => !b.includes(item))
}

// const getClientData = (client, type) => {
//     return client.dataset[type].split(',')
// }

// const filtersAvailableFor = type => {
//     const opts = {
//         topic: {
//             client_dataset_name: 'clientIndustry',
//             remaining: videos => videos.filter(byTopic).filter(byLanguage)
//         },
//         language: {
//             client_dataset_name: 'clientTechnology',
//             remaining: videos => videos.filter(byIndustry).filter(byLanguage)
//         }  
//     };

//     const remainingClients = opts[type].remaining(videos.all);

//     return remainingClients.map(client =>
//         getClientData(client, opts[type].client_dataset_name));
// }

const disableButton = button => {
button.setAttribute('disabled', 'true');
}

const enableButton = button => {
button.removeAttribute('disabled');
}

// const updateAvailableFilters = _ => {
//     filters.types.forEach(type => {
//         const availableFilters = flatten(filtersAvailableFor(type)).filter(onlyUnique).filter(element => element.trim().length > 0);
//         const unavailableFilters = arrayDifference(filters.all[type], availableFilters);
//         availableFilters.forEach(filter => enableButton(get('option', filter, type)));
//         unavailableFilters.forEach(filter => disableButton(get('option', filter, type)));
//     });
// }

// const byIndustry = client => {
//     let industryFilters = filters.applied.topic;
//     let clientIndustry = client.dataset.clientIndustry;
//     return industryFilters.length === 0 ||
//         industryFilters.includes(clientIndustry);
// }

const byTopic = client => {
    let technologyFilters = filters.applied.language;
    const clientTechnologies = client.dataset.clientTechnology.split(',');
    return technologyFilters.length === 0 ||
        technologyFilters.some(filter => clientTechnologies.includes(filter));
}


const byLanguage = client => {
    let serviceFilters = filters.applied.service;
    const clientServices = client.dataset.clientService.split(',');
    return serviceFilters.length === 0 ||
        serviceFilters.some(filter => clientServices.includes(filter));
}

const calculateVisibleClients = _ => {
return clients.all.filter(byIndustry).filter(byTopic).filter(byLanguage);
}

const refilter = _ => {
    clients.visible = calculateVisibleClients();
    clients.hidden = arrayDifference(clients.all, clients.visible);

    clients.visible.forEach(show);
    clients.hidden.forEach(hide);
}

const updateNoClientsMessage = _ => {
const noClientsMessage = get('no_clients_message');

if (clients.visible.length > 0) {
    hide(noClientsMessage);
} else {
    show(noClientsMessage);
}
}

const update = _ => {
    updateAppliedFilters();
    // refilter();
    // updateAvailableFilters();
    // updateNoClientsMessage();
}

const applyFilter = (type, value) => {
    filters.applied[type].push(value);
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
    removeItemFromArray(filters.applied[type], value)
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

const addListeners = _ => {
    addFilterToggleListener();
    addDropdownListeners();
    addFilterOptionListeners();
}

const initialiseFilters = _ => {
    setFilterOptions();
    addListeners();
}
  
window.addEventListener('DOMContentLoaded', initialiseFilters);