const clients = Array.prototype.slice.call(
  document.querySelectorAll('[data-client-industry]')
);

let allFilters;
let isotope;

let visibleClients = clients;
let hiddenClients = [];

const appliedFilters = {
  industry: [],
  problem: [],
  service: []
}

const setAllFilters = _ => {
  allFilters = {
    industry: Array.prototype.slice.call(
        document.querySelectorAll('[data-industry-option]')
      ).map(option => option.dataset.industryOption),

    problem: Array.prototype.slice.call(
        document.querySelectorAll('[data-problem-option]')
      ).map(option => option.dataset.problemOption),

    service: Array.prototype.slice.call(
        document.querySelectorAll('[data-service-option]')
      ).map(option => option.dataset.serviceOption),
  }
}

const openDropdown = type => {
  const containerClasses = document.querySelector(`[data-options-container="${type}"]`).classList;
  if (containerClasses.contains('hidden')) {
    containerClasses.remove('hidden');
  } else {
    containerClasses.add('hidden');
  }
}

const addFilterDropdownListeners = _ => {
  Array.prototype.slice.call(
    document.querySelectorAll('[data-dropdown]')
  ).forEach(button => button.addEventListener('click', _ => 
    openDropdown(button.dataset.dropdown)
  ));
}

const showAppliedFilter = (key, filter) => {
  document.querySelector(`[data-applied-${key}-filter="${filter}"]`).classList.remove('hidden');
}

const hideUnappliedFilter = (key, filter) => {
  document.querySelector(`[data-applied-${key}-filter="${filter}"]`).classList.add('hidden');
}

const hideAppliedOption = (key, filter) => {
  document.querySelector(`[data-${key}-option="${filter}"]`).classList.add('hidden');
}

const showUnappliedOption = (key, filter) => {
  document.querySelector(`[data-${key}-option="${filter}"]`).classList.remove('hidden');
}

const updateAppliedFilters = _ => {
  Object.keys(appliedFilters).forEach(key => {
    const all = allFilters[key];
    const applied = appliedFilters[key];
    const unapplied = all.filter(filter => !applied.includes(filter));

    applied.forEach(filter => showAppliedFilter(key, filter));
    applied.forEach(filter => hideAppliedOption(key, filter));
    unapplied.forEach(filter => hideUnappliedFilter(key, filter));
    unapplied.forEach(filter => showUnappliedOption(key, filter));
  });
}

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const flatten = array => {
  return Array.prototype.concat.apply([], array);
}

const updateAvailableFilters = _ => {
  const availableIndustryFilters = flatten(clients.filter(byProblem).filter(byService).map(client =>
    client.dataset[`clientIndustry`].split(','))).filter(onlyUnique);
  const unavailableIndustryFilters = allFilters.industry.filter(filter =>
    !availableIndustryFilters.includes(filter));
  availableIndustryFilters.forEach(filter => 
    document.querySelector(`[data-industry-option="${filter}"]`)
    .removeAttribute('disabled'));
  unavailableIndustryFilters.forEach(filter => 
    document.querySelector(`[data-industry-option="${filter}"]`)
    .setAttribute('disabled', 'true'));

  const availableProblemFilters = flatten(clients.filter(byIndustry).filter(byService).map(client =>
    client.dataset[`clientProblem`].split(','))).filter(onlyUnique);
  const unavailableProblemFilters = allFilters.problem.filter(filter =>
    !availableProblemFilters.includes(filter));
  availableProblemFilters.forEach(filter => 
    document.querySelector(`[data-problem-option="${filter}"]`)
    .removeAttribute('disabled'));
  unavailableProblemFilters.forEach(filter => 
    document.querySelector(`[data-problem-option="${filter}"]`)
    .setAttribute('disabled', 'true'));

    const availableServiceFilters = flatten(clients.filter(byIndustry).filter(byProblem).map(client =>
      client.dataset[`clientService`].split(','))).filter(onlyUnique);
    const unavailableServiceFilters = allFilters.service.filter(filter =>
      !availableServiceFilters.includes(filter));
    availableServiceFilters.forEach(filter => 
      document.querySelector(`[data-service-option="${filter}"]`)
      .removeAttribute('disabled'));
    unavailableServiceFilters.forEach(filter => 
      document.querySelector(`[data-service-option="${filter}"]`)
      .setAttribute('disabled', 'true'));
}

const byIndustry = client => {
  let industryFilters = appliedFilters.industry;
  let clientIndustry = client.dataset.clientIndustry;
  return industryFilters.length === 0 ||
    industryFilters.includes(clientIndustry);
}

const byProblem = client => {
  let problemFilters = appliedFilters.problem;
  const clientProblems = client.dataset.clientProblem.split(',');
  return problemFilters.length === 0 ||
    problemFilters.some(filter => clientProblems.includes(filter));
}

const byService = client => {
  let serviceFilters = appliedFilters.service;
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
  const filteredClients = clients.filter(byIndustry).filter(byProblem).filter(byService);
  return filteredClients.length > 0 ?
    filteredClients :
    clients;
}

const refilter = _ => {
  visibleClients = calculateVisibleClients();
  hiddenClients = clients.filter(client => !visibleClients.includes(client));

  visibleClients.forEach(showClient);
  hiddenClients.forEach(hideClient);
  isotope.layout();
}

const closeDropdowns = _ => {
  Array.prototype.slice.call(
    document.querySelectorAll('[data-options-container]')
  ).forEach(container => container.classList.add('hidden'))
}

const update = _ => {
  updateAppliedFilters();
  refilter();
  updateAvailableFilters();
  closeDropdowns();
}

const applyFilter = (value, type) => {
  appliedFilters[type].push(value);
  update();
}

const addFilterOptionListeners = _ => {
  Object.keys(allFilters).forEach(type => {
    Array.prototype.slice.call(
      document.querySelectorAll(`[data-${type}-option]`)
    ).forEach(button => {
      button.addEventListener('click', _ => 
        applyFilter(button.dataset[`${type}Option`], type));
    })
  })

  Array.prototype.slice.call(
    document.querySelectorAll('[data-industry-option]')
  ).forEach(button => {
    button.addEventListener('click', e => 
      applyFilter(button.dataset.industryOption, 'industry'));
  })
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
  removeItemFromArray(appliedFilters[type], value)
  update();
}

const addRemoveFilterListener = (type, button) => {
  button.addEventListener('click', _ => {
    const filter = button.dataset[`remove${capitalise(type)}Filter`];
    removeFilter(type, filter);
  });
}

const addRemoveFilterListeners = _ => {
  Object.keys(allFilters).forEach(type => {
    Array.prototype.slice.call(
      document.querySelectorAll(`[data-remove-${type}-filter]`)
    ).forEach(button => addRemoveFilterListener(type, button));
  });
}

const addIsotopeLayout = _ => {
  let elem = document.querySelector('.clients-grid__container');
  isotope = new Isotope(elem, {
    layoutMode: 'packery',
    itemSelector: '.clients-grid__card',
    columnWidth: '.clients-grid__sizer',
    percentPosition: true,
    packery: {
      gutter: '.clients-grid__gutter-sizer'
    }
  });
}

const init = _ => {
  setAllFilters();
  addFilterDropdownListeners();
  addFilterOptionListeners();
  addRemoveFilterListeners();
  addIsotopeLayout();
}

window.addEventListener('DOMContentLoaded', init);
