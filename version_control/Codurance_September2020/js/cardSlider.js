class CardSlider {
  constructor({
    activationPoint = 1023,
    navigationControl = true,
    slider = document.querySelector("[data-cardslider-window]"),
    trackSelector = "[data-cardslider-track]",
    cardsSelector = "[data-cardslider-card]",
    leftButtonSelector = "[data-cardslider-button-left]",
    rightButtonSelector = "[data-cardslider-button-right]",
    animatingClass = "animating",
    ctaContainerSelector = null
  }) {
    this.activationPoint = activationPoint;
    this.navigationControl = navigationControl;
    this.slider = slider;

    this.track = this.slider.querySelector(trackSelector);

    this.cards = Array.prototype.slice.call(
      this.slider.querySelectorAll(cardsSelector)
    );
    this.visibleCards = this.cards;
    this.cardProperties = {
      width: this.cards[0].getBoundingClientRect().width,
      margin: parseFloat(window.getComputedStyle(this.cards[0]).marginRight)
    };

    if (this.navigationControl) {
      this.leftButton = this.slider.querySelector(leftButtonSelector);
      this.rightButton = this.slider.querySelector(rightButtonSelector);
    }

    this.animatingClass = animatingClass;
    if (ctaContainerSelector) {
      this.ctaContainer = this.slider.querySelector(ctaContainerSelector);
    }

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
    window.addEventListener("resize", this.handleResize);
    this.track.addEventListener("mousedown", this.handleMouseDown);
    this.slider.addEventListener("mouseup", this.handleMouseUp);
    this.slider.addEventListener("mouseleave", this.handleMouseUp);
    this.track.addEventListener("touchstart", this.handleMouseDown);
    this.slider.addEventListener("touchend", this.handleMouseUp);
    if (this.navigationControl) {
      this.leftButton.addEventListener("click", this.navigateLeft);
      this.rightButton.addEventListener("click", this.navigateRight);
    }
  }

  sizeTrack() {
    if (this.windowIsWithinActivationPoint()) {
      if (!this.trackHasSetWidth) {
        this.updateTrackWidth();
        this.resetTrackPosition();
      }
      this.calculateMaxLeftPosition();
      this.keepTrackLeftWithinMaximum();
      if (this.navigationControl) {
        this.checkButtonState();
      }
    } else if (this.windowIsOutsideActivationPoint()) {
      if (this.trackHasSetWidth) {
        this.resetTrackWidth();
      }
      if (this.ctaContainer) {
        this.checkCtaState();
      }
    }
    return;
  }

  updateTrackWidth() {
    const trackPadding = parseFloat(
      window.getComputedStyle(this.track).paddingRight
    );
    const cardWidth = this.cardProperties.width;

    const cardMargin = this.cardProperties.margin;

    const totalWidthOfVisibleCards = cardWidth * this.visibleCards.length;

    const totalMargin = cardMargin * 2 * this.visibleCards.length;

    const totalWidthOfTrack =
      totalWidthOfVisibleCards + totalMargin + trackPadding;

    if (totalWidthOfTrack) {
      this.track.style.width = totalWidthOfTrack + "px";
      this.trackHasSetWidth = true;
    }
  }

  calculateMaxLeftPosition() {
    this.maxLeft = Math.min(
      this.slider.clientWidth - this.track.clientWidth,
      0
    );
  }

  resetTrackPosition() {
    this.currentPosition = 0;
    this.onDragStartLeftPosition = 0;
    this.track.style.left = "0px";
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
    button.setAttribute("disabled", true);
  }
  enableNavButton(button) {
    button.removeAttribute("disabled");
  }

  atEndOfTrack() {
    return this.onDragStartLeftPosition <= this.maxLeft;
  }

  getLeftPosition() {
    if (this.track.style.left) {
      return parseFloat(this.track.style.left);
    }
    return parseFloat(
      window.getComputedStyle(this.track).getPropertyValue("left")
    );
  }

  resetTrackWidth() {
    this.track.style.removeProperty("width");
    this.trackHasSetWidth = false;
  }

  checkCtaState() {
    if (this.spaceForCta()) {
      this.makeCtaContainerVisible();
    } else {
      this.hideCtaContainer();
    }
  }

  spaceForCta() {
    const cardCount = this.cards.length;
    const columns = window.innerWidth < 1300 ? 3 : 4;
    const bottomRowCount = cardCount % columns;
    return bottomRowCount > 0;
  }

  makeCtaContainerVisible() {
    this.ctaContainer.style.removeProperty("display");
  }

  hideCtaContainer() {
    this.ctaContainer.style.display = "none";
  }

  keepTrackLeftWithinMaximum() {
    const currentLeft = parseFloat(this.track.style.left);
    this.track.style.left = Math.max(currentLeft, this.maxLeft) + "px";
  }
  returnToStartPosition() {
    this.addAnimationClass();
    this.track.style.left = this.onDragStartLeftPosition + "px";
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
    window.addEventListener("touchmove", this.handleDrag);
    window.addEventListener("mousemove", this.handleDrag);
    this.logMouseDown(this.unify(e).clientX);
  }
  handleMouseUp(e) {
    window.removeEventListener("touchmove", this.handleDrag);
    window.removeEventListener("mousemove", this.handleDrag);
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
    this.track.style.left = newLeft + "px";
  }

  navigate(leftPos, targetPos) {
    this.updateCurrentPosition(targetPos);
    this.addAnimationClass();
    this.track.style.left = `${leftPos}px`;
    this.onDragStartLeftPosition = leftPos;
    if (this.navigationControl) {
      this.checkButtonState();
    }
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
    this.track.addEventListener("transitionend", () =>
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
    const innerCardWidth = this.cardProperties.width;
    const cardMarginWidth = this.cardProperties.margin;
    return innerCardWidth + cardMarginWidth * 2;
  }

  changeHeading(type) {
    Array.prototype.slice
      .call(this.slider.querySelectorAll(this.cardHeadingSelector))
      .forEach((heading) => {
        if (
          heading.dataset[
            this.convertDataAttributeToKey(this.cardHeadingSelector)
          ] === type
        ) {
          heading.classList.remove("hidden");
        } else {
          heading.classList.add("hidden");
        }
      });
  }

  updateCta(type) {
    Array.prototype.slice
      .call(this.slider.querySelectorAll(this.watchAllCtaSelector))
      .forEach((cta) => {
        if (
          cta.dataset[
            this.convertDataAttributeToKey(this.watchAllCtaSelector)
          ] === type
        ) {
          cta.classList.remove("hidden");
        } else {
          cta.classList.add("hidden");
        }
      });
  }

  updateTrack() {
    if (this.windowIsWithinActivationPoint()) {
      this.updateTrackWidth();
      this.resetTrackPosition();
      this.calculateMaxLeftPosition();
      this.keepTrackLeftWithinMaximum();
    }
  }

  convertDataAttributeToKey(attribute) {
    return attribute
      .slice(6, -1)
      .split("-")
      .map((word, index) =>
        index > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
      )
      .join("");
  }
}
