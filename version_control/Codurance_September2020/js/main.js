"use strict";

(function() {
  const announcementOnDevConsole = (_) => {
    try {
      const main = `
      display:block;
      font-family:proxima-nova,'Open Sans',Arial, sans-serif;font-size: 14px; font-style:normal; font-constiant:normal;
      font-weight: bold;height: 34px;
      line-height: 17px;
      margin-bottom: 10px; margin-top: 5px; 
      text-align:center;
      text-shadow: none;`;
      const link = "text-decoration: underline;";
      window.console.log(
        "MMMMMMMMMMMMMMMMMMMMMMMMNklxNMMMMM\n" +
          "MMMMMMMMMMWNX'OOkkkO'XWMMXo;oKWMMM\n" +
          "MMMMMMMWX'kol''''''''lx'NW'''''WMM\n" +
          "MMMMMWXko''''''''''''''lxXNx,':OWM\n" +
          "MMMWXkl'''''odxkOOOkdl'''xXK''':'W\n" +
          "MMNOo'''ldkKXWWWMMMWWXOd'l'Nd,''lK\n" +
          "WXxl''okKNNNWMMMMMMMMMWXkoONO;'',d\n" +
          "Kd''dOXNXKXNWMMMMMMMMMMMNO'W':''':\n" +
          "o'dONNXK'KNMMMMMMMMMMMMMMNNW':''',\n" +
          "oONWNX''KXWMMMMMMMMMMMMMMMMWk;''',\n" +
          "XWMWX'''KXWMMMMMMMMMMMMMMMMKl'''';\n" +
          "MMMWX''''KNMMMMMMMMMMMMMMW'l,''''l\n" +
          "MMMWXK'''KKNWMMWWWWWWWNKOo;'''''''\n" +
          "MMMMWXK''''KXNWWXOxoll';'''''':dKW\n" +
          "MMMMMWNK'''''KKXNNKOxol::::lokKWMM\n" +
          "MMMMMMMWNXK''''''KKXXXXXXXXNWMMMMM\n" +
          "MMMMMMMMMWWNXXKKKK''''KKKXXXXNNNWW\n" +
          "MMMMMMMMMMMMMMWWWNNNNNXXXXNNNNNNWW"
      );
      window.console.log(
        "\n%cWe're hiring both Academy Students and Craftspeople in London, Portugal, Barcelona, Manchester, or remote*. Want to know more? \n%chttps://codurance.com/careers/\n* In Austria, Belgium, Canada, Croatia, Czech Republic, France, Germany, Greece, Ireland, Italy, Netherlands, Poland, Portugal, Romania, Slovakia, South Africa, Spain, UK.",
        main,
        link
      );
    } catch (_) {}
  };
  announcementOnDevConsole();
})();

/* ----------------------------- Menus ---------------------------------- */

