const clients = Array.prototype.slice.call(
    document.querySelectorAll('[data-client-industry]')
);
const industryFilter = document.querySelector('[data-select-industry]');
const problemFilter = document.querySelector('[data-select-problem]');

industryFilter.addEventListener('change', _ => {
    refilter();
});

problemFilter.addEventListener('change', _ => {
    refilter();
});

const byIndustry = client => {
    return industryFilter.value === 'all' ||
        client.dataset.clientIndustry === industryFilter.value;
}

const byProblem = client => {
    const clientProblems = client.dataset.clientProblems.split(',');
    return problemFilter.value === 'all' ||
        clientProblems.includes(problemFilter.value);
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