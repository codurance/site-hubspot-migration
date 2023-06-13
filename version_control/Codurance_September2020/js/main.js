(function() {
  const HIDE_FOCUS_STYLES_CLASS = "disable-focus-styles";
  const SHOW_FOCUS_STYLES_CLASS = "enable-focus-styles";

  function domReady(callback) {
    if (["interactive", "complete"].indexOf(document.readyState) >= 0) {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  function showFocusOutline() {
    document.body.classList.add(SHOW_FOCUS_STYLES_CLASS);
    document.body.classList.remove(HIDE_FOCUS_STYLES_CLASS);
  }

  function hideFocusOutline() {
    document.body.classList.add(HIDE_FOCUS_STYLES_CLASS);
    document.body.classList.remove(SHOW_FOCUS_STYLES_CLASS);
  }

  $(".active-branch").each(function() {
    $(this)
      .parent("li")
      .addClass("active-branch");
  });

  domReady(function() {
    if (!document.body) {
      return;
    } else {
      // Show the focus outline when keyboard activity occurs
      document.body.addEventListener("keydown", showFocusOutline);

      // Hide the focus outline when mouse activity occurs
      document.body.addEventListener("mousemove", hideFocusOutline);
      document.body.addEventListener("mousedown", hideFocusOutline);
      document.body.addEventListener("mouseup", hideFocusOutline);

      var ost = 0;
      $(window).scroll(function() {
        var cOst = $(this).scrollTop();
        if (cOst > 200 && cOst > ost) {
          $("header.header")
            .addClass("fixed")
            .removeClass("default");
        } else {
          $("header.header")
            .addClass("default")
            .removeClass("fixed");
        }
        ost = cOst;
      });
    }
  });

  $('input[name="globalunsub"]').change(function() {
    if ($(this).is(":checked")) {
      $(".item").addClass("disabled");
      $(".item input").attr("disabled", "disabled");
    } else {
      $(".item").removeClass("disabled");
      $(".item input").removeAttr("disabled");
    }
  });
  $(function() {
    var value1 = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    $('[data-target="blog-index-filter-link"]').each(function() {
      var url = $(this).attr("href");
      var lastSegment = url.split("/").pop();
      if (lastSegment == value1) {
        $(this)
          .parent()
          .siblings()
          .removeClass("active");
        $(this).addClass("active");
      }
    });
  });

  var announcementOnDevConsole = function() {
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
  const OPEN_MENU_CLASS = "website-navigation__menu--open";
  const OPEN_SUB_MENU_CLASS = "website-navigation-sub-menu--open";
  const OPEN_HEADER_CLASS = "website-header--open";
  const HEADER_REVEALED_CLASS = "website-header--revealed";
  const HEADER_HAS_OPEN_SUBMENU_CLASS = "website-header--has-open-submenu";
  const MENU_SHOWING_SUB_MENU_CLASS =
    "website-navigation__menu--showing-sub-menu";

  const header = window.document.querySelector("header.header");
  const mobileMenuToggle = window.document.querySelector(".mobile-trigger");
  if (mobileMenuToggle) {
    const menu = window.document.querySelector(
      "#" + mobileMenuToggle.getAttribute("aria-controls")
    );

    const subMenuToggles = menu.querySelectorAll(".has-submenu");

    let currentOpenSubMenu = null;

    function setupEventListeners() {
      window.addEventListener("click", handleWindowClick);
      if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", toggleMenu);
      }
      Array.prototype.forEach.call(subMenuToggles, function(t) {
        t.addEventListener("click", toggleSubMenu);
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

    function exposeSharedMethods() {
      window.__CODURANCE = window.__CODURANCE || {};
      window.__CODURANCE.websiteNavigation = {
        closeOpenSubMenu: function() {
          if (currentOpenSubMenu === null) return;
          closeSubMenu(currentOpenSubMenu.menu, currentOpenSubMenu.toggle);
        }
      };
    }

    setupEventListeners();
    exposeSharedMethods();
  }
};

window.addEventListener("DOMContentLoaded", websiteNavigation);

function ea_scroll(hash) {
  var target = $(hash);
  target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
  if (target.length) {
    $("html,body").animate(
      {
        scrollTop: target.offset().top
      },
      1000
    );
    return false;
  }
}

if (window.location.hash) {
  ea_scroll(window.location.hash);
}

// --------------------------------- //

const menuLinks = document.querySelectorAll(".menu-item > .menu-link");

menuLinks.forEach((link) => {
  link.addEventListener("focus", function() {
    resetFocus();
    link.parentElement.classList.add("focus");
  });
});

const langDropdown = document.querySelectorAll(
  ".language-selector__dropdown a"
);
const lastChild = langDropdown.length - 1;

langDropdown[lastChild].addEventListener("blur", () => {
  resetFocus();
});

function resetFocus() {
  const focusedMenuLinks = document.querySelectorAll(".menu-item.focus");
  focusedMenuLinks.forEach((link) => link.classList.remove("focus"));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") resetFocus();
});
