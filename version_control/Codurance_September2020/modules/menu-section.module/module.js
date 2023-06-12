const menuLinks = document.querySelectorAll(".menu-item > .menu-link");

menuLinks.forEach((link) => {
  link.addEventListener("focus", function() {
    resetFocus();
    link.parentElement.classList.add("focus");
  });
});

function resetFocus() {
  const focusedMenuLinks = document.querySelectorAll(".menu-item.focus");
  focusedMenuLinks.forEach((link) => link.classList.remove("focus"));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") resetFocus();
});
