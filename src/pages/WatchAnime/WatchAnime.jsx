import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import HlsVideoPlayer from "./HlsVideoPlayer";
import "../../main.css";
import "./watch-anime.css";
import loadingImage from "../../media/placeholder.gif";
import RecommendedTopTen from "../../Layouts/RecommendedTopTen";
import Share from "../../components/Share/Share";
import LoadingSpinner from "../../components/LoadingSpinner";
import { easeOut, motion } from "framer-motion";
import Error from "../../components/AnimeNotFound/Error";
import axios from "axios";

// Custom hooks for Aniwatch API
const useAniwatchSearch = (query) => {
  return useQuery(["search", query], async () => {
    const { data } = await axios.get(
      `https://aniwatch-api-dusky.vercel.app/api/v2/hianime/search?query=${encodeURIComponent(query)}`
    );
    return data.data;
  });
};

const useAniwatchInfo = (animeId) => {
  return useQuery(["info", animeId], async () => {
    const { data } = await axios.get(
      `https://aniwatch-api-dusky.vercel.app/api/v2/hianime/anime/${animeId}/episodes`
    );
    return data.data;
  });
};

const useAniwatchServers = (episodeId) => {
  return useQuery(["servers", episodeId], async () => {
    const { data } = await axios.get(
      `https://aniwatch-api-dusky.vercel.app/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`
    );
    return data.data;
  });
};

const useAniwatchEpisode = (serverUrl) => {
  return useQuery(["episode", serverUrl], async () => {
    const { data } = await axios.get(serverUrl);
    return data.data;
  });
};

export default function WatchAnime() {
  const [descIsCollapsed, setDescIsCollapsed] = useState(true);
  const [searchParams] = useSearchParams();
  const [subIsSelected, setSubIsSelected] = useState(true);
  const [subInfo, setSubInfo] = useState({});
  const [dubInfo, setDubInfo] = useState({});
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [quality, setQuality] = useState("default");

  // Search handling
  const searchQuery = searchParams.get("name");
  const { data: searchResults } = useAniwatchSearch(searchQuery);
  
  // Handle sub/dub detection from search results
  useEffect(() => {
    if (searchResults) {
      const sub = searchResults.find(a => a.type === 'sub');
      const dub = searchResults.find(a => a.type === 'dub');
      setSubInfo(sub || {});
      setDubInfo(dub || {});
      setSubIsSelected(!!sub);
    }
  }, [searchResults]);

  // Anime info handling
  const { data: subData } = useAniwatchInfo(subInfo?.id);
  const { data: dubData } = useAniwatchInfo(dubInfo?.id);

  // Episode handling
  const currentAnime = subIsSelected ? subData : dubData;
  const episodeList = currentAnime?.episodes || [];
  const currentEpisode = episodeList[selectedEpisode]?.id;

  // Server handling
  const { data: servers } = useAniwatchServers(currentEpisode);
  
  // Episode source handling
  const selectedServerUrl = servers?.[selectedServer]?.url;
  const { data: episodeData } = useAniwatchEpisode(selectedServerUrl);
  const episodeQuality = episodeData?.sources || [];

  useEffect(() => {
    if (subData) setSubInfo(prev => ({ ...prev, ...subData }));
    if (dubData) setDubInfo(prev => ({ ...prev, ...dubData }));
  }, [subData, dubData]);

  const sourceUrl = episodeQuality.find(q => q.quality === quality)?.url;

  // UI components
  const serverButtons = servers?.map((server, idx) => (
    <span
      key={server.name}
      className={`server-tile ${selectedServer === idx ? "selected" : ""}`}
      onClick={() => setSelectedServer(idx)}
    >
      {server.name}
    </span>
  ));

  const episodeButtons = episodeList?.map((episode, idx) => (
    <span
      key={episode.id}
      className={`episode-tile ${idx === selectedEpisode ? "selected" : ""}`}
      onClick={() => setSelectedEpisode(idx)}
    >
      Episode {episode.number}
    </span>
  ));

  const qualityButtons = episodeQuality?.map((q) => (
    <option
      key={q.quality}
      value={q.quality}
      className={`episode-tile ${q.quality === quality ? "selected" : ""}`}
    >
      {q.quality.toUpperCase()}
    </option>
  ));

  if (!searchResults) return <LoadingSpinner />;
  if (!currentAnime) return <Error />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ x: [window.innerWidth / 2, 0], opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOut }}
    >
      <div style={{ marginTop: "65px" }} className="watch-container d-flex">
        <img
          className="watch-container-background"
          src={currentAnime.image}
          alt="background"
        />

        <div className="media-center d-flex">
          <div className="episode-container">
            <p>List of Episodes:</p>
            <div className="episode-tiles-wrapper d-flex a-center">
              {episodeButtons || <LoadingSpinner />}
            </div>
          </div>

          <div className="video-player">
            <div className="hls-container">
              {sourceUrl ? (
                <HlsVideoPlayer url={sourceUrl} />
              ) : (
                <div className="d-flex a-center j-center" style={{ height: "100%" }}>
                  <img src={loadingImage} alt="loading" />
                </div>
              )}
            </div>

            <div className="server-container d-flex-fd-column">
              <div className="server-tile-wrapper d-flex-fd-column">
                <div>
                  Language Preference:
                  {subInfo.id && (
                    <span
                      className={`server-tile ${subIsSelected ? "selected" : ""}`}
                      onClick={() => setSubIsSelected(true)}
                    >
                      Sub
                    </span>
                  )}
                  {dubInfo.id && (
                    <span
                      className={`server-tile ${!subIsSelected ? "selected" : ""}`}
                      onClick={() => setSubIsSelected(false)}
                    >
                      Dub
                    </span>
                  )}
                </div>
                <div>
                  Servers: {servers?.length ? serverButtons : <LoadingSpinner />}
                </div>
                <div>
                  Quality:
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    style={{ background: "var(--theme)" }}
                  >
                    {qualityButtons}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="current-anime-details">
          <img
            className="details-container-background"
            src={currentAnime.image}
            alt="anime details"
          />
          <div className="anime-details d-flex-fd-column">
            <img
              className="anime-details-poster"
              src={currentAnime.image}
              alt="poster"
            />
            <div className="anime-details-content d-flex-fd-column">
              <h1 className="title-large">{currentAnime.title}</h1>
              <p>
                {descIsCollapsed
                  ? `${currentAnime.description?.slice(0, 150)}...`
                  : currentAnime.description}
                <span onClick={() => setDescIsCollapsed(!descIsCollapsed)}>
                  [{descIsCollapsed ? "More" : "Less"}]
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Share />
      <RecommendedTopTen />
    </motion.div>
  );
}