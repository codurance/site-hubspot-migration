const accordionItems = document.querySelectorAll(".panel");
accordionItems.forEach(toggleOnClick);

function toggleOnClick(accordionItem) {
  const accordionItemLink = accordionItem.querySelector(".panel-title");
  accordionItemLink.addEventListener("click", toggle);
}

function toggle(clickEvent) {
  const accordionItem = clickEvent.target.closest(".panel");
  const transitionDuration = 300;

  slideUpSiblingAccordionItems(accordionItem);
  slideToggle(accordionItem, transitionDuration);
}

function slideUpSiblingAccordionItems(accordionItem) {
  const firstAccordionItem = accordionItem.parentElement.firstElementChild;
  const transitionDuration = 200;

  let currentAccordionItem = firstAccordionItem;

  while (currentAccordionItem) {
    if (currentAccordionItem != accordionItem) {
      const currentAccordionItemBody =
        currentAccordionItem.querySelector(".panel-body");

      slideUp(currentAccordionItemBody, transitionDuration);
      currentAccordionItem.classList.add("panel--close");
    }

    currentAccordionItem = currentAccordionItem.nextElementSibling;
  }
}

function slideToggle(accordionItem, transitionDuration) {
  const accordionItemBody = accordionItem.querySelector(".panel-body");

  if (accordionItem.classList.contains("panel--close")) {
    slideDown(accordionItemBody, transitionDuration);
  } else {
    slideUp(accordionItemBody, transitionDuration);
  }

  accordionItem.classList.toggle("panel--close");
}

function slideUp(accordionItemBody, transitionDuration) {
  accordionItemBody.style.transitionDuration = transitionDuration + "ms";
  accordionItemBody.style.removeProperty("max-height");
}

function slideDown(accordionItemBody, transitionDuration) {
  accordionItemBody.style.transitionDuration = transitionDuration + "ms";
  const accordionItemBodyHeight = accordionItemBody.scrollHeight;
  accordionItemBody.style.maxHeight = accordionItemBodyHeight + "px";
}
