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
