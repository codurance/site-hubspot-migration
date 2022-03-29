
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


function fixMenu($menu) {
    $menu.addClass('secondary-menu--fixed');
}

function dropMenu($menu) {
    $menu.removeClass('secondary-menu--fixed');
}