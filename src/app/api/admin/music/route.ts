import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAYLIST_ID = "2189580019";
const SOURCE_URL = `https://music.163.com/playlist?id=${PLAYLIST_ID}`;
const NETEASE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
  Referer: "https://music.163.com/",
};

type PlaylistResponse = {
  code: number;
  playlist?: {
    name?: string;
    trackIds?: Array<{ id: number }>;
  };
};

type SongDetail = {
  id: number;
  name: string;
  duration?: number;
  dt?: number;
  artists?: Array<{ name: string }>;
  ar?: Array<{ name: string }>;
  album?: { name?: string; picUrl?: string };
  al?: { name?: string; picUrl?: string };
};

type SongDetailResponse = {
  code: number;
  songs?: SongDetail[];
};

type PlayerResponse = {
  code: number;
  data?: Array<{
    id: number;
    url?: string | null;
    time?: number;
    freeTrialInfo?: unknown;
  }>;
};

async function fetchNetease<T>(url: string) {
  const response = await fetch(url, {
    headers: NETEASE_HEADERS,
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`NetEase request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function playerUrl(ids: number[]) {
  const params = new URLSearchParams({ ids: JSON.stringify(ids), br: "320000" });
  return `https://music.163.com/api/song/enhance/player/url?${params.toString()}`;
}

function detailUrl(ids: number[]) {
  const params = new URLSearchParams({ ids: JSON.stringify(ids) });
  return `https://music.163.com/api/song/detail?${params.toString()}`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "请先登录后台。" }, { status: 401 });
  }

  try {
    const playlist = await fetchNetease<PlaylistResponse>(
      `https://music.163.com/api/v6/playlist/detail?id=${PLAYLIST_ID}&n=1000&s=0`,
    );
    const trackIds = playlist.playlist?.trackIds?.map((track) => track.id).filter(Number.isFinite) ?? [];
    if (!trackIds.length) throw new Error("Playlist is empty");

    const candidates = shuffle(trackIds);
    const selected: Array<{
      id: number;
      name: string;
      artist: string;
      album: string;
      cover: string;
      url: string;
      duration: number;
    }> = [];

    for (let offset = 0; offset < Math.min(candidates.length, 180) && selected.length < 5; offset += 30) {
      const batch = candidates.slice(offset, offset + 30);
      const [detailResponse, playerResponse] = await Promise.all([
        fetchNetease<SongDetailResponse>(detailUrl(batch)),
        fetchNetease<PlayerResponse>(playerUrl(batch)),
      ]);
      const detailMap = new Map((detailResponse.songs ?? []).map((song) => [song.id, song]));
      const mediaMap = new Map((playerResponse.data ?? []).map((media) => [media.id, media]));

      for (const id of batch) {
        if (selected.length >= 5) break;
        const song = detailMap.get(id);
        const media = mediaMap.get(id);
        if (!song || !media?.url || media.freeTrialInfo) continue;

        const album = song.album ?? song.al;
        const artists = song.artists ?? song.ar ?? [];
        selected.push({
          id,
          name: song.name,
          artist: artists.map((artist) => artist.name).filter(Boolean).join(" / ") || "未知音乐人",
          album: album?.name || "网易云音乐",
          cover: album?.picUrl ? `${album.picUrl}?param=180y180` : "",
          url: media.url.replace(/^http:\/\//, "https://"),
          duration: media.time || song.duration || song.dt || 0,
        });
      }
    }

    if (selected.length < 5) throw new Error("Not enough playable tracks");

    return NextResponse.json(
      {
        playlistName: playlist.playlist?.name || "我的歌单",
        sourceUrl: SOURCE_URL,
        tracks: selected,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Failed to prepare NetEase music queue", error);
    return NextResponse.json(
      { error: "暂时无法从网易云获取可播放歌曲，请稍后重新随机。" },
      { status: 502 },
    );
  }
}
