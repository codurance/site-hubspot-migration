// Global object to store survey results
var surveyData = {
    responses: {},
    categoryTotals: {},
    categoryCounts: {},
    averages: {}
};

document.addEventListener("DOMContentLoaded", function() {
    var currentCategoryIndex = 1;
    var surveyContainer = document.querySelector('.survey__container');
    var surveyWrapper = document.querySelector('.survey__wrapper');
    var totalCategories = parseInt(surveyContainer.getAttribute('data-total-categories'), 10);
    var formId = surveyWrapper.getAttribute('data-form-id');
    var portalId = surveyWrapper.getAttribute('data-portal-id');
    var scoreProperty = surveyWrapper.getAttribute('data-score-property');
    var submitButton = document.getElementById("submitSurvey");

    initializeSurvey();

    function initializeSurvey() {
        document.getElementById("nextCategory").addEventListener("click", function() {
            switchCategory(1);
        });

        document.getElementById("prevCategory").addEventListener("click", function() {
            switchCategory(-1);
        });

        submitButton.addEventListener("click", function() {
            submitSurvey();
        });

        document.querySelectorAll('.survey__answer-input').forEach(function(input) {
            input.addEventListener("change", checkCompletion);
        });

        showOrHideButtons();
        checkCompletion();
        changeProgressBar();
    }

    function showOrHideButtons() {
        toggleButtonVisibility("prevCategory", currentCategoryIndex > 1);
        toggleButtonVisibility("nextCategory", currentCategoryIndex < totalCategories);
        toggleButtonVisibility("submitSurvey", currentCategoryIndex === totalCategories);
    }

    function toggleButtonVisibility(buttonId, shouldShow) {
        var button = document.getElementById(buttonId);
        button.classList.toggle('survey__button--hidden', !shouldShow);
    }

    function switchCategory(direction) {
        changeCategoryVisibility(currentCategoryIndex, false);
        currentCategoryIndex = Math.min(Math.max(currentCategoryIndex + direction, 1), totalCategories);
        changeCategoryVisibility(currentCategoryIndex, true);
        showOrHideButtons();
        changeProgressBar();
    }

    function changeCategoryVisibility(index, shouldShow) {
        var category = document.getElementById("category-" + index);
        category.style.display = shouldShow ? "block" : "none";
    }

    function checkCompletion() {
        var allAnswered = Array.from(document.querySelectorAll('.survey__question-container'))
            .every(function(container) {
                return container.querySelector('input[type="radio"]:checked') !== null;
            });

        submitButton.disabled = !allAnswered;
        submitButton.classList.toggle("survey__button--disabled", !allAnswered);
    }

    function collectSurveyData() {
        var options = document.querySelectorAll('.survey__answer-input:checked');

        options.forEach(function(option) {
            var category = option.closest('.survey__category').querySelector('.survey__category-title').innerText;
            var score = parseFloat(option.value);
            var question = option.closest('.survey__question-container').querySelector('.survey__question-text').innerText;

            if (!surveyData.categoryTotals[category]) {
                surveyData.categoryTotals[category] = 0;
                surveyData.categoryCounts[category] = 0;
            }

            surveyData.responses[question] = score;
            surveyData.categoryTotals[category] += score;
            surveyData.categoryCounts[category] += 1;
        });

        calculateAverages();
    }

    function calculateAverages() {
        for (var category in surveyData.categoryTotals) {
            surveyData.averages[category] = surveyData.categoryTotals[category] / surveyData.categoryCounts[category];
        }
    }

    function submitSurvey() {
        if (submitButton.disabled) return;

        collectSurveyData();
        hideSurvey();
        loadHubSpotForm();
    }

    function hideSurvey() {
        document.getElementById("prevCategory").classList.add('survey__button--hidden');
        document.getElementById("nextCategory").classList.add('survey__button--hidden');
        submitButton.classList.add('survey__button--hidden');
        surveyContainer.style.display = "none";
    }

    function loadHubSpotForm() {
        function loadForm() {
            if (typeof hbspt !== 'undefined') {
                hbspt.forms.create({
                    region: "eu1",
                    portalId: portalId,
                    formId: formId,
                    target: "#hubspotFormContainer",
                    onFormReady: function(formElement) {
                        populateHiddenFieldsWithScores(formElement);
                    }
                });
            } else {
                console.error("HubSpot Forms API is not loaded.");
                setTimeout(loadForm, 100);
            }
        }

        document.querySelector('.survey__form-container').style.display = "block";
        loadForm();
    }

    function populateHiddenFieldsWithScores(formElement) {
        var hiddenInputs = formElement.querySelectorAll('input[type="hidden"]');
        var surveyScores = {};

        Object.keys(surveyData.averages).forEach(function(category) {
            surveyScores[category] = surveyData.averages[category].toFixed(2);
        });

        var surveyScoresJson = JSON.stringify(surveyScores);

        hiddenInputs.forEach(function(input) {
            var inputName = input.name;

            if (inputName === 'hs_context') return;

            if (inputName.includes(scoreProperty)) {
                input.value = surveyScoresJson;
            }
        });
    }

    function changeProgressBar() {
        const imageContainer = document.getElementById('image-container');

        switch(currentCategoryIndex) {
            case 1:
                imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/Progressbar/Observability_Tool_Progressbar_text_Step_1.svg">';
                break;
            case 2:
                imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/Progressbar/Observability_Tool_Progressbar_text_Step_2.svg">';
                break;
            case 3:
                imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/Progressbar/Observability_Tool_Progressbar_text_Step_3.svg">';
                break;
            case 4:
                imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/Progressbar/Observability_Tool_Progressbar_text_Step_4.svg">';
                break;
            case 5:
                imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/Progressbar/Observability_Tool_Progressbar_text_Step_5.svg">';
                break;
            default:
                imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/Progressbar/Observability_Tool_Progressbar_text_Step_6.svg">';
        }
    }
});