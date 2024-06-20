"use strict";

(async () => {
  const podcastEpisodes = await fetchPodcastEpisodes();
  const latestEpisode = getLatestEpisode(podcastEpisodes);
  setLatestEpisodeOnModule(latestEpisode);

  async function fetchPodcastEpisodes() {
    const urlEndpoint = "/_hcms/api/fetch_podcast_episodes";
    const response = await fetch(urlEndpoint);
    const podcastEpisodes = await response.json();
    return podcastEpisodes;
  }

  function getLatestEpisode(podcastEpisodes) {
    podcastEpisodes.sort(
      (episodeA, episodeB) => episodeB.publish_time - episodeA.publish_time
    );

    return podcastEpisodes[0];
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
    setTimeout(() => console.log(latestEpisodeContentSanitized), 5000);

    const moduleLink = document.querySelector(
      ".latest-podbean-episode .text-cta-primary"
    );
    moduleLink.href = latestEpisode.permalink_url;
  }
})();
