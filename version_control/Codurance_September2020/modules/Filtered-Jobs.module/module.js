const jobsItemsList = document.querySelector('#jobs-list');
let jobList = [];


const displayJobs = (jobs) => {
  const htmlString = jobs.map(job => {
    return `
      <li class=job-item>
        <p class="job-item__department">${job.department}</p>
        <h3 class="job-item__title">${job.title}</h3>
        <p class="job-item__telecommuting">${job.telecommuting ? "Remote" : "Hybrid"}</p>
        <p class="job-item__city">${job.city}</p>
        <p class="job-item__country">${job.country}</p>
        <a class="ob-item__department text-cta-primary text-cta--right-arrow" href=${job.url}>Apply</a>
      </li>
    `
  }).join('');

  jobsItemsList.innerHTML = htmlString;

}
const getJobs = async () => {
  try{
      const urlEndpoint = "/_hcms/api/get_all_jobs";
      const response = await fetch(urlEndpoint);
      jobList = await response.json();
      displayJobs(jobList.response.jobs)
    
  }catch(error){
    console.log(error)
  }
}


getJobs();
