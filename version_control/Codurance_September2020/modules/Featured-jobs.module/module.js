
const divTarget = document.querySelector("#role-type");

const showHideTooltip = (event) => {
    event.preventDefault();
    const tooltip = document.querySelector('.info-tooltip');

    if(tooltip.classList.contains("show")){
        tooltip.classList.remove("show")
        tooltip.classList.add("hide")
    }else{
        tooltip.classList.remove("hide")
        tooltip.classList.add("show")
    }
}

divTarget.addEventListener("click", showHideTooltip)
divTarget.addEventListener("touchstart", showHideTooltip)