
const jobsItemsList = document.querySelector('#jobs-list');

const addJob = (entry, jobData) => {
  if (!entry[jobData.title]) {
    entry[jobData.title] = {};
  }
  appendLocations(entry[jobData.title], jobData)
}

const appendLocations = (entry, jobData) => {
  const newLocation = {
    city: jobData.city,
    country: jobData.country.length === 0 ? 'World-wide' : jobData.country,
    url: jobData.url,
    location: jobData.telecommuting ? 'Remote' : 'Hybrid'
  }

  if (!entry.locations) {
    entry.locations = [];
  }
  entry.locations.push(newLocation)
}

const createJobsObject = (jsonData) => {
  const jobs = {};

   jsonData.map((job) => {
    if (!jobs[job.department]) {
      jobs[job.department] = {} 
    }
    addJob(jobs[job.department], job)
  })
  return jobs;
}



const bluePrint = {
      Tech: {
        Principal_Craftsperson: {
          locations: [
              {
              city: "London",
              country: "UK",
              url: "https...",
              location: 'Hybrid/Remote'
            },{
              city: "Manchester",
              country: "UK",
              url: "https...",
              location: 'Hybrid/Remote'
            },{
              city: "Barcelona",
              country: "Spain",
              url: "https...",
              location: 'Hybrid/Remote'
            }
          ], 
        },
        Software_Craftsperson: {
          locations: [
              {
              city: "London",
              country: "UK",
              url: "https...",
              location: 'Hybrid/Remote'
            },{
              city: "Manchester",
              country: "UK",
              url: "https...",
              location: 'Hybrid/Remote'
            },{
              city: "Barcelona",
              country: "Spain",
              url: "https...",
              location: 'Hybrid/Remote'
            }
          ], 
        },

      },
      Academy: {}
}


async function fetchJobs() {
  try {
    const urlEndpoint = "/_hcms/api/get_all_jobs";
    const response = await fetch(urlEndpoint);
    const data = await response.json();
    const jobsData = data.response.jobs

    displayJobs(jobsData)
    // displayRoles(jobsData);
    displayDropdownButtons(filterUniqueJobTitles(jobsData), 'roles');
    displayDropdownButtons(filterUniqueLocations(jobsData), 'locations');

  } catch (error) {
    console.error(error)
  }
}

const filterUniqueJobTitles = (data) => {
  return [...new Set(data.map(job => job.title))];
}

// const hasEmptyCountry = (country) => {
//   return country === "" ? "Woldwide" : country ;
// }

const filterUniqueLocations = (jobsObj) => {
  const getAllCountries = jobsObj.map(job => {
       return job.country === "" ? "Woldwide" : job.country ; 
  })
  const uniqueCouintries = [...new Set(getAllCountries)];

  return uniqueCouintries;
}


const displayRoles = (object) =>{
  const jobTitles = filterUniqueJobTitle(object);

  const htmlJobTitles = jobTitles.map((jobTitle) => {
    return `
    <button class="jobs__filter-dropdown-option" data-role-option="${jobTitle}">
      ${jobTitle}
    <i class="jobs__filter-dropdown-option-selected-icon las la-check hidden"
    data-role-option-selected="${jobTitle}"></i>
    </button>
    `
  }).join('');
  
  const roleItemList = document.querySelector('#roles')
  roleItemList.innerHTML = htmlJobTitles;
}


const displayDropdownButtons = (filteredItems, idSelector) =>{
  const htmlItems = filteredItems.map((item) => {
    return `
    <button class="jobs__filter-dropdown-option" data-role-option="${item}">
      ${item}
    <i class="jobs__filter-dropdown-option-selected-icon las la-check hidden"
    data-role-option-selected="${item}"></i>
    </button>
    `
  }).join('');

  const divSelector = document.querySelector(`#${idSelector}`)
  divSelector.innerHTML = htmlItems;

}



const hasHybridCity = (city) => {
  if(city === 'London' || city === 'Manchester' || city === 'Barcelona' ){
      return true;
  }
}


console.log("number 3")

const renderLocations = (locationsArray) => {
  return locationsArray.map(({city, country, url, location}) => `
  <div class="job-list__locations">
    <p class="job-item__telecommuting">${location}</p>
    <p class="job-item__country">
      <i class="las la-map-marker"></i>
      ${ hasHybridCity(city) ? city : country }
    </p>
    <a class="job-item__link text-cta-primary
    text-cta--right-arrow"
    href=${url}
    target=_blank>Apply<i class="las la-arrow-right"></i>
    </a>
  </div>
  `).join('');
}

const displayJobs = (jobsData) => {
  const jobs = createJobsObject(jobsData)

  const htmlRender = Object.entries(jobs).map( ([departmentName, jobInfo]) => {
    return  ` 
      <div class="job-item__section">
        <p class="job-item__department">${departmentName}</p>
        <div class="job-item__titles-continer">
          ${Object.entries(jobInfo).map( ([jobTitle, {locations}]) => {             
            return `<h3 class="job-item__title">${jobTitle}</h3>${renderLocations(locations)}`
            }).join('')
          }
        </div>
      </div>
      `
  }).join('')

  // console.log(htmlRender);

  jobsItemsList.innerHTML = htmlRender;
  return

  const htmlString = jobs.map(job => {
    return `
      <li class=job-item>
        <div class="job-item__section">
          <p class="job-item__department">${job.department}</p>
          <h3 class="job-item__title">${job.title}</h3>
        </div>
        <div class="job-list__locations">
          <p class="job-item__telecommuting">${job.telecommuting ? "Remote" : "Hybrid"}</p>
          <p class="job-item__country">
            <i class="las la-map-marker"></i>
            ${ hasHybridCity(job.city) ? job.city : job.country }
          </p>
          <a class="job-item__link text-cta-primary
          text-cta--right-arrow"
          href=${job.url}
          target=_blank>Apply<i class="las la-arrow-right"></i>
          </a>
        </div>
      </li>
          `
  }).join('');

  jobsItemsList.innerHTML = htmlString;

}


const hide = element => {
  element.classList.add('hidden');
}

const show = element => {
  element.classList.remove('hidden');
}

const showDropdown = container => {
  show(container);
  let dropdownIcon = document.querySelector('.jobs__filter-dropdown-icon');
  dropdownIcon.classList.add('jobs__filter-dropdown-icon--selected');
}

const hideDropdown = container => {
  hide(container);
  let dropdownIcon = document.querySelector('.jobs__filter-dropdown-icon');
  dropdownIcon.classList.remove('jobs__filter-dropdown-icon--selected');
}

document.addEventListener('click', (event) => {
  const buttonToggle = event.target.dataset.dropdownButton;
    if(!buttonToggle) return;

  const dropdownOptions = document.getElementById(buttonToggle);
  
  if(dropdownOptions.classList.contains('hidden')){
    showDropdown(dropdownOptions)
  }else{
    hideDropdown(dropdownOptions)
  }
})



fetchJobs()