(function () {
  var HIDE_FOCUS_STYLES_CLASS = "disable-focus-styles";
  var SHOW_FOCUS_STYLES_CLASS = "enable-focus-styles";

  var firstLanguageSwitcherItem = document.querySelector(
    ".header__language-switcher .lang_list_class li:first-child"
  );
  var languageSwitcherList = document.querySelector(
    ".header__language-switcher .lang_list_class"
  );

  var Nav = document.querySelector(".header__navigation");
  var LangSwitcher = document.querySelector(".header__language-switcher");
  var Search = document.querySelector(".header__search");

  var allToggles = document.querySelectorAll(".header--toggle");
  var navToggle = document.querySelector(".header__navigation--toggle");
  var langToggle = document.querySelector(".header__language-switcher--toggle");
  var searchToggle = document.querySelector(".header__search--toggle");
  var closeToggle = document.querySelector(".header__close--toggle");

  var allElements = document.querySelectorAll(
    ".header--element, .header--toggle"
  );

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

  // adds hover effects to the pseduoelement triangle on the menu
  // for design continutity
  function hoverLanguageSwitcher() {
    languageSwitcherList.classList.add("first-active");
  }

  function unhoverLanguageSwitcher() {
    languageSwitcherList.classList.remove("first-active");
  }

  function toggleNav() {
    allToggles.forEach(function (toggle) {
      toggle.classList.toggle("hide");
    });

    Nav.classList.toggle("open");
    navToggle.classList.toggle("open");

    closeToggle.classList.toggle("show");
  }

  function toggleLang() {
    allToggles.forEach(function (toggle) {
      toggle.classList.toggle("hide");
    });

    LangSwitcher.classList.toggle("open");
    langToggle.classList.toggle("open");

    closeToggle.classList.toggle("show");
  }

  function toggleSearch() {
    allToggles.forEach(function (toggle) {
      toggle.classList.toggle("hide");
    });

    Search.classList.toggle("open");
    searchToggle.classList.toggle("open");

    closeToggle.classList.toggle("show");
  }

  function closeAll() {
    allElements.forEach(function (element) {
      element.classList.remove("hide", "open");
    });

    closeToggle.classList.remove("show");
  }

  $(".active-branch").each(function () {
    $(this).parent("li").addClass("active-branch");
  });

  domReady(function () {
    if (!document.body) {
      return;
    } else {
      // Show the focus outline when keyboard activity occurs
      document.body.addEventListener("keydown", showFocusOutline);

      // Hide the focus outline when mouse activity occurs
      document.body.addEventListener("mousemove", hideFocusOutline);
      document.body.addEventListener("mousedown", hideFocusOutline);
      document.body.addEventListener("mouseup", hideFocusOutline);

      // function dependent on the language switcher component
      if (LangSwitcher) {
        // Adds a hover style class to the parent element when the cursor hovers
        // over the first child item
        firstLanguageSwitcherItem.addEventListener(
          "mouseover",
          hoverLanguageSwitcher
        );
        firstLanguageSwitcherItem.addEventListener(
          "mouseout",
          unhoverLanguageSwitcher
        );

        // Toggles the language switcher
        langToggle.addEventListener("click", toggleLang);
      }

      // Toggles the mobile views for menu, search, and close button
      if (navToggle) {
        navToggle.addEventListener("click", toggleNav);
      }
      if (searchToggle) {
        searchToggle.addEventListener("click", toggleSearch);
      }
      if (closeToggle) {
        closeToggle.addEventListener("click", closeAll);
      }
      var ost = 0;
      $(window).scroll(function () {
        var cOst = $(this).scrollTop();
        if (cOst > 200 && cOst > ost) {
          $("header.header").addClass("fixed").removeClass("default");
        } else {
          $("header.header").addClass("default").removeClass("fixed");
        }
        ost = cOst;
      });
    }
  });

  $('input[name="globalunsub"]').change(function () {
    if ($(this).is(":checked")) {
      $(".item").addClass("disabled");
      $(".item input").attr("disabled", "disabled");
    } else {
      $(".item").removeClass("disabled");
      $(".item input").removeAttr("disabled");
    }
  });
  $(function () {
    var value1 = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    $('[data-target="blog-index-filter-link"]').each(function () {
      var url = $(this).attr("href");
      var lastSegment = url.split("/").pop();
      if (lastSegment == value1) {
        $(this).parent().siblings().removeClass("active");
        $(this).addClass("active");
      }
    });
  });

  var announcementOnDevConsole = function () {
    try {
      var main =
        "display:block;font-family:proxima-nova,'Open Sans',Arial, sans-serif;font-size:14px;font-style:normal;font-variant:normal;font-weight:bold;height:34px;line-height:17px;margin-bottom:10px;margin-top:5px;text-align:center;text-shadow:none;";
      var link = "text-decoration: underline;";
      var isNewEnoughBrowser = "repeat" in String.prototype;
      if (isNewEnoughBrowser) {
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
      }
    } catch (_) {}
  };
  announcementOnDevConsole();
})();

