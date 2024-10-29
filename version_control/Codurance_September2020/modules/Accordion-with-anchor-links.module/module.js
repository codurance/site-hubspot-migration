'use strict';

document.addEventListener('DOMContentLoaded', function() {

  try {
    initAccordion();
    window.addEventListener('hashchange', openAccordionFromHash);
  } catch (error) {
    console.error('Error initialising accordion:', error);
  }

  function initAccordion() {
    const accordionGroup = document.querySelector('.custom-panel-group');
    if (accordionGroup) {
      accordionGroup.addEventListener('click', handleAccordionToggle);
    } else {
      console.error('Custom accordion group not found');
    }

    openAccordionFromHash();
  }

  function handleAccordionToggle(event) {
    const panelTitle = event.target.closest('.custom-panel-title');
    if (panelTitle) {
      const panel = panelTitle.closest('.custom-panel');
      if (panel) {
        const isClosed = panel.classList.contains('custom-panel--close');

        closeAllPanels();

        if (isClosed) {
          openPanel(panel);
          addAnchorToUrl(panel);
        } else {
          //if the panel was open, closeAllPanels() has already closed it and only the url hashtag needs to be removed
          history.pushState(null, null, window.location.pathname);
        }
      }
    }
  }

  function closeAllPanels() {
    const panels = document.querySelectorAll('.custom-panel');
    panels.forEach(panel => {
      panel.classList.add('custom-panel--close');
      const panelTitle = panel.querySelector('.custom-panel-title');
      panelTitle.setAttribute('aria-expanded', 'false');
      const panelBody = panel.querySelector('.custom-panel-body');
      panelBody.style.display = 'none';
      panelBody.style.maxHeight = '0';
    });
  }

  function openPanel(panel) {
    panel.classList.remove('custom-panel--close');
    const panelTitle = panel.querySelector('.custom-panel-title');
    panelTitle.setAttribute('aria-expanded', 'true');
    const panelBody = panel.querySelector('.custom-panel-body');
    panelBody.style.display = 'block';
    //Using setTimeout to be sure that transition happens after the display value is set to 'block'
    setTimeout(() => {
      panelBody.style.maxHeight = panelBody.scrollHeight + 'px';
    }, 0);
  }

  function addAnchorToUrl(panel) {
    const itemId = panel.id.replace("custom-accordion-item-", "");
    setTimeout(() => {
      scrollToElement(panel);
    }, 0);
    history.pushState(null, null, "#" + encodeURIComponent(itemId));
  }

  function openAccordionFromHash() {
    closeAllPanels();
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
      const targetAccordion = document.getElementById('custom-accordion-item-' + hash);
      if (targetAccordion) {
        openPanel(targetAccordion);
        setTimeout(() => {
          scrollToElement(targetAccordion);
        }, 0);
      }
    }
  }

  function scrollToElement(element) {
    const SCROLL_OFFSET = 90;
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

});