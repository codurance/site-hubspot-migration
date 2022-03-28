
let previousViewpoint = 0;

$(window).scroll(function(event) {
    let currentViewpoint = $(this).scrollTop();

    if(currentViewpoint > previousViewpoint) {
        fixMenu($('.secondary-menu'));
    }   
    else {
        dropMenu($('.secondary-menu'));        
    }

    previousViewpoint = currentViewpoint;
});

let anchorLinks = document.querySelectorAll('a[data-hs-anchor="true"]');
let rootElement = document.documentElement;
let menuHeight = getComputedStyle(rootElement).getPropertyValue("--menu-height");

function fixMenu($menu) {
    $menu.addClass('secondary-menu--fixed');

    anchorLinks.forEach(element => {
        element.style.setProperty("--menu-height", menuHeight);
    });
}

function dropMenu($menu) {
    let menuHeightFormatted = parseFloat(menuHeight) * 2 + "rem";
    
    anchorLinks.forEach(element => {
        element.style.setProperty("--menu-height", menuHeightFormatted);
    });

    $menu.removeClass('secondary-menu--fixed');
}