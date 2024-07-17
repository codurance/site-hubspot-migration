exports.main = async (context, sendResponse) => {
  const podcastToken = await requestPodcastToken();
  const podcastEpisode = await fetchLatestPodcastEpisode(podcastToken);
  const OneDaySeconds = 86400;

  sendResponse({
    body: podcastEpisode,
    headers: {
      "Cache-Control": `max-age=${OneDaySeconds}, public, immutable`
    }
  });

  async function requestPodcastToken() {
    const { clientID, clientSecret } = context.secrets;
    const authorizationString = Buffer.from(
      `${clientID}:${clientSecret}`
    ).toString("base64");
    const coduranceTalksID = "L6nj3tJrcwN";

    const headers = new Headers();
    headers.append("Authorization", `Basic ${authorizationString}`);
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const response = await fetch("https://api.podbean.com/v1/oauth/token", {
      method: "POST",
      headers: headers,
      body: `grant_type=client_credentials&podcast_id=${coduranceTalksID}`
    });
    const podcastToken = await response.json();

    return podcastToken.access_token;
  }

  async function fetchLatestPodcastEpisode(token) {
    const response = await fetch(
      `https://api.podbean.com/v1/episodes?access_token=${token}&limit=1`
    );
    const podcastEpisode = await response.json();

    return podcastEpisode.episodes[0];
  }
};
