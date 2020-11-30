$('.cm-training-card-group.mobile-slider').slick({
  dots: true,
  infinite: true,
  speed: 300,
  adaptiveHeight:false,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {  
        adaptiveHeight:false,
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 767,
      settings: {
        adaptiveHeight:false,
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 479,
      settings: {
        adaptiveHeight:false,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
     {
      breakpoint: 320,
      settings: {
        adaptiveHeight:false,
        slidesToShow: 1,
        slidesToScroll: 1
      }
     },
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
  });();