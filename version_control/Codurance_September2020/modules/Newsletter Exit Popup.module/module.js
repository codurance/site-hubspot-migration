 // Get the modal
  let modal = document.querySelector('[data-newsletter-exit-popup-modal]');

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

document.addEventListener("mouseout", evt => {
    if (evt.clientY < 10) modal.style.display = "block";
});