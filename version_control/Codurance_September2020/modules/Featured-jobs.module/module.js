
const show = (element) => {
    element.classList.add('info-tooltip--show');
}
const hide = (element) => {
    element.classList.remove('info-tooltip--show');
}

const showHideTooltip = (event) => {
    
    const target = event.target;
    const tooltip = target.querySelector('.info-tooltip');
    
    if(!target.matches('.featured__role-type')) return
    
    if(tooltip.classList.contains("info-tooltip--show")){
        hide(tooltip);
    }else{
        show(tooltip);
    }

    event.preventDefault();
} 

const createListeners = () => {
    const sectionTarget = document.querySelector(".featured__cards-container")
    sectionTarget.addEventListener("click", showHideTooltip, false)
    sectionTarget.addEventListener("touchstart", showHideTooltip)
}

window.addEventListener("DOMContentLoaded", createListeners);


