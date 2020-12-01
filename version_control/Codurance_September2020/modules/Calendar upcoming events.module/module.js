; const initialiseUpcomingEvents = () => {

  const MEDIUM_WINDOW_WIDTH = 1023;
  let trackHasSetWidth, ticking, mouseStartPosition, mouseEndPosition, cardWindowScrollPosition, mousePositionDifference;
  let currentPosition = 0;

  const SELECTORS = {
    CARD_WINDOW: '[data-card-window]',
    TRACK: '[data-card-track]',
    CARDS: '[data-card]',
    LEFT_BUTTON: '[data-up-events-button-left]',
    RIGHT_BUTTON: '[data-up-events-button-right]'
  }

  const TRACK = window.document.querySelector(SELECTORS.TRACK);
  const CARD_WINDOW = window.document.querySelector(SELECTORS.CARD_WINDOW);
  const CARDS = Array.from(window.document.querySelectorAll(SELECTORS.CARDS));
  const LEFT_BUTTON = window.document.querySelector(SELECTORS.LEFT_BUTTON);
  const RIGHT_BUTTON = window.document.querySelector(SELECTORS.RIGHT_BUTTON);

  const MIN_SWIPE_LENGTH = 100;

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
    CARD_WINDOW.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    LEFT_BUTTON.addEventListener('click', navigateLeft);
    RIGHT_BUTTON.addEventListener('click', navigateRight);
  }

  function handleResize() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        sizeTrack();
        resetCardTrackLeftPosition();
        ticking = false;
      });

      ticking = true;
    }
  }

  function resetCardTrackLeftPosition() {
    if (windowIsMediumOrBelow()) {
      const currentLeft = parseFloat(TRACK.style.left);
      const maxLeft = calculateMaxLeftPosition();
      TRACK.style.left = Math.max(currentLeft, maxLeft) + 'px';
    }
  }

  function sizeTrack() {
    if (windowIsMediumOrBelow() && !trackHasSetWidth) {
      addTrackWidth();
      resetTrackPosition();
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

  function resetTrackPosition() {
    currentPosition = 0;
    TRACK.style.left = '0px';
  }

  function resetTrackWidth() {
    TRACK.style.removeProperty('width');
    trackHasSetWidth = false;
  }







  // ----------------------------------------

  function handleMouseDown(e) {
    window.addEventListener('mousemove', handleDrag);
    logMouseDown(e.clientX);
  }
  
  function handleMouseUp(e) {
    window.removeEventListener('mousemove', handleDrag);
    if (mousePositionDifference >= MIN_SWIPE_LENGTH) navigateLeft();
    if (mousePositionDifference <= -MIN_SWIPE_LENGTH) navigateRight();
    resetMousePositionDifference();
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

  function resetMousePositionDifference() {
    mousePositionDifference = 0;
  }

  function navigateRight() {
    const maxLeft = calculateMaxLeftPosition();
    const currentLeft = getLeftPosition();
    if (currentLeft <= maxLeft) return;

    let targetPosition = currentPosition + 1;
    const totalCardWidth = getTotalCardWidth();
    const targetLeft = totalCardWidth * targetPosition * -1;
    const newLeft = Math.max(targetLeft, maxLeft);
    TRACK.style.left = `${newLeft}px`;
    updateCurrentPosition(targetPosition);
  }

  function navigateLeft() {
    if (currentPosition <= 0) return;

    let targetPosition = currentPosition - 1;
    const totalCardWidth = getTotalCardWidth();
    const targetLeft = totalCardWidth * targetPosition * -1;
    const newLeft = Math.min(targetLeft, 0);
    TRACK.style.left = `${newLeft}px`;
    updateCurrentPosition(targetPosition);
  }

  function calculateMaxLeftPosition() {
    return Math.min(CARD_WINDOW.clientWidth - TRACK.clientWidth, 0);
  }

  function getLeftPosition() {
    if (TRACK.style.left) {
      return parseFloat(TRACK.style.left);
    }

    return parseFloat(window.getComputedStyle(TRACK).getPropertyValue('left'));
  }

  function getTotalCardWidth() {
    const innerCardWidth = CARDS[0].getBoundingClientRect().width;
    const cardMarginWidth = parseFloat(window.getComputedStyle(CARDS[0]).marginRight);
    return innerCardWidth + (cardMarginWidth * 2);
  }

  function updateCurrentPosition(position) {
    currentPosition = position;
  }
};

window.addEventListener('DOMContentLoaded', initialiseUpcomingEvents);