let isotope;

//get all posts
//extract tags from property on each post
//shown_tags = get all tags that do not have 'hidden' class
//add hidden class to posts that do not have any of shown_tags



let filters = {
  types: [ 'industry', 'technology', 'service' ],
  all: {
    industry: [],
    technology: [],
    service: []
  },
  applied: {
    industry: [],
    technology: [],
    service: []
  }
};

const getAll = (entity, type) => {
  const selectors = {
    tags: '[blog-tags]',
    options: `[data-${type}-option]`,
    dropdown_containers: '[data-dropdown-container]',
    remove_filter_buttons: `[data-remove-${type}-filter]`
  }

  return Array.prototype.slice.call(
    document.querySelectorAll(selectors[entity])
  )
}

const get = (entity, value, type) => {
  const selectors = {
    filter_toggle: '[data-filter-toggle]',
    filter_toggle_icon: '[data-filter-toggle-icon]',
    filters_wrapper: '[data-filters-wrapper]',
    dropdown_container: `[data-dropdown-container="${value}"]`,
    dropdown_icon: `[data-dropdown-icon=${value}]`,
    applied_filter: `[data-applied-${type}-filter="${value}"]`,
    option: `[data-${type}-option="${value}"]`,
    selected_icon: `[data-${type}-option-selected="${value}"]`,
    no_clients_message: '[data-no-clients-message]',
    grid_container: '[data-grid-container]',
    video_cover_container: `[data-video-cover-container="${value}"]`,
    video_iframe: `[data-video-iframe="${value}"]`
  }

  return document.querySelector(selectors[entity]);
}

const allBlogPosts = getAll('tags');

let katas = {
  all: allBlogPosts,
  visible: allBlogPosts,
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
    get('filter_toggle_icon').classList.add('clients__filter-toggle-icon--selected');
  } else {
    hide(filtersWrapper);
    get('filter_toggle_icon').classList.remove('clients__filter-toggle-icon--selected');
  }
}

const addFilterToggleListener = _ => {
  const filterToggleButton = get('filter_toggle');
  filterToggleButton.addEventListener('click', toggleShowHideFilters)
}

const showDropdown = container => {
  const type = container.dataset.dropdownContainer;
  show(container);
  get('dropdown_icon', type).classList.add('clients__filter-dropdown-icon--selected');
}

const hideDropdown = container => {
  const type = container.dataset.dropdownContainer;
  hide(container);
  get('dropdown_icon', type).classList.remove('clients__filter-dropdown-icon--selected');
}

const closeOtherDropdowns = type => {
  getAll('dropdown_containers').filter(dropdown =>
    dropdown.dataset.dropdownContainer !== type).forEach(hideDropdown)
}

const openDropdown = type => {
  closeOtherDropdowns(type)
  const dropdown = get('dropdown_container', type)
  if (dropdown.classList.contains('hidden')) {
    showDropdown(dropdown, type)
  } else {
    hideDropdown(dropdown, type)
  }
}

const isDropdownButton = element => {
  return !!element.dataset.dropdownButton
}

const optionTypeFrom = element => {
  const dataAttributes = Object.keys(element.dataset);
  const optionMatcher = new RegExp('^(industry|technology|service)(?=Option)');
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
  })
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
  option.classList.add('clients__filter-dropdown-option--selected')
}

const markOptionDeselected = (type, filter) => {
  const selectedIcon = get('selected_icon', filter, type);
  const option = get('option', filter, type);
  hide(selectedIcon);
  option.classList.remove('clients__filter-dropdown-option--selected')
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

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const flatten = array => {
  return Array.prototype.concat.apply([], array);
}

const arrayDifference = (a, b) => {
  return a.filter(item => !b.includes(item))
}

const getKataData = (kata, type) => {
  return kata.dataset[type].split(',')
}

const filtersAvailableFor = type => {
  const opts = {
    difficulty: {
      kata_dataset_name: 'kataDifficulty',
      remaining: katas => katas.filter(byDifficulty)
    },
    technology: {
      client_dataset_name: 'clientTechnology',
      remaining: clients => clients.filter(byIndustry).filter(byService)
    }
  };


  const remainingKatas = opts[type].remaining(katas.all);

  return remainingKatas.map(kata =>
    getKataData(kata, opts[type].kata_dataset_name));
}

const disableButton = button => {
  button.setAttribute('disabled', 'true');
}

const enableButton = button => {
  button.removeAttribute('disabled');
}

const updateAvailableFilters = _ => {
  filters.types.forEach(type => {
    const availableFilters = flatten(filtersAvailableFor(type)).filter(onlyUnique).filter(element => element.trim().length > 0);
    const unavailableFilters = arrayDifference(filters.all[type], availableFilters);
    availableFilters.forEach(filter => enableButton(get('option', filter, type)));
    unavailableFilters.forEach(filter => disableButton(get('option', filter, type)));
  });
}

const byDifficulty = kata => {
  let difficultyFilters = filters.applied.difficulty;
  let kataDifficulty = kata.dataset.kataDifficulty;
  return difficultyFilters.length === 0 ||
    difficultyFilters.includes(kataDifficulty);
}

const byTechnology = client => {
  let technologyFilters = filters.applied.technology;
  const clientTechnologies = client.dataset.clientTechnology.split(',');
  return technologyFilters.length === 0 ||
    technologyFilters.some(filter => clientTechnologies.includes(filter));
}

const calculateVisibleClients = _ => {
  return katas.all.filter(byDifficulty);
}

const refilter = _ => {
  katas.visible = calculateVisibleClients();
  katas.hidden = arrayDifference(katas.all, katas.visible);

  katas.visible.forEach(show);
  katas.hidden.forEach(hide);
  isotope.layout();
}

const updateNoClientsMessage = _ => {
  const noClientsMessage = get('no_clients_message');

  if (katas.visible.length > 0) {
    hide(noClientsMessage);
  } else {
    show(noClientsMessage);
  }
}

const update = _ => {
  updateAppliedFilters();
  refilter();
  updateAvailableFilters();
  updateNoClientsMessage();
}

const applyFilter = (type, value) => {
  filters.applied[type].push(value);
  update();
}

const filterAlreadyApplied = (type, value) => {
  const appliedFiltersForType = filters.applied[type];
  return appliedFiltersForType.includes(value);
}

const filterSelected = (type, value) => {
  filterAlreadyApplied(type, value) ?
    removeFilter(type, value) :
    applyFilter(type, value);
}

const addFilterListener = (button, type) => {
  button.addEventListener('click', _ =>
    filterSelected(type, button.dataset[`${type}Option`]));
}

const addFilterOptionListeners = _ => {
  filters.types.forEach(type => {
    getAll('options', type).forEach(button => {
      addFilterListener(button, type);
    });
  });
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

const initialiseIsotopeLayout = _ => {
  const elem = get('grid_container');
  const isotopeLayoutOpts = {
    layoutMode: 'masonry',
    itemSelector: '.clients-grid__card',
    percentPosition: true,
    masonry: {
      columnWidth: '.clients-grid__sizer',
      gutter: '.clients-grid__gutter-sizer'
    }
  };

  isotope = new Isotope(elem, isotopeLayoutOpts);
}

const init = _ => {
  initialiseIsotopeLayout();
  initialiseFilters();
  initialiseVideoPlayers();
}

window.addEventListener('DOMContentLoaded', init);
