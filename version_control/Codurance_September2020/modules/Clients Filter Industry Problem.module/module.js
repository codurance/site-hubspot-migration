const clients = Array.prototype.slice.call(
    document.querySelectorAll('[data-client-industry]')
);
const industryFilter = document.querySelector('[data-select-industry]');
const problemFilter = document.querySelector('[data-select-problem]');

let allFilters;
let isotope;

const appliedFilters = {
    industry: [],
    problem: []
}

const resetFilterDropdownValues = _ => {
    industryFilter.value = "";
    problemFilter.value = "";
}

const setAllFilters = _ => {
    allFilters = {
        industry: Array.prototype.slice.call(
                document.querySelectorAll('[data-industry-option]')
            ).map(option => option.dataset.industryOption),
        problem: Array.prototype.slice.call(
                document.querySelectorAll('[data-problem-option]')
            ).map(option => option.dataset.problemOption)
    }
}

const showAppliedFilter = (key, filter) => {
    document.querySelector(`[data-applied-${key}-filter="${filter}"]`).classList.remove('hidden');
}

const hideUnappliedFilter = (key, filter) => {
    document.querySelector(`[data-applied-${key}-filter="${filter}"]`).classList.add('hidden');
}

const hideAppliedOption = (key, filter) => {
    document.querySelector(`[data-${key}-option="${filter}"]`).setAttribute('hidden', '');
}

const showUnappliedOption = (key, filter) => {
    document.querySelector(`[data-${key}-option="${filter}"]`).removeAttribute('hidden');
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

const byIndustry = client => {
    let industryFilters = appliedFilters.industry;
    let clientIndustry = client.dataset.clientIndustry;
    return industryFilters.length === 0 ||
        industryFilters.includes(clientIndustry);
}

const byProblem = client => {
    let problemFilters = appliedFilters.problem;
    const clientProblems = client.dataset.clientProblems.split(',');
    return problemFilters.length === 0 ||
        problemFilters.some(filter => clientProblems.includes(filter));
}

const showClient = client => {
    client.classList.remove('hidden');
}

const hideClient = client => {
    client.classList.add('hidden');
}

const refilter = _ => {
    const visibleClients = clients.filter(byIndustry).filter(byProblem);
    const hiddenClients = clients.filter(client => !visibleClients.includes(client));

    visibleClients.forEach(showClient);
    hiddenClients.forEach(hideClient);
    isotope.layout();
}

const unnamedFunction = _ => {
    updateAppliedFilters();
    refilter();
}

const applyFilter = (value, type) => {
    appliedFilters[type].push(value);
    resetFilterDropdownValues();
    unnamedFunction();
}

const addFilterDropdownListeners = _ => {
    industryFilter.addEventListener('change', e => 
        applyFilter(e.target.value, 'industry'));
    
    problemFilter.addEventListener('change', e => 
        applyFilter(e.target.value, 'problem'));
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
    unnamedFunction();
}

const addRemoveFilterListener = (type, button) => {
    button.addEventListener('click', _ => {
        const filter = button.dataset[`remove${capitalise(type)}Filter`];
        removeFilter(type, filter);
    });
}

const addRemoveFilterListeners = _ => {
    Array.prototype.slice.call(
        document.querySelectorAll('[data-remove-industry-filter]')
    ).forEach(button => addRemoveFilterListener('industry', button));

    Array.prototype.slice.call(
        document.querySelectorAll('[data-remove-problem-filter]')
    ).forEach(button => addRemoveFilterListener('problem', button));
}

const addIsotopeLayout = _ => {
    let elem = document.querySelector('.grid-container');
    isotope = new Isotope(elem, {
        layoutMode: 'packery',
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        packery: {
            gutter: '.gutter-sizer'
        }
    });
} 

const init = _ => {
    resetFilterDropdownValues();
    setAllFilters();
    addFilterDropdownListeners();
    addRemoveFilterListeners();
    addIsotopeLayout();
}

window.addEventListener('DOMContentLoaded', init);