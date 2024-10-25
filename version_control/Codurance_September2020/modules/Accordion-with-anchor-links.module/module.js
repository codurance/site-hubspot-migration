'use strict';

document.addEventListener('DOMContentLoaded', function() {

  try {
    initAccordion();
    window.addEventListener('hashchange', openAccordionFromHash);
  } catch (error) {
    console.error('Error initialising accordion:', error);
  }

  function initAccordion() {
    const accordionGroup = document.querySelector('.panel-group');
    if (accordionGroup) {
      accordionGroup.addEventListener('click', handleAccordionToggle);
    } else {
      console.error('Accordion group not found');
    }

    openAccordionFromHash();
  }

  function handleAccordionToggle(event) {
    const panelTitle = event.target.closest('.panel-title');
    if (panelTitle) {
      const panel = panelTitle.closest('.panel');
      if (panel) {
        const isClosed = panel.classList.contains('panel--close');

        closeAllPanels();

        if (isClosed) {
          openPanel(panel);
          addAnchorToUrl(panel);
        } else {
          // Si estaba abierto, lo dejamos cerrado y limpiamos el hash de la URL
          history.pushState(null, null, window.location.pathname);
        }
      }
    }
  }

  function closeAllPanels() {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      panel.classList.add('panel--close');
      const panelTitle = panel.querySelector('.panel-title');
      panelTitle.setAttribute('aria-expanded', 'false');
      const panelBody = panel.querySelector('.panel-body');
      panelBody.style.display = 'none';
      panelBody.style.maxHeight = '0';
    });
  }

  function openPanel(panel) {
    panel.classList.remove('panel--close');
    const panelTitle = panel.querySelector('.panel-title');
    panelTitle.setAttribute('aria-expanded', 'true');
    const panelBody = panel.querySelector('.panel-body');
    panelBody.style.display = 'block';
    // Usar setTimeout para asegurar que la transición se aplique después de que el display cambie a 'block'
    setTimeout(() => {
      panelBody.style.maxHeight = panelBody.scrollHeight + 'px';
    }, 0);
  }

  function addAnchorToUrl(panel) {
    const itemId = panel.id.replace("accordion-item-", "");
    setTimeout(() => {
      scrollToElement(panel);
    }, 0);
    history.pushState(null, null, "#" + encodeURIComponent(itemId));
  }

  function openAccordionFromHash() {
    closeAllPanels();
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
      const targetAccordion = document.getElementById('accordion-item-' + hash);
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