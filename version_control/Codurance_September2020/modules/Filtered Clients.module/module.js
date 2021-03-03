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
    selected_icon: `[data-${type}-option-selected="${value}"]`,
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
  show(selectedIcon);
}

const markOptionDeselected = (type, filter) => {
  const selectedIcon = get('selected_icon', filter, type);
  hide(selectedIcon);
}

const updateAppliedFilters = _ => {
  Object.keys(filters.applied).forEach(type => {
    const all = filters.all[type];
    const applied = filters.applied[type];
    const unapplied = arrayDifference(all, applied);

    applied.forEach(filter => showAppliedFilter(type, filter));
    applied.forEach(filter => markOptionSelected(type, filter));
    unapplied.forEach(filter => hideUnappliedFilter(type, filter));
    unapplied.forEach(filter => markOptionDeselected(type, filter));
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

const getClientData = (client, type) => {
  return client.dataset[type].split(',')
}

const filtersAvailableFor = type => {
  const opts = {
    industry: {
      client_dataset_name: 'clientIndustry',
      remaining: clients.all.filter(byProblem).filter(byService)
    },
    problem: {
      client_dataset_name: 'clientProblem',
      remaining: clients.all.filter(byIndustry).filter(byService)
    },
    service: {
      client_dataset_name: 'clientService',
      remaining: clients.all.filter(byIndustry).filter(byProblem)
    }
  };

  const optsForType = opts[type];

  return optsForType.remaining.map(client =>
    getClientData(client, optsForType.client_dataset_name));
}

const disable = button => {
  button.setAttribute('disabled', 'true');
}

const enable = button => {
  button.removeAttribute('disabled');
}

const updateAvailableFilters = _ => {
  filters.types.forEach(type => {
    const availableFilters = flatten(filtersAvailableFor(type)).filter(onlyUnique);
    const unavailableFilters = arrayDifference(filters.all[type], availableFilters);
    availableFilters.forEach(filter => enable(get('option', filter, type)));
    unavailableFilters.forEach(filter => disable(get('option', filter, type)));
  });
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
  return clients.all.filter(byIndustry).filter(byProblem).filter(byService);
}

const refilter = _ => {
  clients.visible = calculateVisibleClients();
  clients.hidden = arrayDifference(clients.all, clients.visible);

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
