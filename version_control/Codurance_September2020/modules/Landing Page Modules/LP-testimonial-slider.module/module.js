

var swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
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