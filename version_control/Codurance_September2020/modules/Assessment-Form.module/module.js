// Global object to store survey results
const surveyData = {
    responses: {},
    categoryTotals: {},
    categoryCounts: {},
    averages: {}
};

document.addEventListener("DOMContentLoaded", function() {
    let currentCategoryIndex = 1;
    const surveyContainer = document.querySelector('.survey__container');
    const surveyWrapper = document.querySelector('.survey__wrapper');
    const totalCategories = parseInt(surveyContainer.getAttribute('data-total-categories'), 10);
    const formId = surveyWrapper.getAttribute('data-form-id');
    const portalId = surveyWrapper.getAttribute('data-portal-id');
    const scoreProperty = surveyWrapper.getAttribute('data-score-property');
    const submitButton = document.getElementById("submitSurvey");
    const completedSurveyCategory = totalCategories + 1;

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

        scrollToNextQuestion();
        showOrHideButtons();
        checkCompletion();
        changeProgressBar();
        updateProgressBar(currentCategoryIndex);
    }

    function switchCategory(direction) {
        changeCategoryVisibility(currentCategoryIndex, false);
        currentCategoryIndex = Math.min(Math.max(currentCategoryIndex + direction, 1), totalCategories);
        changeCategoryVisibility(currentCategoryIndex, true);
        showOrHideButtons();
        changeProgressBar();
        updateProgressBar(currentCategoryIndex);
        scrollToTop();
    }

    function changeCategoryVisibility(index, shouldShow) {
        const category = document.getElementById("category-" + index);
        category.style.display = shouldShow ? "block" : "none";
    }

    function submitSurvey() {
        if (submitButton.disabled) return;

        collectSurveyData();
        setFinishedCategory();
        changeProgressBar();
        updateProgressBar(currentCategoryIndex);
        hideSurvey();
        loadHubSpotForm();
    }

    function collectSurveyData() {
        const options = document.querySelectorAll('.survey__answer-input:checked');

        options.forEach(function(option) {
            const category = option.closest('.survey__category').querySelector('.survey__category-title').innerText;
            const score = parseFloat(option.value);
            const question = option.closest('.survey__question-container').querySelector('.survey__question-text').innerText;

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
        for (const category in surveyData.categoryTotals) {
            surveyData.averages[category] = surveyData.categoryTotals[category] / surveyData.categoryCounts[category];
        }
    }

    function setFinishedCategory() {
        currentCategoryIndex = completedSurveyCategory;
    }

    function changeProgressBar() {
        const imageContainer = document.getElementById('image-container');
        const english = "en";
        const spanish = "es"

        if(document.querySelector(".survey").dataset.lang == english) {
            switch(currentCategoryIndex) {
                case 1:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBar/Observability_Tool_Progressbar_text_Step_1.png">';
                    break;
                case 2:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBar/Observability_Tool_Progressbar_text_Step_2.png">';
                    break;
                case 3:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBar/Observability_Tool_Progressbar_text_Step_3.png">';
                    break;
                case 4:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBar/Observability_Tool_Progressbar_text_Step_4.png">';
                    break;
                case 5:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBar/Observability_Tool_Progressbar_text_Step_5.png">';
                    break;
                default:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBar/Observability_Tool_Progressbar_text_Step_6.png">';
            }
        }
        if(document.querySelector(".survey").dataset.lang == spanish){
            switch(currentCategoryIndex) {
                case 1:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBarES/Observability_Tool_Progressbar_text_Step_1_ES.png">';
                    break;
                case 2:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBarES/Observability_Tool_Progressbar_text_Step_2_ES.png">';
                    break;
                case 3:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBarES/Observability_Tool_Progressbar_text_Step_3_ES.png">';
                    break;
                case 4:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBarES/Observability_Tool_Progressbar_text_Step_4_ES.png">';
                    break;
                case 5:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBarES/Observability_Tool_Progressbar_text_Step_5_ES.png">';
                    break;
                default:
                    imageContainer.innerHTML = '<img src="https://www.codurance.com/hubfs/raw_assets/public/Codurance_September2020/images/ObservabilityProgressBarES/Observability_Tool_Progressbar_text_Step_6_ES.png">';
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
        const hiddenInputs = formElement.querySelectorAll('input[type="hidden"]');
        const surveyScores = {};

        Object.keys(surveyData.averages).forEach(function(category) {
            surveyScores[category] = surveyData.averages[category].toFixed(2);
        });

        const surveyScoresJson = JSON.stringify(surveyScores);

        hiddenInputs.forEach(function(input) {
            const inputName = input.name;

            if (inputName === 'hs_context') return;

            if (inputName.includes(scoreProperty)) {
                input.value = surveyScoresJson;
            }
        });
    }

    function scrollToNextQuestion() {
        const questions = document.querySelectorAll(".survey__question-container");

        questions.forEach((question, index) => {
            const inputs = question.querySelectorAll("input[type=\"radio\"]");
            inputs.forEach(input => {
                input.addEventListener("change", function() {
                    if (index < questions.length - 1) {
                        const nextQuestion = questions[index + 1];
                        nextQuestion
                          .closest("div.survey__question-container")
                          .scrollIntoView(
                            { behavior: "smooth",
                                block: "center"}
                          );
                    }
                });
            });
        });
    }

    function showOrHideButtons() {
        toggleButtonVisibility("prevCategory", currentCategoryIndex > 1);
        toggleButtonVisibility("nextCategory", currentCategoryIndex < totalCategories);
        toggleButtonVisibility("submitSurvey", currentCategoryIndex === totalCategories);
    }

    function toggleButtonVisibility(buttonId, shouldShow) {
        const button = document.getElementById(buttonId);
        button.classList.toggle('survey__button--hidden', !shouldShow);
    }

    function checkCompletion() {
        const allAnswered = Array.from(document.querySelectorAll('.survey__question-container'))
          .every(function (container) {
              return container.querySelector('input[type="radio"]:checked') !== null;
          });

        submitButton.disabled = !allAnswered;
        submitButton.classList.toggle("survey__button--disabled", !allAnswered);
    }

    function updateProgressBar(step) {
        const steps = document.querySelectorAll('.step');
        const progressLine = document.querySelector('.progress-bar-line');
        const totalSteps = steps.length;

        steps.forEach((stepElement, index) => {
            if (index < step) {
                stepElement.classList.add('active');
            } else {
                stepElement.classList.remove('active');
            }
        });

        // Calcular el porcentaje de progreso
        let progressPercentage;
        if (step === totalSteps) {
            progressPercentage = 100; // Si es el último paso, llenar completamente
        } else {
            // Calcular hasta la mitad entre el paso actual y el siguiente
            progressPercentage = ((step - 0.5) / (totalSteps - 1)) * 100;
        }

        // Asegurarse de que el progreso no exceda el 100%
        progressPercentage = Math.min(progressPercentage, 100);

        // Actualizar el ancho de la línea de progreso
        progressLine.style.width = `${progressPercentage}%`;
    }

});