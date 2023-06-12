let menuLinks = document.querySelectorAll(".menu-link");
let firstSubmenuItems = document.querySelectorAll(
  ".submenu.level-2 > *:nth-child(2)"
);

menuLinks.forEach((link) => {
  link.addEventListener("focus", function() {
    link.parentElement.classList.add("focus");
  });

  if (link.nextElementSibling) {
    console.log(link.nextElementSibling);
    const submenu = link.nextElementSibling;
    const subMenuLinks = submenu.querySelectorAll(".submenu-item");
    const lastLinkIndex = subMenuLinks.length - 1;
    const lastLink = subMenuLinks[lastLinkIndex];

    lastLink.addEventListener("blur", function() {
      lastLink.closest(".menu-item").classList.remove("focus");
      // link.parentElement.classList.remove("focus");
    });
  }
});

// firstSubmenuItems.forEach(function(item) {
//   if (window.hsInEditor) {
//     return;
//   } else if (item) {
//     item.addEventListener("mouseover", function() {
//       item.previousElementSibling.classList.add("hover");
//     });

//     item.addEventListener("mouseout", function() {
//       item.previousElementSibling.classList.remove("hover");
//     });
//   }
// });
