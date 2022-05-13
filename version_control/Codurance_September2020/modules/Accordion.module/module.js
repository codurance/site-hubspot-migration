/*if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}*/
let slideUp = (target, duration=500) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}
let slideDown = (target, duration=500) => {
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;
  if (display === 'none')
    display = 'block';
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}
var slideToggle = (target, duration = 500) => {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}
var accHD = document.getElementsByClassName("panel-title");
var accItem = document.getElementsByClassName("panel");
var i;
for (i = 0; i < accHD.length; i++) {
  accHD[i].addEventListener('click',function(){ 
    slideToggle(this.nextElementSibling, 600);
    this.parentElement.classList.toggle('open');
    this.parentElement.classList.toggle('accordion-close');
    /** Sibling Child **/
    var siblings = [].slice.call(this.parentElement.parentElement.children); 
    siblings.splice(siblings.indexOf(this.parentElement), 1);
    siblings.forEach(ele=> {
      slideUp(ele.querySelector('.panel-collapse'), 200);
      ele.classList.remove('open');
      ele.classList.add('accordion-close');
    });
  });
}



$('.panel-title').click(function(e){
  var getThis = $(this);
  var timer = setTimeout(function () {
    $('body, html').animate({
      scrollTop: getThis.offset().top
    }, 400);
    clearTimeout(timer);
  }, 600);
})


let smoothScroll = document.querySelectorAll('.panel-title');
for(var i = 0; i<smoothScroll.length; i++){
  var getThis = this;
  
  var timer = setTimeout(function () {
    $('body, html').animate({
      scrollTop: getThis.offset().top
    }, 400);
    clearTimeout(timer);
  }, 600);
}

