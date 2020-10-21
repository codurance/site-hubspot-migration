var equalizeHeights = function() {
  var maxHeight = 0;

  $('.equalheight').each(function () {
    $(this).height('auto');
    var thisH = $(this).height();
    if (thisH > maxHeight) { maxHeight = thisH; }
  });

  $('.equalheight').height(maxHeight);
}
$(document).ready(function() {
    equalizeHeights();
  });
$(window).resize(function () {
  equalizeHeights();
});


