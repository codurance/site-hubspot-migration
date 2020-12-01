; const initialiseUpcomingEvents = () => {

  const MEDIUM_WINDOW_WIDTH = 1023;
  let trackHasSetWidth, ticking, mouseStartPosition, mousePositionDifference, leftStartPosition, maxLeft;
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
  const ANIMATING_CLASS = 'animating';
  const LEFT_BUTTON = window.document.querySelector(SELECTORS.LEFT_BUTTON);
  const RIGHT_BUTTON = window.document.querySelector(SELECTORS.RIGHT_BUTTON);

  const MIN_SWIPE_LENGTH = 50;

  init();

  function init() {
    sizeTrack();
    setUpEventListeners();
  }

  function windowIsMediumOrBelow() {
    return window.innerWidth <= MEDIUM_WINDOW_WIDTH;
  }

  function windowIsLargerThanMedium() {
    return window.innerWidth > MEDIUM_WINDOW_WIDTH;
  }

  function setUpEventListeners() {
    window.addEventListener('resize', handleResize);
    CARD_WINDOW.addEventListener('mousedown', handleMouseDown);
    CARD_WINDOW.addEventListener('mouseup', handleMouseUp);
    CARD_WINDOW.addEventListener('mouseleave', handleMouseUp);
    CARD_WINDOW.addEventListener('touchstart', handleMouseDown);
    CARD_WINDOW.addEventListener('touchend', handleMouseUp);
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
      TRACK.style.left = Math.max(currentLeft, maxLeft) + 'px';
    }
  }

  function sizeTrack() {
    if (windowIsMediumOrBelow() && !trackHasSetWidth) {
      addTrackWidth();
      calculateMaxLeftPosition();
      resetTrackPosition();
      disableNavButton(LEFT_BUTTON);
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

  function handleMouseDown(e) {
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('mousemove', handleDrag);

    logMouseDown(unify(e).clientX);
  }

  function handleMouseUp(e) {
    window.removeEventListener('touchmove', handleDrag);
    window.removeEventListener('mousemove', handleDrag);

    if (mousePositionDifference >= MIN_SWIPE_LENGTH) {
      navigateLeft();
    } else if (mousePositionDifference <= -MIN_SWIPE_LENGTH) {
      navigateRight();
    } else {
      returnToStartPosition();
    }

    resetMousePositionDifference();
  }

  function returnToStartPosition() {
    addAnimationClass();
    TRACK.style.left = leftStartPosition + 'px';
  }

  function handleDrag(e) {
    e.preventDefault();
    mousePositionDifference = calculateMouseDifference(unify(e).clientX);
    let newLeft = leftStartPosition + mousePositionDifference;
    // if (newLeft < maxLeft) {
    //   newLeft = maxLeft;
    // }
    TRACK.style.left = newLeft + 'px';
  }

  function logMouseDown(xPosition) {
    mouseStartPosition = xPosition;
    leftStartPosition = parseFloat(TRACK.style.left);
  }

  function calculateMouseDifference(endPosition) {
    return endPosition - mouseStartPosition;
  }

  function resetMousePositionDifference() {
    mousePositionDifference = 0;
  }

  function atEndOfTrack() {
    const currentLeft = getLeftPosition();
    return currentLeft <= maxLeft;
  }

  function navigateRight() {
    let targetLeft = maxLeft;
    let targetPosition = currentPosition;
    if (!atEndOfTrack()) {
      targetPosition = currentPosition + 1;
      const totalCardWidth = getTotalCardWidth();
      targetLeft = totalCardWidth * targetPosition * -1;
    }
    const newLeft = Math.max(targetLeft, maxLeft);
    navigate(newLeft, targetPosition);
    return;
  }

  function navigateLeft() {
    let targetPosition = Math.max(currentPosition - 1, 0);
    const totalCardWidth = getTotalCardWidth();
    const targetLeft = totalCardWidth * targetPosition * -1;
    const newLeft = Math.min(targetLeft, 0);
    navigate(newLeft, targetPosition);
  }

  function navigate(leftPos, targetPos) {
    addAnimationClass();
    TRACK.style.left = `${leftPos}px`;
    updateCurrentPosition(targetPos);
    checkButtonState();
  }

  function checkButtonState() {
    currentPosition === 0 ? disableNavButton(LEFT_BUTTON) : enableNavButton(LEFT_BUTTON);
    atEndOfTrack() ? disableNavButton(RIGHT_BUTTON) : enableNavButton(RIGHT_BUTTON);
  }

  function addAnimationClass() {
    TRACK.classList.add(ANIMATING_CLASS);
    TRACK.addEventListener('transitionend', removeAnimationClass);
  }

  function removeAnimationClass() {
    TRACK.classList.remove(ANIMATING_CLASS);
  }

  function calculateMaxLeftPosition() {
    maxLeft = Math.min(CARD_WINDOW.clientWidth - TRACK.clientWidth, 0);
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

  function unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e
  };

  function disableNavButton(button) {
    button.setAttribute('disabled', true);
  }

  function enableNavButton(button) {
    button.removeAttribute('disabled');
  }

};

window.addEventListener('DOMContentLoaded', initialiseUpcomingEvents);
