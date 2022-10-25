let hsSearch = function (_instance) {
  const TYPEAHEAD_LIMIT = 5;
  let KEYS = {
    TAB: 'Tab',
    ESC: 'Esc', // IE11 & Edge 16 value for Escape
    ESCAPE: 'Escape',
    UP: 'Up', // IE11 & Edge 16 value for Arrow Up
    ARROW_UP: 'ArrowUp',
    DOWN: 'Down', // IE11 & Edge 16 value for Arrow Down
    ARROW_DOWN: 'ArrowDown',
  };
  let searchTerm = '',
    htmlLang = document.documentElement.lang,
    searchForm = _instance,
    searchField = _instance.querySelector('.hs-search-field__input'),
    searchResults = _instance.querySelector('.hs-search-field__suggestions'),
    searchOptions = function() {
      let formParams = [];
      let form = _instance.querySelector('form');
      for (
        let i = 0;
        i < form.querySelectorAll('input[type=hidden]').length;
        i++
      ) {
        let e = form.querySelectorAll('input[type=hidden]')[i];
        if (e.name !== 'limit') {
          formParams.push(
            encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value)
          );
        }
      }
      let queryString = formParams.join('&');
      return queryString;
    };

  let debounce = function (func, wait, immediate) {
    let timeout;
      return function() {
        let context = this,
          args = arguments;
        let later = function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 200);
        if (callNow) {
          func.apply(context, args);
        }
      };
    },
    emptySearchResults = function() {
      searchResults.innerHTML = '';
      searchField.focus();
      searchForm.classList.remove('hs-search-field--open');
    },

    fillSearchResults = function(response) {
      let searchMessage = htmlLang == 'es' ? "Resultados para" : "Results for";
      let items = [];
      items.push(
        `<li id='results-for'>${searchMessage} ${response.searchTerm}</li>`
      );

      response.results.forEach(function(val, index) {
        items.push(
          `<li id="result${index}">
            <a href="${val.url}"> ${val.title}</a>
          </li>`
        );
      });

      emptySearchResults();
      searchResults.innerHTML = items.join('');
      searchForm.classList.add('hs-search-field--open');
    },
    getSearchResults = function() {
      let request = new XMLHttpRequest();
      let requestUrl =
        '/_hcms/search?&term=' +
        encodeURIComponent(searchTerm) +
        '&limit=' +
        encodeURIComponent(TYPEAHEAD_LIMIT) +
        '&autocomplete=true&analytics=true&' +
        searchOptions();

      request.open('GET', requestUrl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          let data = JSON.parse(request.responseText);
          if (data.total > 0) {
            fillSearchResults(data);
            trapFocus();
          } else {
            emptySearchResults();
          }
        } else {
          console.error('Server reached, error retrieving results.');
        }
      };
      request.onerror = function() {
        console.error('Could not reach the server.');
      };
      request.send();
    },
    trapFocus = function() {
      let tabbable = [];
      tabbable.push(searchField);
      let tabbables = searchResults.getElementsByTagName('A');
      for (let i = 0; i < tabbables.length; i++) {
        tabbable.push(tabbables[i]);
      }
      let firstTabbable = tabbable[0],
        lastTabbable = tabbable[tabbable.length - 1];
      let tabResult = function (e) {
          if (e.target == lastTabbable && !e.shiftKey) {
            e.preventDefault();
            firstTabbable.focus();
          } else if (e.target == firstTabbable && e.shiftKey) {
            e.preventDefault();
            lastTabbable.focus();
          }
        },
        nextResult = function(e) {
          e.preventDefault();
          if (e.target == lastTabbable) {
            firstTabbable.focus();
          } else {
            tabbable.forEach(function(el) {
              if (el == e.target) {
                tabbable[tabbable.indexOf(el) + 1].focus();
              }
            });
          }
        },
        lastResult = function(e) {
          e.preventDefault();
          if (e.target == firstTabbable) {
            lastTabbable.focus();
          } else {
            tabbable.forEach(function(el) {
              if (el == e.target) {
                tabbable[tabbable.indexOf(el) - 1].focus();
              }
            });
          }
        };
      searchForm.addEventListener('keydown', function(e) {
        switch (e.key) {
          case KEYS.TAB:
            tabResult(e);
            break;
          case KEYS.ESC:
          case KEYS.ESCAPE:
            emptySearchResults();
            break;
          case KEYS.UP:
          case KEYS.ARROW_UP:
            lastResult(e);
            break;
          case KEYS.DOWN:
          case KEYS.ARROW_DOWN:
            nextResult(e);
            break;
        }
      });
    },
    isSearchTermPresent = debounce(function() {
      searchTerm = searchField.value;
      if (searchTerm.length > 2) {
        getSearchResults();
      } else if (searchTerm.length == 0) {
        emptySearchResults();
      }
    }, 250),
    clearResultsOnClick = function () {
      document.addEventListener("click", (e) => {
        if (!searchField.contains(e.target) &&
          !searchResults.contains(e.target)) {
          emptySearchResults();
        }
      })
    },
    init = (function() {
      clearResultsOnClick();
      searchField.addEventListener('input', function(e) {
        if (searchTerm != searchField.value) {
          isSearchTermPresent();
        }
      });
    })();
};




if (
  document.attachEvent
    ? document.readyState === 'complete'
    : document.readyState !== 'loading'
) {
  let searchResults = document.querySelectorAll('.hs-search-field');
  Array.prototype.forEach.call(searchResults, function(el) {
    let hsSearchModule = hsSearch(el);
  });
} else {
  document.addEventListener('DOMContentLoaded', function() {
    let searchResults = document.querySelectorAll('.hs-search-field');
    Array.prototype.forEach.call(searchResults, function(el) {
      let hsSearchModule = hsSearch(el);
    });
  });
}
