exports.main = async (context, sendResponse) => {
  const podcastTokens = await requestPodcastTokens();
  const podcastEpisodes = await fetchPodcastsEpisodesByTokens(podcastTokens);
  const OneDaySeconds = 86400;

  sendResponse({
    body: podcastEpisodes,
    headers: {
      "Cache-Control": `max-age=${OneDaySeconds}, public, immutable`
    },
    statusCode: 200
  });

  async function requestPodcastTokens() {
    const { clientID, clientSecret } = context.secrets;
    const authorizationString = Buffer.from(
      `${clientID}:${clientSecret}`
    ).toString("base64");

    const headers = new Headers();
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
