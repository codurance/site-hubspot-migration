# HubSpot Compass Module Documentation

## Introduction

The HubSpot Compass Module is designed to facilitate the creation of a multi-step survey, similar to the old Compass tool, for generating leads automatically based on a self-guided customer survey. The module is provided as a **white label** solution, offering basic styling and robust functionality that relies on the proper configuration of HubDB datasets, HubSpot Forms, and Contact properties.

### Technologies Used:

- HubSpot
- Vanilla CSS
- Vanilla HTML
- Vanilla JavaScript

## High-Level Overview

The module loads questions and answers from a HubDB table, which can be selected using a dropdown in the module fields. For more details, refer to the [HubDB Table](#hubdb-table) section.

### Overview:

1. **Questions and Categories**: Questions are grouped by the `category` column in the HubDB table, with only one category displayed at a time.
2. **Navigation**: Users navigate between categories using "Next" and "Previous" buttons. The button visibility is context-sensitive:
    - **First Category**: Only the "Next Category" button is visible.
    - **Last Category**: Both "Previous Category" and "Submit" buttons are visible.
    - **Middle Categories**: Both "Previous Category" and "Next Category" buttons are visible.
3. **Submit Action**: Upon clicking the "Submit" button, the module renders a HubSpot form using the HubSpot API. This form includes a hidden field for storing the survey results as a JSON object. The hidden field must be configured to store the survey scores under a specific Contact property (e.g., `Observability Score`).
4. **Form Submission**: After the user completes the form, HubSpot processes the submission according to the form’s configuration, typically updating the Contact record with the survey results stored as JSON in the specified custom property.

## Module Fields

- **HubDB Table**: Specifies the HubDB table containing the survey data.
- **Form**: Selects the HubSpot form to render and submit.
- **Portal ID**: The ID of the HubSpot portal where the form is hosted. This can be found in the HubSpot URL.

## HubDB Table

The HubDB table serves as the data source for the survey. Each survey should have a dedicated HubDB table.

### Table Structure:

- **Category** (Text): The main category name for the survey (e.g., "Instrumentation and Data Collection", "Data Management and Optimization").
- **Topic** (Text): A sub-topic or specific focus within the category (e.g., "Comprehensiveness of Log Collection", "Data Quality and Relevance").
- **Question** (Text): The text of the survey question.
- **Answers_with_score** (Rich Text): A JSON string containing an array of answer objects. Each object must have `answer` and `score` properties.

### Example JSON Format:

```[{"answer": "We do not collect logs.", "score": 0}, {"answer": "We collect logs for a few critical services.", "score": 1},{"answer": "We collect logs for all major services.", "score": 3},{"answer": "We have comprehensive log collection.", "score": 4} ]```

⚠️ **Important**: The JSON must strictly follow the correct format—only double quotes (`"`) are allowed for key-value pairs, and the structure must be valid JSON. Incorrect formatting will prevent HubL from properly parsing the data.

## Contact Property for Survey Results

Instead of using a Custom Object, the survey results are stored as a JSON object in a custom property on the Contact.

### Required Property:

- **Observability Score**: A custom property under the "Survey" group that stores the JSON representation of all category scores from the survey.

### Example JSON Stored in `Observability Score`:

`{"Instrumentation and Data Collection": "3.50","Data Management and Optimization": "3.00","Full-Scale Utilization of Observability": "1.50","Business Alignment and Usage": "1.50","Continuous Improvement and Innovation": "1.50" }`

### How It Works:

- The module collects the scores for each category as the user progresses through the survey.
- Upon submission, the scores are compiled into a JSON object.
- This JSON object is then assigned to the hidden field corresponding to the `Observability Score` property in the HubSpot form.
- When the form is submitted, the JSON object is saved to the Contact record under the `Observability Score` property.

## Additional Notes

- **Form Configuration**: Ensure that the HubSpot form used in this module includes a hidden field mapped to the `Observability Score` property. The field name should be unique and identifiable within the module logic.
- **JSON Storage**: Storing the survey results as a JSON object allows for flexibility in data retrieval and analysis. You can later parse this JSON string to extract individual category scores for reporting or automation purposes.
- **Flexibility and Adaptability**: This module is designed to be flexible and adaptable, allowing it to be used for various survey-based lead generation tasks with minimal adjustments to the underlying logic.

## Summary

This documentation outlines how the HubSpot Compass Module operates, focusing on loading survey data from HubDB, handling multi-step navigation, and storing survey results as JSON in a custom Contact property. Proper configuration of HubDB tables, HubSpot forms, and Contact properties is crucial for the successful deployment of this module.

## Knowledge base
[HubSpot Getting Started With Local Development](https://developers.hubspot.com/docs/cms/guides/getting-started-with-local-development)
[HubSpot Create and Edit Modules](https://knowledge.hubspot.com/design-manager/create-and-edit-modules)
