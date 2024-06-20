exports.main = async (context, sendResponse) => {
  const podcastTokens = await requestPodcastTokens();
  const podcastEpisodes = await fetchPodcastsEpisodesByTokens(podcastTokens);
  sendResponse({ body: podcastEpisodes, statusCode: 200 });

  async function requestPodcastTokens() {
    const headers = new Headers();
    const clientID = "ca0274ec38b8f9fa95ea1";
    const clientSecret = "af4c0704b41e5953ce1ef";
    const authorizationString = Buffer.from(
      `${clientID}:${clientSecret}`
    ).toString("base64");

    headers.append("Authorization", `Basic ${authorizationString}`);
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const response = await fetch(
      "https://api.podbean.com/v1/oauth/multiplePodcastsToken",
      {
        method: "POST",
        headers: headers,
        body: "grant_type=client_credentials"
      }
    );
    const podcastsInfo = await response.json();
    const podcastTokens = getPodcastTokens(podcastsInfo);
    return podcastTokens;
  }

  function getPodcastTokens(podcastsInfo) {
    let podcastTokens = [];
    podcastsInfo.podcasts.forEach((podcast) => {
      podcastTokens.push(podcast.access_token);
    });
    return podcastTokens;
  }

  async function fetchPodcastsEpisodesByTokens(tokens) {
    let allPodcastEpisodes = [];

    tokens.forEach(async (token) => {
      const response = await fetch(
        `https://api.podbean.com/v1/episodes?access_token=${token}&limit=5`
      );
      const podcastEpisodes = await response.json();
      allPodcastEpisodes.push(...podcastEpisodes.episodes);
    });

    return allPodcastEpisodes;
  }
};
