import axios from "axios";
import { useQuery } from "react-query";
import { servers } from "../api/gogoanime_servers";

// Proxy URL
const PROXY_URL = `https://testing-cors.harc6r.easypanel.host/fetch/?url=`;

// Function to append proxy to sources
function appendProxyToSources(rawData) {
  if (rawData && rawData.sources) {
    return {
      ...rawData,
      sources: rawData.sources.map((source) => ({
        ...source,
        url: `${PROXY_URL}${encodeURIComponent(source.url)}`, // Append proxy
      })),
    };
  }
  return rawData;
}

// Function to handle Consumet API responses
function handleConsumetResponse(endpoint, parameter) {
  const TARGET_API = `https://consumet-api-vab8.onrender.com/anime/gogoanime`;
  const BASE_URL = `${PROXY_URL}${encodeURIComponent(TARGET_API)}`;

  const results = useQuery(`${endpoint}${parameter}`, async () => {
    if (parameter) {
      const response = await axios
        .get(`${BASE_URL}${endpoint}${parameter}`)
        .catch((err) => console.error(err));
      return appendProxyToSources(response?.data); // Append proxy to sources here
    }
  });

  if (!parameter) {
    return { isLoading: true };
  }

  return {
    isLoading: results.isLoading,
    isError: results.isError,
    data: results.data,
  };
}

/**
 * Search Anime
 * @param {string} name - Name of the anime to search
 * @returns {Object} - Search results, including loading and error states
 */
export function useSearch(name) {
  const searchResults = handleConsumetResponse("/", name.toLowerCase());
  console.log(name.toLowerCase());
  const results = searchResults.data?.results;

  let subAnime, dubAnime;
  if (results?.length === 0) {
    return { noAnime: true };
  }

  if (results?.length === 1) {
    if (
      results[0].id.slice(results[0].id.length - 3, results[0].id.length) ===
      "dub"
    ) {
      dubAnime = results[0];
    } else {
      subAnime = results[0];
    }
  }

  if (results?.length > 1) {
    const suffix_0 = results[0].id.slice(
      results[0].id.length - 3,
      results[0].id.length
    );

    if (suffix_0 !== "dub") {
      subAnime = results[0];
      dubAnime =
        results.find((el) => el.id === subAnime.id + "-dub") || results[1];
    } else if (suffix_0 === "dub") {
      dubAnime = results[0];
      subAnime = results.find(
        (el) => (el.id = dubAnime.id.slice(0, dubAnime.id.length - 4))
      );
    }
  }

  if (!searchResults.isLoading) {
    return {
      dub: dubAnime,
      sub: subAnime,
      isLoading: searchResults.isLoading,
      isError: searchResults.isError,
    };
  }
}

/**
 * Fetch Anime Info
 * @param {string} id - Anime ID
 * @returns {Object} - Anime information
 */
export function useAnimeInfo(id) {
  const results = handleConsumetResponse(`/info/`, id);
  if (!results.isLoading && results.data) {
    return results.data;
  }
}

/**
 * Fetch Available Servers for an Episode
 * @param {string} episodeId - Episode ID
 * @returns {Array} - List of usable servers
 */
export function useServers(episodeId) {
  const results = handleConsumetResponse(`/servers/`, episodeId);

  if (!results.isLoading && results.data) {
    const usableServers = [];

    for (let i = 0; i < servers.length; i++) {
      for (let j = 0; j < results.data.length; j++) {
        if (servers[i].name === results.data[j].name) {
          usableServers.push({ ...results.data[j], id: servers[i].id });
        }
      }
    }

    return usableServers;
  }
}

/**
 * Fetch Episode Files
 * @param {Object} params - Server and Episode ID
 * @returns {Object} - Sources for the episode with proxy URLs
 */
export function useEpisodeFiles({ server, id }) {
  const results = handleConsumetResponse(
    "/watch/",
    server && id ? `${id}?server=${server.id}` : null
  );

  if (!results.isLoading && results.data) {
    return {
      sources: results.data.sources, // Proxy URLs already appended
      isLoading: results.isLoading,
    };
  } else {
    return { isLoading: results.isLoading };
  }
}
