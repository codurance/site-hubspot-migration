
let previousViewpoint = 0;

$(window).scroll(function() {
    let currentViewpoint = $(this).scrollTop();

    if(currentViewpoint > previousViewpoint) {
        hideMenu($('.secondary-menu'));
    }
    else {
        showMenu($('.secondary-menu'));
    }

    previousViewpoint = currentViewpoint;
});

function hideMenu($menu) {
    $menu.addClass('fixed').removeClass('default');
}

function showMenu($menu) {
    $menu.addClass('default').removeClass('fixed');
}