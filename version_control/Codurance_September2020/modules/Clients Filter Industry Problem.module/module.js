const clients = Array.prototype.slice.call(
    document.querySelectorAll('[data-client-industry]')
);

const industryFilter = document.querySelector('[data-select-industry]');
const problemFilter = document.querySelector('[data-select-problem]');

const appliedFilters = {
    industry: [],
    problem: []
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
}

const showAppliedFilter = (key, filter) => {
    document.querySelector(`[data-applied-${key}-filter="${filter}"]`).classList.remove('hidden');
}

const showAppliedFilters = _ => {
    Object.keys(appliedFilters).forEach(key => {
        appliedFilters[key].forEach(filter => showAppliedFilter(key, filter));
    });
}

const hideAppliedOption = (key, filter) => {
    document.querySelector(`[data-${key}-option="${filter}"]`).setAttribute('hidden', '');
}

const hideAppliedOptions = _ => {
    Object.keys(appliedFilters).forEach(key => {
        appliedFilters[key].forEach(filter => hideAppliedOption(key, filter));
    });
}

const applyFilter = (value, type) => {
    appliedFilters[type].push(value);
    showAppliedFilters();
    hideAppliedOptions();
    industryFilter.value = "";
    refilter();
}

industryFilter.addEventListener('change', e => {
    applyFilter(e.target.value, 'industry')
});

problemFilter.addEventListener('change', e => {
    applyFilter(e.target.value, 'problem')
});

const initialiseFilterDropdowns = _ => {
    industryFilter.value = "";
    problemFilter.value = "";
}

window.addEventListener('DOMContentLoaded', initialiseFilterDropdowns);