/* ----------------------------- Menus ---------------------------------- */

var websiteNavigation = function () {
  var OPEN_MENU_CLASS = "website-navigation__menu--open";
  var OPEN_SUB_MENU_CLASS = "website-navigation-sub-menu--open";
  var OPEN_HEADER_CLASS = "website-header--open";
  var HEADER_REVEALED_CLASS = "website-header--revealed";
  var HEADER_HAS_OPEN_SUBMENU_CLASS = "website-header--has-open-submenu";
  var MENU_SHOWING_SUB_MENU_CLASS =
    "website-navigation__menu--showing-sub-menu";

  var header = window.document.querySelector(".cm-header-group");
  var menuToggle = window.document.querySelector(".mobile-trigger");
  if (menuToggle) {
    var menu = window.document.querySelector(
      "#" + menuToggle.getAttribute("aria-controls")
    );

    var subMenuToggles = menu.querySelectorAll(".has-submenu");

    var subMenuToggleProxies = window.document.querySelectorAll(
      ".website-navigation-sub-menu__toggle-proxy"
    );

    var currentOpenSubMenu = null;

    function setupEventListeners() {
      window.addEventListener("click", handleWindowClick);
      if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
      }
      Array.prototype.forEach.call(subMenuToggles, function (t) {
        t.addEventListener("click", toggleSubMenu);
      });
      Array.prototype.forEach.call(subMenuToggleProxies, function (t) {
        t.addEventListener("click", clickProxy);
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
      var subMenuToggle = e.target;
      var subMenu = getSubMenu(subMenuToggle);

      if (currentOpenSubMenu === null) {
        openSubMenu(subMenu, subMenuToggle);
        return;
      }

      if (targetIsCurrentlyOpen(subMenu)) {
        closeSubMenu(subMenu, subMenuToggle);
        return;
      }

      if (!targetIsCurrentlyOpen(subMenu)) {
        var currentlyOpenSubMenu = currentOpenSubMenu.menu;
        var currentlyOpenSubMenuToggle = currentOpenSubMenu.toggle;

        closeSubMenu(currentlyOpenSubMenu, currentlyOpenSubMenuToggle);
        openSubMenu(subMenu, subMenuToggle);
        return;
      }
    }

    function clickProxy(e) {
      var real = window.document.getElementById(
        e.target.dataset.sub_menu_toggle_id
      );
      real.click();
    }

    function targetIsCurrentlyOpen(subMenu) {
      return currentOpenSubMenu.menu === subMenu;
    }

    function openMenu() {
      header.classList.add(OPEN_HEADER_CLASS, HEADER_REVEALED_CLASS);
      menuToggle.setAttribute("aria-expanded", "true");
      menu.classList.add(OPEN_MENU_CLASS);

      if (currentOpenSubMenu) {
        closeSubMenu(currentOpenSubMenu.menu, currentOpenSubMenu.toggle);
      }
    }

    function closeMenu() {
      header.classList.remove(OPEN_HEADER_CLASS);
      menuToggle.setAttribute("aria-expanded", "false");
      menu.classList.remove(OPEN_MENU_CLASS);
    }

    function openSubMenu(subMenu, subMenuToggle) {
      currentOpenSubMenu = { menu: subMenu, toggle: subMenuToggle };

      header.classList.add(HEADER_HAS_OPEN_SUBMENU_CLASS);
      subMenuToggle.setAttribute("aria-expanded", "true");
      subMenu.classList.add(OPEN_SUB_MENU_CLASS);
      menu.classList.add(MENU_SHOWING_SUB_MENU_CLASS);

      subMenuToggle.style.marginBottom = subMenu.scrollHeight + "px";
    }

    function closeSubMenu(subMenu, subMenuToggle) {
      currentOpenSubMenu = null;

      header.classList.remove(HEADER_HAS_OPEN_SUBMENU_CLASS);
      subMenuToggle.setAttribute("aria-expanded", "false");
      subMenu.classList.remove(OPEN_SUB_MENU_CLASS);
      menu.classList.remove(MENU_SHOWING_SUB_MENU_CLASS);

      subMenuToggle.style.removeProperty("margin-bottom");
    }

    function getSubMenu(subMenuToggle) {
      return window.document.getElementById(
        subMenuToggle.getAttribute("aria-controls")
      );
    }

    function exposeSharedMethods() {
      window.__CODURANCE = window.__CODURANCE || {};
      window.__CODURANCE.websiteNavigation = {
        closeOpenSubMenu: function () {
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
    var book_offset = $(".cm-header-group").height();
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
