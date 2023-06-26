const noResults = {
  en: {
    title: "Sorry. There are no results for",
    subtitle: "Try rewording your query, or browse through our site."
  },
  es: {
    title: "Disculpa. No encontramos resultados para",
    subtitle: "Intenta cambiar tu búsqueda, o navega a través de nuestra web"
  }
};

let hsResultsPage = function(_resultsClass) {
  function buildResultsPage(_instance) {
    let resultTemplate = _instance.querySelector(
        ".hs-search-results__template"
      ),
      resultsSection = _instance.querySelector(".hs-search-results__listing"),
      searchPath = _instance
        .querySelector(".hs-search-results__pagination")
        .getAttribute("data-search-path"),
      prevLink = _instance.querySelector(".hs-search-results__prev-page"),
      nextLink = _instance.querySelector(".hs-search-results__next-page");

    let searchParams = new URLSearchParams(window.location.search.slice(1));

    function getTerm() {
      return searchParams.get("term") || "";
    }
    function getOffset() {
      return parseInt(searchParams.get("offset")) || 0;
    }

    function getLimit() {
      return parseInt(searchParams.get("limit"));
    }

    function addResult(
      title,
      url,
      description,
      featuredImage,
      publishedDate,
      authorFullName
    ) {
      let newResult = document.importNode(resultTemplate.content, true);

      const author = newResult.querySelector(".hs-search-results__author");
      const image = newResult.querySelector(
        ".hs-search-results__featured-image > img"
      );
      const titleTag = newResult.querySelector(".hs-search-results__title");
      const descriptionTag = newResult.querySelector(
        ".hs-search-results__description"
      );

      function isFeaturedImageEnabled() {
        if (
          newResult.querySelector(".hs-search-results__featured-image > img")
        ) {
          return true;
        }
      }

      titleTag.innerHTML = title;
      titleTag.href = url;
      descriptionTag.innerHTML = description;

      if (typeof publishedDate !== "undefined") {
        newResult.querySelector(
          ".hs-search-results__date"
        ).textContent = `· Posted ${getAndFormatDate(publishedDate)}`;
      }

      if (typeof authorFullName !== "undefined") {
        author.textContent = `By ${authorFullName}`;
      }

      if (typeof featuredImage !== "undefined" && isFeaturedImageEnabled()) {
        image.src = featuredImage;
      }
      resultsSection.appendChild(newResult);
    }

    function getAndFormatDate(publishedDate) {
      const dateOptions = {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      let localDate = new Date(parseInt(publishedDate)).toLocaleDateString(
        "en-GB",
        dateOptions
      );
      return localDate;
    }

    function fillResults(results) {
      results.results.forEach(function(result, i) {
        addResult(
          result.title,
          result.url,
          result.description,
          result.featuredImageUrl,
          result.publishedDate,
          result.authorFullName
        );
      });
    }

    function emptyPagination() {
      prevLink.innerHTML = "";
      nextLink.innerHTML = "";
    }

    function emptyResults(searchedTerm) {
      const content =
        searchParams.get("language") === "es" ? noResults.es : noResults.en;

      const noResultsHtml = `<div class="hs-search__no-results">
                                    <p>${content.title} ${searchedTerm} </p>
                                    <p>${content.subtitle}</p>
                               </div>`;

      resultsSection.insertAdjacentHTML("afterbegin", noResultsHtml);
    }

    function setSearchBarDefault(searchedTerm) {
      let searchBars = document.querySelectorAll(".hs-search-field__input");
      Array.prototype.forEach.call(searchBars, function(el) {
        el.value = searchedTerm;
      });
    }

    function httpRequest(term, offset) {
      let SEARCH_URL = "/_hcms/search?",
        requestUrl = SEARCH_URL + searchParams + "&analytics=true",
        request = new XMLHttpRequest();

      request.open("GET", requestUrl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          let data = JSON.parse(request.responseText);
          setSearchBarDefault(data.searchTerm);
          if (data.total > 0) {
            fillResults(data);
            paginate(data);
          } else {
            emptyResults(data.searchTerm);
            emptyPagination();
          }
        } else {
          console.error("Server reached, error retrieving results.");
        }
      };
      request.onerror = function() {
        console.error("Could not reach the server.");
      };
      request.send();
    }

    function paginate(results) {
      let updatedLimit = getLimit() || results.limit;

      function hasPreviousPage() {
        return results.page > 0;
      }
      function hasNextPage() {
        return results.offset <= results.total - updatedLimit;
      }

      if (hasPreviousPage()) {
        let prevParams = new URLSearchParams(searchParams.toString());
        prevParams.set(
          "offset",
          results.page * updatedLimit - parseInt(updatedLimit)
        );
        prevLink.href = "/" + searchPath + "?" + prevParams;
      } else {
        prevLink.parentNode.removeChild(prevLink);
      }

      if (hasNextPage()) {
        let nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set(
          "offset",
          results.page * updatedLimit + parseInt(updatedLimit)
        );
        nextLink.href = "/" + searchPath + "?" + nextParams;
      } else {
        nextLink.parentNode.removeChild(nextLink);
      }
    }

    let getResults = (function() {
      if (getTerm()) {
        httpRequest(getTerm(), getOffset());
      } else {
        emptyPagination();
      }
    })();
  }

  (function() {
    let searchResults = document.querySelectorAll(_resultsClass);
    Array.prototype.forEach.call(searchResults, function(el) {
      buildResultsPage(el);
    });
  })();
};

if (
  document.attachEvent
    ? document.readyState === "complete"
    : document.readyState !== "loading"
) {
  let resultsPages = hsResultsPage("div.hs-search-results");
} else {
  document.addEventListener("DOMContentLoaded", function() {
    let resultsPages = hsResultsPage("div.hs-search-results");
  });
}
