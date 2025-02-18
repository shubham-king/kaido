import axios from "axios";
import { useQuery } from "react-query";

const BASE_API = "https://aniwatch-api-dusky.vercel.app/";

/**
 * Search Anime
 * @param {string} name - Name of the anime to search
 * @returns {Object} - Search results
 */
export function useSearch(name) {
  return useQuery(["search", name], async () => {
    const { data } = await axios.get(
      `${BASE_API}/api/v2/hianime/search?query=${encodeURIComponent(name)}`
    );
    return data.data;
  });
}

/**
 * Fetch Anime Info
 * @param {string} id - Anime ID
 * @returns {Object} - Anime information
 */
export function useAnimeInfo(id) {
  return useQuery(["anime-info", id], async () => {
    const { data } = await axios.get(
      `${BASE_API}/api/v2/hianime/anime/${id}/episodes`
    );
    return data.data;
  });
}

/**
 * Fetch Available Servers for an Episode
 * @param {string} episodeId - Episode ID
 * @returns {Array} - List of servers
 */
export function useServers(episodeId) {
  return useQuery(["servers", episodeId], async () => {
    const { data } = await axios.get(
      `${BASE_API}/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`
    );
    return data.data;
  });
}

/**
 * Fetch Episode Files
 * @param {string} serverUrl - Server URL from the server response
 * @returns {Object} - Episode sources
 */
export function useEpisodeFiles(serverUrl) {
  return useQuery(["episode-files", serverUrl], async () => {
    const { data } = await axios.get(serverUrl);
    return data.data;
  });
}