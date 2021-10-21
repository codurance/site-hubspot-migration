
const divTarget = document.querySelector("#role-type");

const show = (element) => {
   return element.classList.add('info-tooltip--show');
}
const hide = (element) => {
   return element.classList.remove('info-tooltip--show');
}

const showHideTooltip = (event) => {
    event.preventDefault();
    const tooltip = document.querySelector('.info-tooltip');

    if(tooltip.classList.contains("info-tooltip--show")){
        hide(tooltip);
    }else{
        show(tooltip);
    }
}

divTarget.addEventListener("click", showHideTooltip, false)
divTarget.addEventListener("touchstart", showHideTooltip, false)