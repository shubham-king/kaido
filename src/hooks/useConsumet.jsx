import axios from "axios";
import { useQuery } from "react-query";
import { servers } from "../api/gogoanime_servers";

// Proxy base URL
const PROXY_URL = `https://testing-cors.harc6r.easypanel.host/fetch/?url=`;

// Function to modify sources by appending the proxy
function appendProxyToSources(rawData) {
  if (rawData && rawData.sources) {
    return {
      ...rawData,
      sources: rawData.sources.map((source) => ({
        ...source,
        url: `${PROXY_URL}${encodeURIComponent(source.url)}`, // Appending proxy
      })),
    };
  }
  return rawData;
}

// Function to handle responses
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

// Example usage for episodes
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
