# [Codurance Hubspot account](https://app.hubspot.com/getting-started/3042464/v3)

leankit board ( Service Line Transformation ): [board](https://codurance-online.leankit.com/board/1048837936)

## Setup the development environment

Prerequisites :
1. Have a [developer sandbox](#developer-sandbox)
2. npm

after cloning this repository

- Install dependencies and Hubspot CLI :  
`npm install`

- Connect your local environment to your [developer sandbox](#developer-sandbox) :  
1. `npx hs init`
2. On the prompt press enter, it opens a browser new page
3. In the page, choose your developer sandbox account and click on **Continue with this account**
4. copy the personal access key and paste it in your terminal
5. enter a name that references your sandbox account : this name will be only visible by you
6. check the file hubspot.config.yml has been created
 
- Upload Hubspot code to your developer sandbox  
`npx hs upload version_control version_control`


for more information some links to the hubspot official documentation :  
[getting started with local development](https://developers.hubspot.com/docs/cms/guides/getting-started-with-local-development)  
[hubspot CLI reference](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cms-cli) 


## Development workflow

![illustration of how to go the site preview](docs/assets/hubspot_dev_workflow.jpg)

### local development

Hubspot code is within the version_control folder

**TODO** describe structure  
1.themes  
2.templates  
3.modules  
4.css  
5.serverless functions  

### testing

When you want to test a change made to any hubspot code you have to upload it to your developer sandbox using Hubspot CLI :

`npx hs upload version_control version_control`

You can see your changes if you connect to your sandbox : https://app.hubspot.com/portal-recommend by previewing or creating
a page using the template you modified  
The hubspot code is visible in Marketing -> files and templates -> Design tool  

**/!\ For now we cannot propagate a file deletion from local to Hubspot account, so any deleted file has to be deleted also from the Designer tool**

### Staging

The next step is to push changes to staging account to allow sales and marketing people double check the impact made by your changes

1. `git push origin <your-branch>`
2. create a merge request to `staging`  

Once the merge request is accepted, a git action is triggered to upload your changes to hubspot staging account  

**TODO** put link of staging account

### Go live

Once the changes has been accepted create a merge request to `master`  
pushing to master triggers a git action that upload changes to the [hubspot production account](https://app.hubspot.com/getting-started/3042464/v3)
and make the changes live

## developer sandbox

Go to the [sandbox creation page](https://app.hubspot.com/signup/standalone-cms-developer)  
Sign in with your google account  
Click on 'Create a new developer account'



