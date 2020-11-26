;(function() {

  const MEDIUM_WINDOW_WIDTH = 1023;
  let trackHasSetWidth, ticking, mouseStartPosition, mouseEndPosition;

  const SELECTORS = {
    TRACK: '[data-card-track]',
    CARDS: '[data-card]'
  }

  const TRACK = window.document.querySelector(SELECTORS.TRACK);

  init();

  function init() {
    sizeTrack();
    setUpEventListener();
  }

  function windowIsMediumOrBelow() {
    return window.innerWidth <= MEDIUM_WINDOW_WIDTH;
  }

  function windowIsLargerThanMedium() {
    return window.innerWidth > MEDIUM_WINDOW_WIDTH;
  }

  function setUpEventListener() {
    window.addEventListener('resize', handleResize);
  }

  function handleResize() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        sizeTrack();
        ticking = false;
      });

      ticking = true;
    }
  }

  function sizeTrack() {
    if (windowIsMediumOrBelow() && !trackHasSetWidth) {
      addTrackWidth();
    } else if (windowIsLargerThanMedium() && trackHasSetWidth) {
      resetTrackWidth();
    }
    return;
  }

  function addTrackWidth() {
    const cards = Array.from(window.document.querySelectorAll(SELECTORS.CARDS));
    const trackPadding = parseFloat(window.getComputedStyle(TRACK).paddingRight);
    const cardWidth = cards[0].getBoundingClientRect().width;
    const cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginRight);

    const totalWidthOfCards = cardWidth * cards.length;
    const totalMargin = (cardMargin * 2) * cards.length;

    const totalWidthOfTrack = totalWidthOfCards + totalMargin + trackPadding;

    if (totalWidthOfTrack) {
      TRACK.style.width = totalWidthOfTrack + "px";
      trackHasSetWidth = true;
    }
  }

  function resetTrackWidth() {
    TRACK.style.removeProperty('width');
    trackHasSetWidth = false;
  }







  // ----------------------------------------
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);


  function handleMouseDown(e) {
    console.log('mouse x-pos: ', e.clientX);

    window.addEventListener('mousemove', handleDrag);

    logMouseDown(e.clientX);
  }

  function handleMouseUp(e) {
    console.log('mouse x-pos: ', e.clientX);

    const mousePositionDifference = calculateMouseDifference(e.clientX);

    window.removeEventListener('mousemove', handleDrag);
    console.log(`mousePositionDifference: `, mousePositionDifference);
  }

  function handleDrag(e) {
    console.log('dragging');
  }

  function logMouseDown(xPosition) {
    mouseStartPosition = xPosition;
  }

  function calculateMouseDifference(endPosition) {
    return mouseStartPosition - endPosition;
  }
})();