const websiteNavigation = function() {
  const MOBILE_SCREEN_SIZE = 1023;

  const OPEN_MENU_CLASS = "website-navigation__menu--open";
  const OPEN_SUB_MENU_CLASS = "website-navigation-sub-menu--open";
  const OPEN_HEADER_CLASS = "website-header--open";
  const HEADER_REVEALED_CLASS = "website-header--revealed";
  const HEADER_HAS_OPEN_SUBMENU_CLASS = "website-header--has-open-submenu";
  const MENU_SHOWING_SUB_MENU_CLASS =
    "website-navigation__menu--showing-sub-menu";

  const header = window.document.querySelector("header.header");
  const mobileMenuToggle = window.document.querySelector(".mobile-trigger");
  const menu = window.document.querySelector(
    "#" + mobileMenuToggle.getAttribute("aria-controls")
  );

  const subMenuToggles = document.querySelectorAll(".has-submenu");
  const menuLinks = document.querySelectorAll(".menu-item > .menu-link");

  let currentOpenSubMenu = null;

  setUpEventListeners();

  function setUpEventListeners() {
    screen.width <= MOBILE_SCREEN_SIZE
      ? setUpMobileEventListeners()
      : setUpDesktopEventListeners();
  }

  function setUpMobileEventListeners() {
    window.addEventListener("click", handleWindowClick);
    mobileMenuToggle.addEventListener("click", toggleMenu);

    Array.prototype.forEach.call(subMenuToggles, function(t) {
      t.addEventListener("click", toggleSubMenu);
    });

    const languageSelector = document.querySelector(
      ".language-selector__button"
    );

    languageSelector.addEventListener("click", () =>
      toggleAriaExpanded(languageSelector)
    );
  }

  function setUpDesktopEventListeners() {
    menuLinks.forEach((link) => {
      link.addEventListener("focus", function() {
        resetFocus();
        link.parentElement.classList.add("focus");
      });
    });

    subMenuToggles.forEach((toggle) => {
      const toggleLink = toggle.querySelector(".menu-link");

      toggle.addEventListener("mouseover", () => {
        toggleAriaExpanded(toggleLink);
      });

      toggle.addEventListener("mouseout", () => {
        toggleAriaExpanded(toggleLink);
      });

      toggleLink.addEventListener("focus", () => {
        toggleAriaExpanded(toggleLink);
      });
    });

    const langDropdown = document.querySelectorAll(
      ".language-selector__dropdown a"
    );
    const lastChild = langDropdown.length - 1;

    langDropdown[lastChild].addEventListener("blur", () => {
      resetFocus();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") resetFocus();
    });
  }

  function handleWindowClick(e) {
    if (header.contains(e.target) || !currentOpenSubMenu) return;

    closeSubMenu(currentOpenSubMenu.menu, currentOpenSubMenu.toggle);
  }

  function toggleMenu() {
    menu.classList.contains(OPEN_MENU_CLASS) ? closeMenu() : openMenu();
  }

  function toggleSubMenu(e) {
    if (!e.target.classList.contains("trigger")) return;

    let subMenuToggle = e.target;
    let subMenu = getSubMenu(subMenuToggle);

    if (currentOpenSubMenu === null) {
      openSubMenu(subMenu, subMenuToggle);
      return;
    }

    if (targetIsCurrentlyOpen(subMenu)) {
      closeSubMenu(subMenu, subMenuToggle);
      return;
    }

    if (!targetIsCurrentlyOpen(subMenu)) {
      let currentlyOpenSubMenu = currentOpenSubMenu.menu;
      let currentlyOpenSubMenuToggle = currentOpenSubMenu.toggle;

      closeSubMenu(currentlyOpenSubMenu, currentlyOpenSubMenuToggle);
      openSubMenu(subMenu, subMenuToggle);
      return;
    }
  }

  function targetIsCurrentlyOpen(subMenu) {
    return currentOpenSubMenu.menu === subMenu;
  }

  function openMenu() {
    header.classList.add(OPEN_HEADER_CLASS, HEADER_REVEALED_CLASS);
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    menu.classList.add(OPEN_MENU_CLASS);

    if (currentOpenSubMenu) {
      closeSubMenu(currentOpenSubMenu.menu, currentOpenSubMenu.toggle);
    }
  }

  function closeMenu() {
    header.classList.remove(OPEN_HEADER_CLASS);
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    menu.classList.remove(OPEN_MENU_CLASS);
  }

  function openSubMenu(subMenu, subMenuToggle) {
    currentOpenSubMenu = { menu: subMenu, toggle: subMenuToggle };

    header.classList.add(HEADER_HAS_OPEN_SUBMENU_CLASS);
    subMenuToggle.setAttribute("aria-expanded", "true");
    subMenu.classList.add(OPEN_SUB_MENU_CLASS);
    menu.classList.add(MENU_SHOWING_SUB_MENU_CLASS);
  }

  function closeSubMenu(subMenu, subMenuToggle) {
    currentOpenSubMenu = null;

    header.classList.remove(HEADER_HAS_OPEN_SUBMENU_CLASS);
    subMenuToggle.setAttribute("aria-expanded", "false");
    subMenu.classList.remove(OPEN_SUB_MENU_CLASS);
    menu.classList.remove(MENU_SHOWING_SUB_MENU_CLASS);
  }

  function getSubMenu(subMenuToggle) {
    return window.document.getElementById(
      subMenuToggle.getAttribute("aria-controls")
    );
  }

  function resetFocus() {
    const focusedMenuItems = document.querySelectorAll(".menu-item.focus");
    focusedMenuItems.forEach((menuItem) => {
      const menuItemLink = menuItem.querySelector(".menu-link");

      menuItem.classList.remove("focus");
      menuItemLink.setAttribute("aria-expanded", "false");
    });
  }

  function toggleAriaExpanded(menuLink) {
    let ariaExpanded = menuLink.getAttribute("aria-expanded");

    if (ariaExpanded == "false") {
      menuLink.setAttribute("aria-expanded", "true");
    } else {
      menuLink.setAttribute("aria-expanded", "false");
    }
  }
};

window.addEventListener("DOMContentLoaded", websiteNavigation);
