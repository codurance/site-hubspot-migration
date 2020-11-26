;(function() {
  const track = window.document.querySelector('[data-card-track]');
  const cards = Array.from(window.document.querySelectorAll('[data-card]'));

  const trackPadding = parseFloat(window.getComputedStyle(track).paddingRight);

  const cardWidth = cards[0].getBoundingClientRect().width;
  const cardMargin = parseFloat(window.getComputedStyle(cards[0]).marginRight);

  const totalWidthOfCards = cardWidth * cards.length;
  const totalMargin = (cardMargin * 2) * cards.length;

  const totalWidthOfTrack = totalWidthOfCards + totalMargin + trackPadding;

  console.log(`totalWidthOfTrack: `, totalWidthOfTrack);


  track.style.width =  totalWidthOfTrack + "px";

})();
