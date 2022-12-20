/* ------------------------------ Smooth Scrolling Script ---------------------------------- */

let smoothScroll = document.querySelectorAll("a");
for (var i = 0; i < smoothScroll.length; i++) {
  let hashl = smoothScroll[i].hash;
  if (hashl != "") {
    smoothScroll[i].addEventListener("click", function (e) {
      let hashId = document.querySelector(hashl);
      if (hashId != null) {
        e.preventDefault();
        window.scroll({
          behavior: "smooth",
          left: 0,
          top: hashId.offsetTop - 100
        });
      }
    });
  }
}
