;(function() {

  const MEDIUM_WINDOW_WIDTH = 1023;
  let trackHasSetWidth, ticking, mouseStartPosition, mouseEndPosition, cardWindowScrollPosition;

  const SELECTORS = {
    CARD_WINDOW: '[data-card-window]',
    TRACK: '[data-card-track]',
    CARDS: '[data-card]'
  }

  const TRACK = window.document.querySelector(SELECTORS.TRACK);
  const CARD_WINDOW = window.document.querySelector(SELECTORS.CARD_WINDOW);

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
  CARD_WINDOW.addEventListener('mousedown', handleMouseDown);
  CARD_WINDOW.addEventListener('mouseup', handleMouseUp);


  function handleMouseDown(e) {
    console.log('mouse x-pos: ', e.layerX);

    window.addEventListener('mousemove', handleDrag);

    logMouseDown(e.layerX);
  }

  function handleMouseUp(e) {
    console.log('mouse x-pos: ', e.layerX);
    window.removeEventListener('mousemove', handleDrag);
    console.log(`mousePositionDifference: `, mousePositionDifference);
  }

  function handleDrag(e) {
    // console.log('dragging');
    // const mousePositionDifference = calculateMouseDifference(e.layerX);
    // const newScrollPosition = CARD_WINDOW.scrollLeft + mousePositionDifference;

    // CARD_WINDOW.scrollLeft = newScrollPosition;
  }

  function logMouseDown(xPosition) {
    mouseStartPosition = xPosition;
  }

  function calculateMouseDifference(endPosition) {
    return mouseStartPosition - endPosition;
  }
})();