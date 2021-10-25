
const show = (element) => {
    element.classList.add('info-tooltip--show');
}
const hide = (element) => {
    element.classList.remove('info-tooltip--show');
}

const showHideTooltip = (event) => {
    event.preventDefault();

    const target = event.target;
    const tooltip = target.querySelector('.info-tooltip');

    if(!target.matches('.featured__role-type')) return

    if(tooltip.classList.contains("info-tooltip--show")){
        hide(tooltip);
    }else{
        show(tooltip);

    }
} 

document.addEventListener("click", showHideTooltip, false)
document.addEventListener("touchstart", showHideTooltip)


