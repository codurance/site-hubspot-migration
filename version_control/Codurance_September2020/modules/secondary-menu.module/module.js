let previousViewpoint = 0;
const secondaryMenu = document.querySelector(".secondary-menu");
const navigationHeight = secondaryMenu.offsetHeight;
const mainMenuHeight = document.querySelector(".header").offsetHeight;

document.documentElement.style.setProperty(
  "--scroll-padding",
  navigationHeight + mainMenuHeight + "px"
);

window.addEventListener("scroll", () => {
  let currentViewpoint = window.scrollY;

  if (currentViewpoint > previousViewpoint) {
    fixMenu(secondaryMenu);
  } else {
    dropMenu(secondaryMenu);
  }

  previousViewpoint = currentViewpoint;
});

function fixMenu(menu) {
  menu.classList.add("secondary-menu--fixed");
}

function dropMenu(menu) {
  menu.classList.remove("secondary-menu--fixed");
}
