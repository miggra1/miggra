"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { StudioIcon } from "./studio-icon";

type NeteaseType = "0" | "1" | "2";
type NeteaseTarget = {
  type: NeteaseType;
  id: string;
  label: "歌单" | "专辑" | "单曲";
};

const STORAGE_KEY = "miggra:netease-music-player";
const DEFAULT_TARGET: NeteaseTarget = { type: "0", id: "3778678", label: "歌单" };

function parseTarget(value: string): NeteaseTarget | null {
  const input = value.trim();
  if (/^\d+$/.test(input)) return { type: "2", id: input, label: "单曲" };

  try {
    const url = new URL(input);
    if (url.hostname !== "music.163.com" && url.hostname !== "www.music.163.com") return null;

    const hash = url.hash.startsWith("#/") ? url.hash.slice(1) : "";
    const path = (hash ? hash.split("?")[0] : url.pathname).replace(/\/$/, "");
    const queryString = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : url.search.slice(1);
    const id = new URLSearchParams(queryString).get("id")?.trim();
    if (!id || !/^\d+$/.test(id)) return null;

    const segment = path.split("/").filter(Boolean).at(-1);
    if (segment === "song") return { type: "2", id, label: "单曲" };
    if (segment === "playlist") return { type: "0", id, label: "歌单" };
    if (segment === "album") return { type: "1", id, label: "专辑" };
  } catch {
    return null;
  }

  return null;
}

function getPlayerUrl(target: NeteaseTarget) {
  const params = new URLSearchParams({
    type: target.type,
    id: target.id,
    auto: "0",
    height: target.type === "2" ? "66" : "430",
  });
  return `https://music.163.com/outchain/player?${params.toString()}`;
}

export function NeteaseMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [target, setTarget] = useState<NeteaseTarget>(DEFAULT_TARGET);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const titleId = useId();

  useEffect(() => {
    let restoreTimer: number | undefined;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as NeteaseTarget;
      if ((parsed.type === "0" || parsed.type === "1" || parsed.type === "2") && /^\d+$/.test(parsed.id)) {
        restoreTimer = window.setTimeout(() => setTarget(parsed), 0);
      }
    } catch {
      // Ignore unavailable or malformed browser storage.
    }

    return () => {
      if (restoreTimer) window.clearTimeout(restoreTimer);
    };
  }, []);

  function openEditor() {
    setInput("");
    setError("");
    setIsEditing(true);
  }

  function saveTarget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = parseTarget(input);
    if (!next) {
      setError("请粘贴网易云音乐的单曲、歌单或专辑公开链接");
      return;
    }

    setTarget(next);
    setIsEditing(false);
    setError("");
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The player still works when storage is disabled.
    }
  }

  const playerHeight = target.type === "2" ? 86 : 430;

  return (
    <div className="studio-music-plugin">
      {isOpen && (
        <section className="studio-music-panel" role="dialog" aria-labelledby={titleId}>
          <header className="studio-music-panel-head">
            <div>
              <p>网易云音乐</p>
              <h2 id={titleId}>创作时刻</h2>
            </div>
            <div className="studio-music-panel-actions">
              <button type="button" className="studio-icon-button" onClick={openEditor} aria-label="更换音乐" title="更换音乐">
                <StudioIcon name="settings" size={18} />
              </button>
              <button type="button" className="studio-icon-button" onClick={() => setIsOpen(false)} aria-label="关闭音乐插件" title="关闭">
                <StudioIcon name="close" size={18} />
              </button>
            </div>
          </header>

          {isEditing ? (
            <form className="studio-music-form" onSubmit={saveTarget}>
              <label htmlFor={`${titleId}-url`}>网易云音乐链接</label>
              <input
                id={`${titleId}-url`}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="粘贴单曲、歌单或专辑链接"
                type="text"
                inputMode="url"
                spellCheck={false}
                autoFocus
              />
              <p className="studio-music-hint">支持公开分享链接，也可以直接输入单曲 ID。</p>
              {error && <p className="studio-music-error" role="alert">{error}</p>}
              <div className="studio-music-form-actions">
                <button type="button" className="studio-music-secondary" onClick={() => setIsEditing(false)}>取消</button>
                <button type="submit" className="studio-music-primary">连接音乐</button>
              </div>
            </form>
          ) : (
            <div className="studio-music-content">
              <div className="studio-music-status">
                <span className="studio-music-status-icon"><StudioIcon name="music" size={16} /></span>
                <span>{target.label}已连接</span>
                <small>公开外链</small>
              </div>
              <iframe
                key={`${target.type}-${target.id}`}
                className={`studio-music-embed ${target.type === "2" ? "is-track" : "is-collection"}`}
                src={getPlayerUrl(target)}
                title={`网易云音乐${target.label}播放器`}
                loading="lazy"
                allow="autoplay; encrypted-media"
                style={{ height: playerHeight }}
              />
              <button type="button" className="studio-music-change" onClick={openEditor}>
                更换播放内容
                <StudioIcon name="arrow" size={17} />
              </button>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        className={`studio-music-launcher${isOpen ? " is-active" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="网易云音乐"
      >
        <span className="studio-music-launcher-icon"><StudioIcon name="music" size={19} /></span>
        <span>音乐</span>
        <i className="studio-music-pulse" aria-hidden="true" />
      </button>
    </div>
  );
}
