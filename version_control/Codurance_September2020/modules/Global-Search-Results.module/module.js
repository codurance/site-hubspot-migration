var hsResultsPage = function(_resultsClass) {
  function buildResultsPage(_instance) {
    var resultTemplate = _instance.querySelector(
        '.hs-search-results__template'
      ),
      resultsSection = _instance.querySelector('.hs-search-results__listing'),
      searchPath = _instance
        .querySelector('.hs-search-results__pagination')
        .getAttribute('data-search-path'),
      prevLink = _instance.querySelector('.hs-search-results__prev-page'),
      nextLink = _instance.querySelector('.hs-search-results__next-page');

    var searchParams = new URLSearchParams(window.location.search.slice(1));

    function getTerm() {
      return searchParams.get('term') || '';
    }
    function getOffset() {
      return parseInt(searchParams.get('offset')) || 0;
    }
    function getLimit() {
      return parseInt(searchParams.get('limit'));
    }
    function addResult(title, url, description, featuredImage) {
      var newResult = document.importNode(resultTemplate.content, true);
      function isFeaturedImageEnabled() {
        if (
          newResult.querySelector('.hs-search-results__featured-image > img')
        ) {
          return true;
        }
      }
      newResult.querySelector('.hs-search-results__title').innerHTML = title;
      newResult.querySelector('.hs-search-results__title').href = url;
      newResult.querySelector(
        '.hs-search-results__description'
      ).innerHTML = description;
      if (typeof featuredImage !== 'undefined' && isFeaturedImageEnabled()) {
        newResult.querySelector(
          '.hs-search-results__featured-image > img'
        ).src = featuredImage;
      }
      resultsSection.appendChild(newResult);
    }
    function fillResults(results) {
      results.results.forEach(function(result, i) {
        addResult(
          result.title,
          result.url,
          result.description,
          result.featuredImageUrl
        );
      });
    }
    function emptyPagination() {
      prevLink.innerHTML = '';
      nextLink.innerHTML = '';
    }
    function emptyResults(searchedTerm) {
      resultsSection.innerHTML =
        '<div class="hs-search__no-results"><p>Sorry. There are no results for "' +
        searchedTerm +
        '"</p>' +
        '<p>Try rewording your query, or browse through our site.</p></div>';
    }
    function setSearchBarDefault(searchedTerm) {
      var searchBars = document.querySelectorAll('.hs-search-field__input');
      Array.prototype.forEach.call(searchBars, function(el) {
        el.value = searchedTerm;
      });
    }
    function httpRequest(term, offset) {
      var SEARCH_URL = '/_hcms/search?',
        requestUrl = SEARCH_URL + searchParams + '&analytics=true',
        request = new XMLHttpRequest();

      request.open('GET', requestUrl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          setSearchBarDefault(data.searchTerm);
          if (data.total > 0) {
            fillResults(data);
            paginate(data);
          } else {
            emptyResults(data.searchTerm);
            emptyPagination();
          }
        } else {
          console.error('Server reached, error retrieving results.');
        }
      };
      request.onerror = function() {
        console.error('Could not reach the server.');
      };
      request.send();
    }
    function paginate(results) {
      var updatedLimit = getLimit() || results.limit;

      function hasPreviousPage() {
        return results.page > 0;
      }
      function hasNextPage() {
        return results.offset <= results.total - updatedLimit;
      }

      if (hasPreviousPage()) {
        var prevParams = new URLSearchParams(searchParams.toString());
        prevParams.set(
          'offset',
          results.page * updatedLimit - parseInt(updatedLimit)
        );
        prevLink.href = '/' + searchPath + '?' + prevParams;
        prevLink.innerHTML = '&lt; Previous page';
      } else {
        prevLink.parentNode.removeChild(prevLink);
      }

      if (hasNextPage()) {
        var nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set(
          'offset',
          results.page * updatedLimit + parseInt(updatedLimit)
        );
        nextLink.href = '/' + searchPath + '?' + nextParams;
        nextLink.innerHTML = 'Next page &gt;';
      } else {
        nextLink.parentNode.removeChild(nextLink);
      }
    }
    var getResults = (function() {
      if (getTerm()) {
        httpRequest(getTerm(), getOffset());
      } else {
        emptyPagination();
      }
    })();
  }
  (function() {
    var searchResults = document.querySelectorAll(_resultsClass);
    Array.prototype.forEach.call(searchResults, function(el) {
      buildResultsPage(el);
    });
  })();
};

if (
  document.attachEvent
    ? document.readyState === 'complete'
    : document.readyState !== 'loading'
) {
  var resultsPages = hsResultsPage('div.hs-search-results');
} else {
  document.addEventListener('DOMContentLoaded', function() {
    var resultsPages = hsResultsPage('div.hs-search-results');
  });
}
