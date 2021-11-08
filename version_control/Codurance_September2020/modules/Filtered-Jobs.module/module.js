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




const renderLocations = (locationsArray) => {
  return locationsArray.map(({city, country, url, location}) => `
  <div class="job-list__location">
    <p class="job-item__telecommuting element-item ${location}">${location}</p>
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
          ${Object.entries(jobInfo).map( ([jobTitle, {locations}]) => {             
            return `
            <div class="job-item__titles-container">
              <h3 class="job-item__title">${jobTitle}</h3>
              <div class="job-list__location-wrapper">
                ${renderLocations(locations)}
              </div>
            </div>`
            }).join('')
          }
      </div>
      `
  }).join('')


  jobsItemsList.innerHTML = htmlRender;
 
}


const hide = (element) => {
  element.classList.add('hidden');
}

const show = (element) => {
  element.classList.remove('hidden');
}

const showDropdown = (container, eventTarget) => {
  show(container);
  eventTarget.classList.add('jobs__filter-dropdown-button--active');
}

const hideDropdown = (container, eventTarget) => {
  hide(container);
  eventTarget.classList.remove('jobs__filter-dropdown-button--active');
}

const closeAllDropdowns = () => {
  const allContainers = document.querySelectorAll(".jobs__filter-dropdown-container");

  allContainers.forEach( element => {
      element.children[0].classList.remove('jobs__filter-dropdown-button--active');
      element.children[1].classList.add('hidden');
  } )
}




const checkHiddenElements = () => {
  const allSections = document.querySelectorAll('.job-item__section');
  allSections.forEach( section => {
    const hiddenElements = section.children.length - 1 === section.querySelectorAll('.hidden').length;
    
    console.log(hiddenElements)

    hiddenElements ? hide(section) : show(section);
  
  });
}
const hideParentElements = () => {
   const allLocationsContainer = document.querySelectorAll('.job-list__location-wrapper');

    allLocationsContainer.forEach( location => {
    const hiddenElements = location.children.length === location.querySelectorAll('.hidden').length;

    if(hiddenElements){
      hide(location.parentElement);
    }else{
      show(location.parentElement);
    }
  });
}

document.addEventListener('click', (event) => {
  const target = event.target;
  const buttonToggle = target.dataset.dropdownButton;
    if(!buttonToggle) return;

  const dropdownOptions = document.getElementById(buttonToggle);
  
  if(dropdownOptions.classList.contains('hidden')){
    closeAllDropdowns();
    showDropdown(dropdownOptions, target);
  }else{
    hideDropdown(dropdownOptions, target);
  }
})

console.log('number 8');

document.addEventListener('click', (event) => {
  const target = event.target;
  const selectedButton = target.dataset.roleOption;
    if(!selectedButton) return;

  const allTitles = document.querySelectorAll('.job-item__title');

  allTitles.forEach( title => {
    if(title.innerText !== event.target.dataset.roleOption){
      hide(title.parentElement)
    }else{
      show(title.parentElement)
    }
  })
  
  checkHiddenElements();
})



document.addEventListener('change', (event) => {
  const input = event.target.tagName;
  const inputValue = event.target.value;
  if(input != "INPUT") return;

  const allCommutingItems = document.querySelectorAll(".job-item__telecommuting");
  allCommutingItems.forEach( element => {
      const innerElement = element.innerHTML.toLocaleLowerCase()

      if(innerElement !== inputValue && inputValue !== "all"){
        hide(element.parentElement);
      }else{
        show(element.parentElement);
      }
  })
  
  hideParentElements();
  checkHiddenElements();
})



fetchJobs();

