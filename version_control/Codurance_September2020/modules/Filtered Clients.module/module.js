const allClients = Array.prototype.slice.call(
  document.querySelectorAll('[data-client-industry]')
);

const allFilters = {
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

let clients = {
  all: allClients,
  visible: allClients,
  hidden: []
}

let filters = {
  all: allFilters,
  applied: {
    industry: [],
    problem: [],
    service: []
  }
};

let isotope;

const hideDropdown = dropdown => {
  dropdown.classList.add('hidden');
}

const showDropdown = dropdown => {
  dropdown.classList.remove('hidden');
}

const closeOtherDropdowns = type => {
  Array.prototype.slice.call(
    document.querySelectorAll('[data-options-container]')
  ).filter(dropdown => dropdown.dataset.optionsContainer !== type)
    .forEach(hideDropdown)
}

const openDropdown = type => {
  closeOtherDropdowns(type)
  const dropdown = document.querySelector(`[data-options-container="${type}"]`);
  if (dropdown.classList.contains('hidden')) {
    showDropdown(dropdown)
  } else {
    hideDropdown(dropdown);
  }
}

const isDropdownButton = element => {
  return !!element.dataset.dropdown
}

const addDropdownListeners = _ => {
  window.addEventListener('click', event => {
    const clickedElement = event.target;
    if (isDropdownButton(clickedElement)) {
      openDropdown(clickedElement.dataset.dropdown);
    } else {
      closeOtherDropdowns();
    }
  })
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
  Object.keys(filters.applied).forEach(key => {
    const all = filters.all[key];
    const applied = filters.applied[key];
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
  const availableIndustryFilters = flatten(clients.all.filter(byProblem).filter(byService).map(client =>
    client.dataset[`clientIndustry`].split(','))).filter(onlyUnique);
  const unavailableIndustryFilters = filters.all.industry.filter(filter =>
    !availableIndustryFilters.includes(filter));
  availableIndustryFilters.forEach(filter => 
    document.querySelector(`[data-industry-option="${filter}"]`)
    .removeAttribute('disabled'));
  unavailableIndustryFilters.forEach(filter => 
    document.querySelector(`[data-industry-option="${filter}"]`)
    .setAttribute('disabled', 'true'));

  const availableProblemFilters = flatten(clients.all.filter(byIndustry).filter(byService).map(client =>
    client.dataset[`clientProblem`].split(','))).filter(onlyUnique);
  const unavailableProblemFilters = filters.all.problem.filter(filter =>
    !availableProblemFilters.includes(filter));
  availableProblemFilters.forEach(filter => 
    document.querySelector(`[data-problem-option="${filter}"]`)
    .removeAttribute('disabled'));
  unavailableProblemFilters.forEach(filter => 
    document.querySelector(`[data-problem-option="${filter}"]`)
    .setAttribute('disabled', 'true'));

    const availableServiceFilters = flatten(clients.all.filter(byIndustry).filter(byProblem).map(client =>
      client.dataset[`clientService`].split(','))).filter(onlyUnique);
    const unavailableServiceFilters = filters.all.service.filter(filter =>
      !availableServiceFilters.includes(filter));
    availableServiceFilters.forEach(filter => 
      document.querySelector(`[data-service-option="${filter}"]`)
      .removeAttribute('disabled'));
    unavailableServiceFilters.forEach(filter => 
      document.querySelector(`[data-service-option="${filter}"]`)
      .setAttribute('disabled', 'true'));
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
  filters.applied[type].push(value);
  update();
}

const addFilterOptionListeners = _ => {
  Object.keys(filters.all).forEach(type => {
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
    Array.prototype.slice.call(
      document.querySelectorAll(`[data-remove-${type}-filter]`)
    ).forEach(button => addRemoveFilterListener(type, button));
  });
}

const initialiseFilters = _ => {
  addDropdownListeners();
  addFilterOptionListeners();
  addRemoveFilterListeners();
}

const initialiseIsotopeLayout = _ => {
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
  initialiseIsotopeLayout();
  initialiseFilters()
}

window.addEventListener('DOMContentLoaded', init);
