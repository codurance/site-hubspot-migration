let isotope;

let filters = {
  types: [ 'industry', 'problem', 'service' ],
  all: {
    industry: [],
    problem: [],
    service: []
  },
  applied: {
    industry: [],
    problem: [],
    service: []
  }
};

const getAll = (entity, type) => {
  const selectors = {
    clients: '[data-client-industry]',
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
    dropdown_container: `[data-dropdown-container="${value}"]`,
    applied_filter: `[data-applied-${type}-filter="${value}"]`,
    option: `[data-${type}-option="${value}"]`,
    grid_container: '.clients-grid__container'
  }

  return document.querySelector(selectors[entity]);
}

const allClients = getAll('clients');

let clients = {
  all: allClients,
  visible: allClients,
  hidden: []
}

const filterOptions = type => {
  return getAll('options', type).map(option => option.dataset[`${type}Option`]);
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

const closeOtherDropdowns = type => {
  getAll('dropdown_containers').filter(dropdown => 
    dropdown.dataset.dropdownContainer !== type).forEach(hide)
}

const openDropdown = type => {
  closeOtherDropdowns(type)
  const dropdown = get('dropdown_container', type)
  if (dropdown.classList.contains('hidden')) {
    show(dropdown)
  } else {
    hide(dropdown);
  }
}

const isDropdownButton = element => {
  return !!element.dataset.dropdownButton
}

const addDropdownListeners = _ => {
  window.addEventListener('click', ({ target }) => {
    if (isDropdownButton(target)) {
      openDropdown(target.dataset.dropdownButton);
    } else {
      closeOtherDropdowns();
    }
  })
}

const showAppliedFilter = (key, filter) => {
  const filterPill = get('applied_filter', filter, key)
  show(filterPill);
}

const hideUnappliedFilter = (key, filter) => {
  const filterPill = get('applied_filter', filter, key)
  hide(filterPill);
}

const hideAppliedOption = (key, filter) => {
  const option = get('option', filter, key);
  hide(option);
}

const showUnappliedOption = (key, filter) => {
  const option = get('option', filter, key);
  show(option);
}

const updateAppliedFilters = _ => {
  Object.keys(filters.applied).forEach(type => {
    const all = filters.all[type];
    const applied = filters.applied[type];
    const unapplied = all.filter(filter => !applied.includes(filter));

    applied.forEach(filter => showAppliedFilter(type, filter));
    applied.forEach(filter => hideAppliedOption(type, filter));
    unapplied.forEach(filter => hideUnappliedFilter(type, filter));
    unapplied.forEach(filter => showUnappliedOption(type, filter));
  });
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const flatten = array => {
  return Array.prototype.concat.apply([], array);
}

const updateAvailableFilters = _ => {
  const availableIndustryFilters = flatten(clients.all.filter(byProblem).filter(byService).map(client =>
    client.dataset[`clientIndustry`].split(','))).filter(onlyUnique);
  const unavailableIndustryFilters = filters.all.industry.filter(filter =>
    !availableIndustryFilters.includes(filter));
  availableIndustryFilters.forEach(filter => 
    get('option', filter, 'industry').removeAttribute('disabled'));
  unavailableIndustryFilters.forEach(filter => 
    get('option', filter, 'industry').setAttribute('true'));

  const availableProblemFilters = flatten(clients.all.filter(byIndustry).filter(byService).map(client =>
    client.dataset[`clientProblem`].split(','))).filter(onlyUnique);
  const unavailableProblemFilters = filters.all.problem.filter(filter =>
    !availableProblemFilters.includes(filter));
  availableProblemFilters.forEach(filter => 
    get('option', filter, 'problem').removeAttribute('disabled'));
  unavailableProblemFilters.forEach(filter => 
    get('option', filter, 'problem').setAttribute('true'));


    const availableServiceFilters = flatten(clients.all.filter(byIndustry).filter(byProblem).map(client =>
      client.dataset[`clientService`].split(','))).filter(onlyUnique);
    const unavailableServiceFilters = filters.all.service.filter(filter =>
      !availableServiceFilters.includes(filter));
    availableServiceFilters.forEach(filter => 
      get('option', filter, 'service').removeAttribute('disabled'));
    unavailableServiceFilters.forEach(filter => 
      get('option', filter, 'service').setAttribute('true'));
}

const byIndustry = client => {
  let industryFilters = filters.applied.industry;
  let clientIndustry = client.dataset.clientIndustry;
  return industryFilters.length === 0 ||
    industryFilters.includes(clientIndustry);
}

const byProblem = client => {
  let problemFilters = filters.applied.problem;
  const clientProblems = client.dataset.clientProblem.split(',');
  return problemFilters.length === 0 ||
    problemFilters.some(filter => clientProblems.includes(filter));
}

const byService = client => {
  let serviceFilters = filters.applied.service;
  const clientServices = client.dataset.clientService.split(',');
  return serviceFilters.length === 0 ||
    serviceFilters.some(filter => clientServices.includes(filter));
}

const showClient = client => {
  client.classList.remove('hidden');
}

const hideClient = client => {
  client.classList.add('hidden');
}

const calculateVisibleClients = _ => {
  const filteredClients = clients.all.filter(byIndustry).filter(byProblem).filter(byService);
  return filteredClients.length > 0 ?
    filteredClients :
    clients;
}

const refilter = _ => {
  clients.visible = calculateVisibleClients();
  clients.hidden = clients.all.filter(client => !clients.visible.includes(client));

  clients.visible.forEach(showClient);
  clients.hidden.forEach(hideClient);
  isotope.layout();
}

const closeDropdowns = _ => {
  getAll('dropdown_containers').forEach(container => container.classList.add('hidden'))
}

const update = _ => {
  updateAppliedFilters();
  refilter();
  updateAvailableFilters();
  closeDropdowns();
}

const applyFilter = (value, type) => {
  filters.applied[type].push(value);
  update();
}

const addFilterOptionListeners = _ => {
  Object.keys(filters.all).forEach(type => {
    getAll('options', type).forEach(button => {
      button.addEventListener('click', _ => 
        applyFilter(button.dataset[`${type}Option`], type));
    });
  });
}

const capitalise = string => {
  return string.charAt(0).toUpperCase() + string.substring(1);
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

const addRemoveFilterListener = (type, button) => {
  button.addEventListener('click', _ => {
    const filter = button.dataset[`remove${capitalise(type)}Filter`];
    removeFilter(type, filter);
  });
}

const addRemoveFilterListeners = _ => {
  Object.keys(filters.all).forEach(type => {
    getAll('remove_filter_buttons', type).forEach(button => 
      addRemoveFilterListener(type, button));
  });
}

const initialiseFilters = _ => {
  setFilterOptions();
  addDropdownListeners();
  addFilterOptionListeners();
  addRemoveFilterListeners();
}

const initialiseIsotopeLayout = _ => {
  const elem = get('grid_container');
  const isotopeLayoutOpts = {
    layoutMode: 'packery',
    itemSelector: '.clients-grid__card',
    columnWidth: '.clients-grid__sizer',
    percentPosition: true,
    packery: {
      gutter: '.clients-grid__gutter-sizer'
    }
  };

  isotope = new Isotope(elem, isotopeLayoutOpts);
}

const init = _ => {
  initialiseIsotopeLayout();
  initialiseFilters()
}

window.addEventListener('DOMContentLoaded', init);
