  let modalBackground = document.querySelector('[data-exit-popup-modal]');

  let closeButton = document.querySelector('[data-exit-popup-close-button]');

  closeButton.onclick = _ => {
    modalBackground.classList.add('hidden');
  }

  window.onclick = event => {
    if (event.target == modalBackground) {
      modalBackground.classList.add('hidden');
    }
  }

document.addEventListener("mouseout", evt => {
  if (evt.clientY < 10) {
    modalBackground.classList.remove('hidden');
  }
});