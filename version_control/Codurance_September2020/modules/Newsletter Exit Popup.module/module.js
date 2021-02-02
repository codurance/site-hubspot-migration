// let modalBackground = document.querySelector('[data-exit-popup-modal]');
// let closeButton = document.querySelector('[data-exit-popup-close-button]');
// let poppedUp = false;

// closeButton.addEventListener('click', _ => {
//   modalBackground.classList.add('hidden');
// });

// document.addEventListener('click', e => {
//   if (e.target == modalBackground) {
//     modalBackground.classList.add('hidden');
//   }
// });

// document.addEventListener("mouseout", e => {
//   if (e.clientY < 10 && !poppedUp) {
//     modalBackground.classList.remove('hidden');
//     poppedUp = true;
//   }
// });