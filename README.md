# Codurance HubSpot Site
The repository for the website hosted at https://www.codurance.com/.

The Codurance HubSpot account for managing content is [here](https://app.hubspot.com/getting-started/3042464/v3).

# Getting Started - Dev Environment

## Prerequisites:
1. Have a [developer sandbox](#👩‍💻-developer-sandbox) account on HubSpot.
2. Have installed Node.js and `npm`

After cloning this repository, install dependencies and Hubspot CLI using `npm install`.

## Connect your local environment to your HubSpot Developer Sandbox:
1. Run `npx hs init` to start the setup prompt.
2. On the prompt press enter, it opens the HubSpot Personal Access Key page in a new browser window.
    - If the *"Design Manager"* permissions checkbox is disabled on this page, this means the page has loaded for your primary Codurance account and not your developer account.
    - If this happens, [this page](https://app.hubspot.com/portal-recommend/l?slug=personal-access-key) will allow you to select which account you would like to use, and will redirect you to the correct Personal Access Key page.
3. Make sure that all permissions are selected, and click *"Generate personal access key"*.
4. Click *Show* and then *Copy* to copy the personal access key. Paste it into your terminal and press enter.
5. Enter a name that references your sandbox account and press enter again. This name will be only visible by you - it can be useful to give it the same name as your developer account.
6. Check the file `hubspot.config.yml` has been created.
7. Upload Hubspot code to your developer sandbox with `npx hs upload version_control version_control`.

**⚠️ If you see errors or warnings at this stage, don't worry.**
- Any errors relating to the `videos` table will be fixed when importing the data in this table from the live version of the site. This step is not mandatory unless you're working with videos specifically. More information can be found in the [Importing the Videos HubDB table](#🎥-importing-the-videos-hubdb-table) section of this README.

For more information on developer setup and the HubSpot CLI, see the HubSpot documentation:
[getting started with local development](https://developers.hubspot.com/docs/cms/guides/getting-started-with-local-development) and 
[hubspot CLI reference](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cms-cli).

# Development Workflow

![illustration of HubSpot development workflow](docs/assets/hubspot_dev_workflow.jpg)

# 🏗 File Structure

HubSpot code is stored within the `version_control` folder.

In order to make use of some global styles and utilities that use `HUBL`, we need to structure our codebase differently than the HubSpot default.

## 🗂 css

You will notice some css files are prefixed with an underscore (`_colors.css`). These files are partial css files, which means they are not loaded themselved into pages or modules. They are instead imported into another file.

Files that are not prefixed with an underscore are files that will be loaded in by modules or pages.

```
|-📁 version_control
  |- 📁 Codurance_September2020
      |-🗂 css
          |-📁 base
          |-📁 modules
          |-📁 pages
          |-📁 partials
          |-📁 utils
```

### 📁 ./base

This folder contains all of styles for the base, and global styling of our website. This is where we set up our variables and styles for colours, layout, typography, buttons etc.

### 📁 ./modules

Traditionally, modules within Hubspot are created as folders that contain their own `js`, `css` and `html` files, as well as some additional `json` files for metadata and data regarding input fields for the Hubspot UI. Since `HUBL` does not work within the `css` files of modules, we have to take a different approach to where we locate the styles.

To be able to use `HUBL` within our module's styles, we create a stylesheet with the same name as the module here. We then link to that file by using the following snippet at the top of our module's `html` file.

`{{ require_css(get_asset_url("relative-path-to-css")) }}`

Only the styles that are relevant to the internals of the module will be placed in the modules.css file. Any styling relating to the layout of the module on the page should be done through the page's stylesheet. This allows us to encapsulate styles to modules and pages.

### 📁 ./pages

When a page or template is created, a stylesheet for it is created with the same name as the page here. The styles relating to laying out modules within the page are kept here. Any styling relating to the internals of a module should be within the module's stylesheet.

The page or template can load these specfifc style's in the head of the `html`, again using 

`{{ require_css(get_asset_url("relative-path-to-css")) }}`.

### 📁 ./partials

Any styles relating to a partial within the `[...]/templates/partials` folder will be kept here. Similar to modules, we create a stylesheet with the same name as the partial and then link to the stylesheet from the partial's `html` using 

`{{ require_css(get_asset_url("relative-path-to-css")) }}`.

### 📁 ./utils

This folder contains partial utility files, which get combined into a single stylesheet called `utils.css`. This stylesheet can get imported into others to be able to access utility macros for development.

[More information on Macros and how to use them](https://developers.hubspot.com/docs/cms/hubl/variables-macros-syntax).

## 🗂 fonts

All fonts are linked to through the head of the `base.html` file. This includes the Proxima Nova font, and the LineAwesome icon library. This will be enough moving forward to complete pages.

As we develop on the site we want to look at cutting out everything that is no longer being used.

## 🗂 images

This folder ws created post migration by Hubspot to hold certain images used within the website.

As we use more images in the site, we can upload them to a relevent folder within Hubspot and link to them within our code. This provides us with then benefit of not having to store them within our Theme and in our version control system. It also allows the image to be served through the CDN that Hubspot uses - automatically compressing and serving a better optimised image.

As images are not used anymore, we can look to tidy up this folder.


## 🗂 js

Here we keep all the `js` files that we create or use for the website, with teh exception of the javascript specific to modules. A module's `js` can be located within the module's `module.js` file.

If you need to write a script that will be present in multiple modules, pages or templates, then it is to be located here.


## 🗂 modules

[HubSpot - Information about modules](https://developers.hubspot.com/docs/cms/building-blocks/modules).

This folder contains all the modules used within the site.

To create a module, you can use the following command `hs create module <name> [dest]` or create one using the UI within the Design Tools of Hubspot and pull the module down to your local codebase.


## 🗂 snippets

This folder holds `html` snippets which help keep content aligned to the design system, and make it easier for developers to work with.


## 🗂 templates

This folder holds the template `html` files for web pages. [See HubSpot documentation for more information](https://developers.hubspot.com/docs/cms/building-blocks/templates).

```
|-📁 version_control
  |- 📁 Codurance_September2020
      |- 🗂 templates
          |-📁 layouts
          |-📁 partials
          |-📁 sections
          |-📁 system
```

### 📁 ./layouts

Layouts are to be extended by templates. A layout will template out things like the meta information within `<head>` tags, and baisc page structure. The content of a page template will be inserted where the `{% block body %}` tag is featured.


### 📁 ./partials

The partials folder holds `html` files that isolate or capture re-usable sections within templates or layouts. An example of these would be a header or a footer.


### 📁 ./sections

Sections are reusable drag and drop sections meant to be inserted on drag and drop areas. They can be found when adding a new section to a drag and drop area under the menu "Theme sections", and the main difference between these and the "Saved sections" is that the former don't have a maximum limitation. 


### 📁 ./system

These files are templates for a specific purpose within the site, such as 404 pages. They are set through the settings within Hubspot. More information can be found [here](https://developers.hubspot.com/docs/cms/building-blocks/templates) under `System Pages`.


# 🧪 Testing

When you want to test a change made to any hubspot code you have to upload it to your developer sandbox using Hubspot CLI:

`hs upload version_control/Codurance_September2020 Codurance_September2020`

or if would like to watch for changes and re-upload automatically:

`hs watch --portal=<portal name> version_control/Codurance_September2020 Codurance_September2020 --initial-upload --remove`

The script should run on your sandbox portal by default, but to be sure you can include the name you gave your sandbox portal after `--portal=`. You can find your sandbox portal name by looking at the `hubspot.config.yml` file.

You can see your changes if you connect to your sandbox : https://app.hubspot.com/portal-recommend by previewing or creating
a page using the template you modified. The hubspot code is visible in Marketing -> Files and Templates -> Design Tool

**⚠️ For now we cannot propagate a file deletion from local environment to Hubspot account. 
Any deleted file must also be deleted from the Design Tools. ⚠️**


# 🧑‍🚀 Staging

Code is automatically deployed in the staging account when a pull request to master is opened

[link of staging account](https://app.hubspot.com/dashboard-library/8691204)


# 🚀 Going Live

Once pull request is accepted pushing to master triggers a git action that uploads changes to the [hubspot production account](https://app.hubspot.com/getting-started/3042464/v3) and makes the changes live.


# 👩‍💻 Developer Sandbox

1. Go to the [sandbox creation page](https://app.hubspot.com/signup/standalone-cms-developer)
2. Sign in with your Google account
3. Click on 'Create a new developer account'


# 🎥 Importing the Videos HubDB table
1. Ensure you're logged in on your primary Codurance account and not your developer sandbox account. This can be done by clicking the account menu in the top right corner on HubSpot and then hovering over the account name in the dropdown to reveal other accounts.
2. In the top navigation menu, click *Marketing*, then *Files and Templates*, and then *HubDB*.
3. Click on *Videos* to access the table settings.
4. In the top right corner, click the button marked *Actions*, then go to *Export* then *CSV*
5. Save this file somewhere.
6. Switch back to your developer account, and again navigate to *Marketing* -> *Files and Templates* -> *HubDB*.
7. Click *Create Table* and label it `Videos`, with the name `videos` and click *Create*.
8. Click *Actions* -> *Import*, and choose the CSV file you saved earlier, click *Next*.
9. On this screen, we need to create columns in the `Videos` table, and map them to columns from the CSV file.
10. We can ignore any rows with a `CSV COLUMN` name starting with `hs_`
11. We can also ignore the `name` column, as it's already mapped correctly.
12. To map a column:
    1. Click the dropdown at the end of the row.
    2. Click *Add Column*
    3. Set the `Column label`, `Column name` and `Column type` fields (see [Column Mappings](#column-mappings)).
    4. If the `Column type` field is *Select*, add each of the options here as well.
    5. Once all columns are mapped correctly, click *Import*

## Column Mappings
| CSV COLUMN | Column Label | Column Name | Column Type | Select Options |
|------------|--------------|-------------|-------------|----------------|
| type | event-type | type | Select | `video`,  `webinar` |
| date | event-date | date | Date | - |
| description | event-description | description | Text | - |
| video | video-url | video | URL | - |
| duration | video-duration | duration | Text | - |
| internal | internal-event | internal | Checkbox | - |
| thumbnail | thumbnail | thumbnail | Image | - |
| topic | topic | topic | Select | `cloud`, `code quality`, `kata`, `leadership`, `product development`, `software development`, `software modernisation`, `tdd` |
| language | language | language | Select | `spanish`, `english` |
---