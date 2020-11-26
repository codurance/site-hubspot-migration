;(function() {

  const MEDIUM_WINDOW_WIDTH = 1023;

  // if (windowIsLargerThanMedium()) {
  //   setUpEventListener();
  // }

  if (windowIsMediumOrBelow()) {
    // removeEventListener()
    sizeTrack();
  }

  function windowIsMediumOrBelow() {
    return window.innerWidth <= MEDIUM_WINDOW_WIDTH;
  }

  function windowIsLargerThanMedium() {
    return window.innerWidth > MEDIUM_WINDOW_WIDTH;
  }

  function setUpEventListener() {
    window.addEventListener('resize', sizeTrack);
  }

  function removeEventListener() {
    window.removeEventListener('resize', sizeTrack);
  }

  function sizeTrack() {
    const track = window.document.querySelector('[data-card-track]');
    const cards = Array.from(window.document.querySelectorAll('[data-card]'));

    const trackPadding = parseFloat(window.getComputedStyle(track).paddingRight);

    const cardWidth = cards[0].getBoundingClientRect().width;
    const cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginRight);

    const totalWidthOfCards = cardWidth * cards.length;
    const totalMargin = (cardMargin * 2) * cards.length;

    const totalWidthOfTrack = totalWidthOfCards + totalMargin + trackPadding;

    if (totalWidthOfTrack) {
      track.style.width =  totalWidthOfTrack + "px";
    }
  }

})();
