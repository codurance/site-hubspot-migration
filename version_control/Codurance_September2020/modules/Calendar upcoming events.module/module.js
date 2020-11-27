; (function () {

  const MEDIUM_WINDOW_WIDTH = 1023;
  let trackHasSetWidth, ticking, mouseStartPosition, mouseEndPosition, cardWindowScrollPosition, mousePositionDifference;
  let currentPosition = 0;

  const SELECTORS = {
    CARD_WINDOW: '[data-card-window]',
    TRACK: '[data-card-track]',
    CARDS: '[data-card]'
  }

  const TRACK = window.document.querySelector(SELECTORS.TRACK);
  const CARD_WINDOW = window.document.querySelector(SELECTORS.CARD_WINDOW);
  const CARDS = Array.from(window.document.querySelectorAll(SELECTORS.CARDS));

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
    const trackPadding = parseFloat(window.getComputedStyle(TRACK).paddingRight);
    const cardWidth = CARDS[0].getBoundingClientRect().width;
    const cardMargin = parseFloat(window.getComputedStyle(CARDS[0]).marginRight);

    const totalWidthOfCards = cardWidth * CARDS.length;
    const totalMargin = (cardMargin * 2) * CARDS.length;

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
  window.addEventListener('mouseup', handleMouseUp);

  function handleMouseDown(e) {
    window.addEventListener('mousemove', handleDrag);
    logMouseDown(e.clientX);
  }

  function handleMouseUp(e) {
    window.removeEventListener('mousemove', handleDrag);
    if (mousePositionDifference >= 100) moveTrackRight();
    if (mousePositionDifference <= -100) moveTrackLeft();
  }

  function moveTrackLeft() {
    let targetPosition = currentPosition + 1;
    const maxLeft = calculateMaxLeftPosition();
    const totalCardWidth = getTotalCardWidth();
    const targetLeft = totalCardWidth * targetPosition * -1;
    const currentLeft = getLeftPosition();
    if (currentLeft > maxLeft) {
      const newLeft = Math.max(targetLeft, maxLeft);
      TRACK.style.left = `${newLeft}px`;
      updateCurrentPosition(targetPosition);
    }
  }

  function moveTrackRight() {
    let targetPosition = Math.max(currentPosition - 1, 0);
    const totalCardWidth = getTotalCardWidth();
    const targetLeft = totalCardWidth * targetPosition * -1;
    const newLeft = Math.min(targetLeft, 0);
    TRACK.style.left = `${newLeft}px`;
    updateCurrentPosition(targetPosition);
  }

  function calculateMaxLeftPosition() {
    const rightPadding = parseFloat(window.getComputedStyle(TRACK).getPropertyValue('padding-right'));
    return Math.min(CARD_WINDOW.clientWidth - rightPadding - TRACK.clientWidth, 0);
  }

  function getLeftPosition() {
    if (TRACK.style.left) {
      return parseFloat(TRACK.style.left);
    }

    return 0;
  }

  function getTotalCardWidth() {
    const innerCardWidth = CARDS[0].getBoundingClientRect().width;
    const cardMarginWidth = parseFloat(window.getComputedStyle(CARDS[0]).marginRight);
    return innerCardWidth + (cardMarginWidth * 2);
  }

  function updateCurrentPosition(position) {
    currentPosition = position;
  }

  function handleDrag(e) {
    mousePositionDifference = calculateMouseDifference(e.clientX);
  }

  function logMouseDown(xPosition) {
    mouseStartPosition = xPosition;
  }

  function calculateMouseDifference(endPosition) {
    return endPosition - mouseStartPosition;
  }
})();