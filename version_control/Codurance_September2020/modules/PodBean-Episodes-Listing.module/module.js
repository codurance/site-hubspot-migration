"use strict";

(async () => {
  const podcastEpisodes = await fetchPodcastEpisodes();
  const latestEpisodes = getLatestEpisodes(podcastEpisodes);
  setLatestEpisodesOnModule(latestEpisodes, "codurance-talks");
  setLatestEpisodesOnModule(latestEpisodes, "fireside-chats");

  async function fetchPodcastEpisodes() {
    const urlEndpoint = "/_hcms/api/fetch_podcast_episodes";
    const response = await fetch(urlEndpoint);
    const podcastEpisodes = await response.json();
    return podcastEpisodes;
  }

  function getLatestEpisodes(podcastEpisodes) {
    podcastEpisodes.sort(
      (episodeA, episodeB) => episodeB.publish_time - episodeA.publish_time
    );

    return podcastEpisodes;
  }

  function setLatestEpisodesOnModule(latestEpisodes, podcast) {
    const moduleItemsListing = document.querySelectorAll(
      `.podbean-episodes-listing--${podcast} .podbean-episodes-listing__item`
    );
    let moduleItemIndex = 0;

    for (let index = 0; index < latestEpisodes.length; index++) {
      const moduleItem = moduleItemsListing[moduleItemIndex];
      const episode = latestEpisodes[index];
      const podcastId = episode.podcast_id;

      if (checkCorrectPodcast(podcastId, podcast)) {
        const moduleTitle = moduleItem.querySelector(
          ".podbean-episodes-listing__title"
        );
        moduleTitle.textContent = episode.title;

        const moduleDate = moduleItem.querySelector(
          ".podbean-episodes-listing__date"
        );
        moduleDate.textContent = episode.publish_time;

        const moduleLink = moduleItem.querySelector(".text-cta-primary");
        moduleLink.href = episode.permalink_url;

        moduleItemIndex++;
      }
    }
  }

  function checkCorrectPodcast(podcastId, podcast) {
    const firesideChatsPodcastId = "OYq66osa6uz2";
    const coduranceTalksPodcastId = "L6nj3tJrcwN";

    return (
      (podcastId === firesideChatsPodcastId && podcast === "fireside-chats") ||
      (podcastId === coduranceTalksPodcastId && podcast === "codurance-talks")
    );
  }
})();
