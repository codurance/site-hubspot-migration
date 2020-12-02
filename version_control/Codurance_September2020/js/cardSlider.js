class CardSlider {
  constructor({
    activationPoint = 1023,
    cardWindowSelector = '[data-cardslider-window]',
    trackSelector = '[data-cardslider-track]',
    cardsSelector = '[data-cardslider-card]',
    leftButtonSelector = '[data-cardslider-button-left]',
    rightButtonSelector = '[data-cardslider-button-right]',
    animatingClass = 'animating',
  }) {
    this.activationPoint = activationPoint;
    this.cardWindow = document.querySelector(cardWindowSelector);
    this.track = document.querySelector(trackSelector);
    this.cards = Array.prototype.slice.call(
      document.querySelectorAll(cardsSelector)
    );
    this.leftButton = document.querySelector(leftButtonSelector);
    this.rightButton = document.querySelector(rightButtonSelector);
    this.animatingClass = animatingClass;

    this.trackHasSetWidth = false;
    this.maxLeft = 0;
    this.currentPosition = 0;
    this.ticking = false;
    this.mouseStartPosition = 0;
    this.onDragStartLeftPosition = 0;
    this.mousePositionDifference = 0;
    this.minSwipeThreshold = 50;

    this.init = this.init.bind(this);
  }

  init() {
    this.sizeTrack();
    this.createEventListeners();
  }

  windowIsWithinActivationPoint() {
    return window.innerWidth <= this.activationPoint;
  }
  windowIsOutsideActivationPoint() {
    return window.innerWidth > this.activationPoint;
  }

  createEventListeners() {
    this.bindEventListeners();
    this.setUpEventListeners();
  }

  bindEventListeners() {
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.navigateLeft = this.navigateLeft.bind(this);
    this.navigateRight = this.navigateRight.bind(this);
  }

  setUpEventListeners() {
    window.addEventListener('resize', this.handleResize);
    this.cardWindow.addEventListener('mousedown', this.handleMouseDown);
    this.cardWindow.addEventListener('mouseup', this.handleMouseUp);
    this.cardWindow.addEventListener('mouseleave', this.handleMouseUp);
    this.cardWindow.addEventListener('touchstart', this.handleMouseDown);
    this.cardWindow.addEventListener('touchend', this.handleMouseUp);
    this.leftButton.addEventListener('click', this.navigateLeft);
    this.rightButton.addEventListener('click', this.navigateRight);
  }

  sizeTrack() {
    if (this.windowIsWithinActivationPoint()) {
      if (!this.trackHasSetWidth) {
        this.addTrackWidth();
        this.resetTrackPosition();
      }
      this.calculateMaxLeftPosition();
      this.keepTrackLeftWithinMaximum();
      this.checkButtonState();
    } else if (this.windowIsOutsideActivationPoint() && this.trackHasSetWidth) {
      this.resetTrackWidth();
    }
    return;
  }

  addTrackWidth() {
    const trackPadding = parseFloat(
      window.getComputedStyle(this.track).paddingRight
    );
    const cardWidth = this.cards[0].getBoundingClientRect().width;
    const cardMargin = parseFloat(
      window.getComputedStyle(this.cards[0]).marginRight
    );

    const totalWidthOfCards = cardWidth * this.cards.length;
    const totalMargin = cardMargin * 2 * this.cards.length;

    const totalWidthOfTrack = totalWidthOfCards + totalMargin + trackPadding;

    if (totalWidthOfTrack) {
      this.track.style.width = totalWidthOfTrack + 'px';
      this.trackHasSetWidth = true;
    }
  }

  calculateMaxLeftPosition() {
    this.maxLeft = Math.min(
      this.cardWindow.clientWidth - this.track.clientWidth,
      0
    );
  }

  resetTrackPosition() {
    this.currentPosition = 0;
    this.onDragStartLeftPosition = 0;
    this.track.style.left = '0px';
  }

  checkButtonState() {
    this.currentPosition === 0
      ? this.disableNavButton(this.leftButton)
      : this.enableNavButton(this.leftButton);
    this.atEndOfTrack()
      ? this.disableNavButton(this.rightButton)
      : this.enableNavButton(this.rightButton);
  }

  disableNavButton(button) {
    button.setAttribute('disabled', true);
  }
  enableNavButton(button) {
    button.removeAttribute('disabled');
  }

  atEndOfTrack() {
    return this.onDragStartLeftPosition <= this.maxLeft;
  }

  getLeftPosition() {
    if (this.track.style.left) {
      return parseFloat(this.track.style.left);
    }
    return parseFloat(
      window.getComputedStyle(this.track).getPropertyValue('left')
    );
  }

  resetTrackWidth() {
    this.track.style.removeProperty('width');
    this.trackHasSetWidth = false;
  }

  keepTrackLeftWithinMaximum() {
    const currentLeft = parseFloat(this.track.style.left);
    this.track.style.left = Math.max(currentLeft, this.maxLeft) + 'px';
  }
  returnToStartPosition() {
    this.addAnimationClass();
    this.track.style.left = this.onDragStartLeftPosition + 'px';
  }

  handleResize() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.sizeTrack();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  handleMouseDown(e) {
    window.addEventListener('touchmove', this.handleDrag);
    window.addEventListener('mousemove', this.handleDrag);
    this.logMouseDown(this.unify(e).clientX);
  }
  handleMouseUp(e) {
    window.removeEventListener('touchmove', this.handleDrag);
    window.removeEventListener('mousemove', this.handleDrag);
    if (this.mousePositionDifference >= this.minSwipeThreshold) {
      this.navigateLeft();
    } else if (this.mousePositionDifference <= -this.minSwipeThreshold) {
      this.navigateRight();
    } else {
      this.returnToStartPosition();
    }
    this.resetMousePositionDifference();
  }
  handleDrag(e) {
    this.mousePositionDifference = this.calculateMouseDifference(
      this.unify(e).clientX
    );
    let newLeft = this.onDragStartLeftPosition + this.mousePositionDifference;
    this.track.style.left = newLeft + 'px';
  }

  navigate(leftPos, targetPos) {
    this.updateCurrentPosition(targetPos);
    this.addAnimationClass();
    this.track.style.left = `${leftPos}px`;
    this.onDragStartLeftPosition = leftPos;
    this.checkButtonState();
  }
  navigateLeft() {
    let targetPosition = Math.max(this.currentPosition - 1, 0);
    const totalCardWidth = this.getTotalCardWidth();
    const targetLeft = totalCardWidth * targetPosition * -1;
    const newLeft = Math.min(targetLeft, 0);
    this.navigate(newLeft, targetPosition);
  }
  navigateRight() {
    let targetLeft = this.maxLeft;
    let targetPosition = this.currentPosition;
    if (!this.atEndOfTrack()) {
      targetPosition = this.currentPosition + 1;
      const totalCardWidth = this.getTotalCardWidth();
      targetLeft = totalCardWidth * targetPosition * -1;
    }
    const newLeft = Math.max(targetLeft, this.maxLeft);
    this.navigate(newLeft, targetPosition);
  }

  logMouseDown(xPosition) {
    this.mouseStartPosition = xPosition;
  }

  unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  addAnimationClass() {
    this.track.classList.add(this.animatingClass);
    this.track.addEventListener('transitionend', () =>
      this.removeAnimationClass()
    );
  }

  removeAnimationClass() {
    this.track.classList.remove(this.animatingClass);
  }

  resetMousePositionDifference() {
    this.mousePositionDifference = 0;
  }

  calculateMouseDifference(endPosition) {
    return endPosition - this.mouseStartPosition;
  }

  updateCurrentPosition(position) {
    this.currentPosition = position;
  }

  getTotalCardWidth() {
    const innerCardWidth = this.cards[0].getBoundingClientRect().width;
    const cardMarginWidth = parseFloat(
      window.getComputedStyle(this.cards[0]).marginRight
    );
    return innerCardWidth + cardMarginWidth * 2;
  }
}
