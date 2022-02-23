let swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  watchOverflow: true,
  grabCursor: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  keyboard: {
    enabled: true,
  },
});

/* Check the number of slides on the swiper slider and
disable it if there's just a single one (in that case,
the length would be 3 due to the loop property) */
if(swiper.slides.length == 3) {
  swiper.destroy();
}


