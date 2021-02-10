const doMasonryMagic = _ => {
    let elem = document.querySelector('.grid-container');
    let msnry = new Masonry(elem, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 10,
        fitWidth: true
    });
    msnry.layout();
}

window.addEventListener('DOMContentLoaded', doMasonryMagic);