"use strict";

(async () => {
  const latestPodcastEpisode = await fetchLatestPodcastEpisode();
  setLatestEpisodeOnModule(latestPodcastEpisode);
  displayModule();

  async function fetchLatestPodcastEpisode() {
    const urlEndpoint = "/_hcms/api/fetch_latest_codurance_talks_episode";
    const response = await fetch(urlEndpoint);
    const podcastEpisode = await response.json();
    return podcastEpisode;
  }

  function setLatestEpisodeOnModule(latestEpisode) {
    const moduleImage = document.querySelector(
      ".latest-podbean-episode__image"
    );
    moduleImage.src = latestEpisode.logo;

    const moduleTitle = document.querySelector(
      ".latest-podbean-episode__title"
    );
    moduleTitle.textContent = latestEpisode.title;

    const moduleSubtitle = document.querySelector(
      ".latest-podbean-episode__subtitle"
    );
    const latestEpisodeContentSanitized = latestEpisode.content.replace(
      /<[^>]*>/g,
      ""
    );
    moduleSubtitle.textContent = latestEpisodeContentSanitized;

    const moduleLink = document.querySelector(
      ".latest-podbean-episode__wrapper .text-cta-primary"
    );
    moduleLink.href = latestEpisode.permalink_url;
  }

  function displayModule() {
    const loadingSpinner = document.querySelector(
      ".latest-podbean-episode__loading"
    );
    loadingSpinner.classList.add("latest-podbean-episode__loading--hidden");

    const moduleWrapper = document.querySelector(
      ".latest-podbean-episode__wrapper"
    );
    moduleWrapper.classList.remove("latest-podbean-episode__wrapper--hidden");
  }
})();
