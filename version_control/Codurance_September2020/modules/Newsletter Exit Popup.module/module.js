let modalBackground = document.querySelector('[data-exit-popup-modal]');
let closeButton = document.querySelector('[data-exit-popup-close-button]');

const closeModal = _ => {
  modalBackground.classList.add('hidden');
}


const checkClosingModal = e => {
  if (e.target == modalBackground) {
    closeModal()
  }
}


const showModal = _ => {
  modalBackground.classList.remove('hidden');
  document.removeEventListener('mouseout', showModal);
}

const potentiallyLeavingPage = e => {
  return e.clientY < 10;
}

const checkExit = e => {
  if (potentiallyLeavingPage(e)) {
    showModal();
  }
}

const addPopupEventListeners = _ => {
  closeButton.addEventListener('click', closeModal);
  document.addEventListener('click', checkClosingModal);
  document.addEventListener('mouseout', checkExit);
}

const showSuccessfulFormHTML = _ => {
  Array.prototype.slice.call(
      document.querySelectorAll("[data-exit-popup-pending]")
  ).forEach(element => {
      element.classList.add('hidden');
  });
  
  Array.prototype.slice.call(
      document.querySelectorAll("[data-exit-popup-success]")
  ).forEach(element => {
      element.classList.remove('hidden');
  })
}

const detectFormSubmission = _ => {
  let form = document.querySelector(".newsletter-exit-popup__container form")

  const observer = new MutationObserver(function(mutations_list) {
      mutations_list.forEach(function(mutation) {
          mutation.removedNodes.forEach(function(removed_node) {
              if (removed_node === form) {
                  showSuccessfulFormHTML()
              }
          });
      });
  });
  
  observer.observe(document.querySelector("#hs_form_target_newsletter_exit_popup_email_form"), { subtree: false, childList: true });
}

window.addEventListener('load', e => {
  addPopupEventListeners();
  detectFormSubmission();
});