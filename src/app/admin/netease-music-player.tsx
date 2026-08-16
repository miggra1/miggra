"use client";

import { useEffect, useRef, useState } from "react";
import { StudioIcon } from "./studio-icon";

type MusicTrack = {
  id: number;
  name: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  duration: number;
  resolvedAt: number;
};

type MusicResponse = {
  playlistName: string;
  tracks: MusicTrack[];
  error?: string;
};

type TrackRefreshResponse = {
  track?: Pick<MusicTrack, "id" | "url" | "duration" | "resolvedAt">;
  error?: string;
};

const MEDIA_URL_MAX_AGE = 3 * 60 * 1000;

function isMediaUrlStale(track: MusicTrack) {
  return !track.resolvedAt || Date.now() - track.resolvedAt > MEDIA_URL_MAX_AGE;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function NeteaseMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlistName, setPlaylistName] = useState("我的歌单");
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeAfterChangeRef = useRef(false);
  const refreshingTrackRef = useRef(false);
  const playIntentRef = useRef(false);
  const currentTrack = tracks[currentIndex] ?? null;

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    fetch("/api/admin/music", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as MusicResponse;
        if (!response.ok) throw new Error(data.error || "音乐加载失败");
        return data;
      })
      .then((data) => {
        if (!isActive) return;
        setTracks(data.tracks);
        setPlaylistName(data.playlistName);
        setCurrentIndex(0);
        setError("");
      })
      .catch((reason: unknown) => {
        if (!isActive || (reason instanceof DOMException && reason.name === "AbortError")) return;
        setError(reason instanceof Error ? reason.message : "音乐加载失败");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.dataset.trackId !== String(currentTrack.id) || audio.getAttribute("src") !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.dataset.trackId = String(currentTrack.id);
      audio.load();
    }
    if (resumeAfterChangeRef.current) {
      audio.play().catch(() => setError("浏览器阻止了继续播放，请点击播放按钮恢复。"));
    }
    resumeAfterChangeRef.current = false;
  }, [currentTrack]);

  async function resetQueue() {
    const shouldResume = playIntentRef.current;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/music?reset=${Date.now()}`, { cache: "no-store" });
      const data = await response.json() as MusicResponse;
      if (!response.ok) throw new Error(data.error || "重新随机失败");

      resumeAfterChangeRef.current = shouldResume;
      setTracks(data.tracks);
      setPlaylistName(data.playlistName);
      setCurrentIndex(0);
      setCurrentTime(0);
      setDuration(0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "重新随机失败");
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshTrackUrl(index: number, shouldPlay: boolean, seekTo = 0) {
    const track = tracks[index];
    const audio = audioRef.current;
    if (!track || !audio || refreshingTrackRef.current) return;

    refreshingTrackRef.current = true;
    playIntentRef.current = shouldPlay;
    try {
      const response = await fetch(`/api/admin/music?trackId=${track.id}&refresh=${Date.now()}`, { cache: "no-store" });
      const data = await response.json() as TrackRefreshResponse;
      if (!response.ok || !data.track) throw new Error(data.error || "播放地址刷新失败");

      const refreshed = { ...track, ...data.track };
      setTracks((items) => items.map((item, itemIndex) => itemIndex === index ? refreshed : item));
      setCurrentIndex(index);
      setCurrentTime(seekTo);
      setDuration(0);
      setError("");

      audio.pause();
      audio.src = refreshed.url;
      audio.dataset.trackId = String(refreshed.id);
      await new Promise<void>((resolve, reject) => {
        const handleLoaded = () => {
          audio.removeEventListener("error", handleError);
          resolve();
        };
        const handleError = () => {
          audio.removeEventListener("loadedmetadata", handleLoaded);
          reject(new Error("新的播放地址仍然不可用"));
        };
        audio.addEventListener("loadedmetadata", handleLoaded, { once: true });
        audio.addEventListener("error", handleError, { once: true });
        audio.load();
      });
      if (seekTo > 0 && Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(seekTo, Math.max(audio.duration - 1, 0));
      }
      if (shouldPlay) {
        await audio.play().catch(() => setError("请点击播放按钮恢复播放。"));
      }
    } catch (reason) {
      playIntentRef.current = false;
      setIsPlaying(false);
      setError(reason instanceof Error ? reason.message : "播放地址刷新失败");
    } finally {
      refreshingTrackRef.current = false;
    }
  }

  function selectTrack(index: number, keepPlaying = isPlaying) {
    if (index === currentIndex) {
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
      playIntentRef.current = keepPlaying;
      if (keepPlaying && isMediaUrlStale(tracks[index])) {
        void refreshTrackUrl(index, true);
      } else if (keepPlaying) {
        audio?.play().catch(() => setError("请点击播放按钮开始播放。"));
      }
      return;
    }

    const nextTrack = tracks[index];
    const audio = audioRef.current;
    resumeAfterChangeRef.current = false;
    playIntentRef.current = keepPlaying;
    if (nextTrack && keepPlaying && isMediaUrlStale(nextTrack)) {
      setCurrentIndex(index);
      setCurrentTime(0);
      setDuration(0);
      setError("");
      void refreshTrackUrl(index, true);
      return;
    }
    if (audio && nextTrack) {
      audio.src = nextTrack.url;
      audio.dataset.trackId = String(nextTrack.id);
      audio.load();
      if (keepPlaying) audio.play().catch(() => setError("请点击播放按钮开始播放。"));
    }
    setCurrentIndex(index);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  }

  function moveTrack(direction: 1 | -1, keepPlaying = isPlaying) {
    if (!tracks.length) return;
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
    selectTrack(nextIndex, keepPlaying);
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.paused) {
      playIntentRef.current = true;
      if (isMediaUrlStale(currentTrack)) {
        await refreshTrackUrl(currentIndex, true, currentTime);
        return;
      }
      try {
        await audio.play();
        setError("");
      } catch {
        setError("浏览器暂时阻止了播放，请再点击一次。");
      }
    } else {
      playIntentRef.current = false;
      audio.pause();
    }
  }

  function handleEnded() {
    if (!tracks.length) return;
    const nextIndex = (currentIndex + 1) % tracks.length;
    selectTrack(nextIndex, true);
  }

  return (
    <div className="studio-music-plugin">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        preload="metadata"
        onPlay={() => {
          playIntentRef.current = true;
          setIsPlaying(true);
          setError("");
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={(event) => {
          if (refreshingTrackRef.current || !currentTrack) return;
          const failedAt = event.currentTarget.currentTime || currentTime;
          void refreshTrackUrl(currentIndex, playIntentRef.current, failedAt);
        }}
      />

      {isOpen && (
        <section className="studio-music-panel studio-custom-player" role="dialog" aria-label="网易云音乐播放器">
          <header className="studio-music-panel-head">
            <div>
              <p>网易云音乐</p>
              <h2>随机创作歌单</h2>
            </div>
            <div className="studio-music-panel-actions">
              <button
                type="button"
                className="studio-music-reset"
                onClick={resetQueue}
                disabled={isLoading}
              >
                <StudioIcon name="refresh" size={15} />
                {isLoading ? "随机中" : "重新随机"}
              </button>
              <button type="button" className="studio-icon-button" onClick={() => setIsOpen(false)} aria-label="收起播放器" title="收起播放器">
                <StudioIcon name="close" size={18} />
              </button>
            </div>
          </header>

          <div className="studio-player-body">
            {currentTrack ? (
              <>
                <div className="studio-player-now">
                  <span
                    className={`studio-player-cover${isPlaying ? " is-playing" : ""}`}
                    style={{ backgroundImage: `url(${currentTrack.cover})` }}
                    aria-hidden="true"
                  />
                  <div className="studio-player-meta">
                    <small>{isPlaying ? "正在播放" : "准备播放"}</small>
                    <strong title={currentTrack.name}>{currentTrack.name}</strong>
                    <span>{currentTrack.artist}</span>
                  </div>
                </div>

                <div className="studio-player-progress">
                  <input
                    type="range"
                    min="0"
                    max={duration || Math.max(currentTrack.duration / 1000, 1)}
                    step="0.1"
                    value={Math.min(currentTime, duration || Math.max(currentTrack.duration / 1000, 1))}
                    onChange={(event) => {
                      const nextTime = Number(event.target.value);
                      if (audioRef.current) audioRef.current.currentTime = nextTime;
                      setCurrentTime(nextTime);
                    }}
                    aria-label="播放进度"
                  />
                  <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration || currentTrack.duration / 1000)}</span></div>
                </div>

                <div className="studio-player-controls">
                  <button type="button" onClick={() => moveTrack(-1)} aria-label="上一首" title="上一首">
                    <StudioIcon name="previous" size={20} />
                  </button>
                  <button type="button" className="studio-player-play" onClick={togglePlayback} aria-label={isPlaying ? "暂停" : "播放"}>
                    <StudioIcon name={isPlaying ? "pause" : "play"} size={22} />
                  </button>
                  <button type="button" onClick={() => moveTrack(1)} aria-label="下一首" title="下一首">
                    <StudioIcon name="next" size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="studio-player-empty">
                <StudioIcon name="music" size={25} />
                <p>{isLoading ? "正在从歌单挑选五首音乐…" : "暂时没有可播放的歌曲"}</p>
              </div>
            )}

            {error && <p className="studio-player-error" role="alert">{error}</p>}

            <div className="studio-player-queue-head">
              <span title={playlistName}>{playlistName} · {tracks.length || 5} 首</span>
              <small>收起后继续播放</small>
            </div>
            <ol className="studio-player-queue">
              {tracks.map((track, index) => (
                <li key={track.id} className={index === currentIndex ? "is-current" : ""}>
                  <button type="button" onClick={() => selectTrack(index, true)}>
                    <span className="studio-player-index">{index === currentIndex && isPlaying ? <StudioIcon name="music" size={14} /> : index + 1}</span>
                    <span className="studio-player-track-copy">
                      <strong>{track.name}</strong>
                      <small>{track.artist}</small>
                    </span>
                    <span className="studio-player-duration">{formatTime(track.duration / 1000)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

        </section>
      )}

      <button
        type="button"
        className={`studio-music-launcher${isOpen ? " is-active" : ""}${isPlaying ? " is-playing" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={currentTrack ? `${currentTrack.name} · ${currentTrack.artist}` : "网易云音乐"}
      >
        <span className="studio-music-launcher-icon"><StudioIcon name={isPlaying ? "pause" : "music"} size={18} /></span>
        <span>{isPlaying ? "播放中" : "音乐"}</span>
        <i className="studio-music-pulse" aria-hidden="true" />
      </button>
    </div>
  );
}
