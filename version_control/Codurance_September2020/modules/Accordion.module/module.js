let accordionItems = document.querySelectorAll(".panel");
accordionItems.forEach(toggleOnClick); 

function toggleOnClick(accordionItem) { 
  const accordionItemLink = accordionItem.querySelector(".panel-title");
  accordionItemLink.addEventListener("click", toggle);
}

function toggle(clickEvent) {
  const accordionItem = clickEvent.target.closest(".panel");
  const transitionDuration = 600;

  slideUpSiblingAccordionItems(accordionItem);
  slideToggle(accordionItem, transitionDuration);
}

function slideUpSiblingAccordionItems(accordionItem) {
  slideUpPreviousSiblingAccordionItems(accordionItem);
  slideUpNextSiblingAccordionItems(accordionItem);
}

function slideUpPreviousSiblingAccordionItems(accordionItem) {
  let previousSiblingAccordionItem = accordionItem.previousElementSibling;
  const transitionDuration = 200;

  while (previousSiblingAccordionItem) {
    const previousSiblingAccordionItemBody = 
      previousSiblingAccordionItem.querySelector(".panel-body");

    slideUp(previousSiblingAccordionItemBody, transitionDuration);
    previousSiblingAccordionItem.classList.add('panel--close');

    previousSiblingAccordionItem = 
      previousSiblingAccordionItem.previousElementSibling;
  }
}

function slideUpNextSiblingAccordionItems(accordionItem) {
  let nextSiblingAccordionItem = accordionItem.nextElementSibling;
  const transitionDuration = 200;

  while (nextSiblingAccordionItem) {
    const nextSiblingAccordionItemBody = nextSiblingAccordionItem
    .querySelector(".panel-body");

    slideUp(nextSiblingAccordionItemBody, transitionDuration);
    nextSiblingAccordionItem.classList.add('panel--close');

    nextSiblingAccordionItem = nextSiblingAccordionItem.nextElementSibling;
  }
}

function slideToggle(accordionItem, transitionDuration) {
  const accordionItemBody = accordionItem.querySelector(".panel-body");

  if (accordionItem.classList.contains("panel--close")) {
    slideDown(accordionItemBody, transitionDuration);
  } else {
    slideUp(accordionItemBody, transitionDuration);
  }

  accordionItem.classList.toggle('panel--close');
}

function slideUp(accordionItemBody, transitionDuration) {
  accordionItemBody.style.transitionDuration = transitionDuration + 'ms';
  accordionItemBody.style.removeProperty('max-height');
}

function slideDown(accordionItemBody, transitionDuration) {
  accordionItemBody.style.transitionDuration = transitionDuration + 'ms';
  const accordionItemBodyHeight = accordionItemBody.scrollHeight;
  accordionItemBody.style.maxHeight = accordionItemBodyHeight + 'px';
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

