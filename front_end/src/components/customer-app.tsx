"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import { SongDTO } from "@/modules/songs/types";
import { UserDTO } from "@/modules/users/types";
import CustomAudioPlayer from "./custom-audio-player";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const Icon = {
  Bell: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.857 17.082A23.848 23.848 0 0112 17.25c-1.01 0-2.006-.067-2.982-.197m5.839 0A23.856 23.856 0 0019.5 15m-2.643 2.082l.262.545A2.25 2.25 0 0115.057 21H8.943a2.25 2.25 0 01-2.062-3.373l.262-.545m0 0A23.85 23.85 0 014.5 15m0 0a6.75 6.75 0 0113.5 0M8.25 21a3.75 3.75 0 007.5 0"
      />
    </svg>
  ),
  Home: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M3 10.5L12 3l9 7.5V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21v-10.5z"
      />
    </svg>
  ),
  Music: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l10-2v13" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  Heart: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 21s-7-4.35-9-8.25C1.5 9 3.75 6 7.5 6A5.6 5.6 0 0112 8a5.6 5.6 0 014.5-2c3.75 0 6 3 4.5 6.75C19 16.65 12 21 12 21z"
      />
    </svg>
  ),
  User: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 3c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
      />
    </svg>
  ),
  Search: (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  ),
};

function TopBar({ user }: { user: UserDTO | null }) {
  const currentUser = user ?? {
    _id: "guest",
    name: "Guest",
    membershipType: "Guest" as const,
    avatar: "https://i.pravatar.cc/60?img=5",
    role: "customer" as const,
  };

  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <div className="flex items-center gap-3">
        <img src={currentUser.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
        <div className="leading-tight">
          <p className="text-sm font-medium text-white/90">{currentUser.name}</p>
          <p className="text-[11px] text-violet-300">{currentUser.membershipType} Member</p>
        </div>
        <div className="mt-1 px-8">
          <p className="text-xl font-semibold leading-tight">Listen The</p>
        </div>
      </div>
      <a
        href="/owner?role=owner"
        className="glass rounded-full p-2 text-white/80 transition hover:text-white hover:shadow-[0_10px_40px_rgba(107,92,255,0.35)]"
      >
        <Icon.Bell className="h-6 w-6" />
      </a>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="mt-5 px-5">
      <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-white/80">
        <Icon.Search className="h-5 w-5" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search Music"
          className="flex-1 bg-transparent outline-none placeholder:text-white/40"
        />
      </div>
    </div>
  );
}

function RecentlyPlayed({ songs, onPlay }: { songs: SongDTO[]; onPlay: (song: SongDTO) => void }) {
  return (
    <div className="mt-7">
      <h3 className="px-5 text-lg font-semibold">Recently Played</h3>
      <div className="mt-3 overflow-x-auto px-5">
        <div className="flex min-w-max gap-4">
          {songs.map((song) => (
            <motion.div key={song._id} whileHover={{ y: -4 }} className="w-28 shrink-0 cursor-pointer" onClick={() => onPlay(song)}>
              <div className="h-28 w-28 overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <img src={song.coverImage} alt={song.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 truncate text-xs text-white/90">{song.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchResults({
  songs,
  onPlay,
  onOrder,
}: {
  songs: SongDTO[];
  onPlay: (song: SongDTO) => void;
  onOrder: (song: SongDTO) => void;
}) {
  return (
    <div className="mt-6">
      <h3 className="px-5 text-lg font-semibold">Search Results</h3>
      <div className="mt-3 flex flex-col gap-3 px-4">
        {songs.length > 0 ? (
          songs.map((song) => (
            <motion.div
              key={song._id}
              whileHover={{ scale: 1.01 }}
              className="glass flex items-center gap-3 rounded-2xl bg-[rgba(17,16,33,0.6)] p-3"
            >
              <img
                src={song.coverImage}
                className="h-16 w-16 rounded-xl object-cover"
                alt="cover"
                onClick={() => onPlay(song)}
              />
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onPlay(song)}>
                <p className="truncate text-sm font-medium">{song.title}</p>
                <p className="truncate text-xs text-white/60">{song.artist}</p>
                <p className="text-[11px] text-white/40">{Intl.NumberFormat().format(song.playCount || 0)} / plays</p>
              </div>
              <button
                onClick={() => onOrder(song)}
                className="rounded-lg bg-[#6b5cff]/20 px-3 py-2 text-xs text-violet-300 transition hover:bg-[#6b5cff]/30 hover:shadow-[0_10px_40px_rgba(107,92,255,0.35)]"
              >
                Order Song
              </button>
            </motion.div>
          ))
        ) : (
          <p className="px-5 text-white/60">No songs found.</p>
        )}
      </div>
    </div>
  );
}

function RecommendedList({
  songs,
  onOrder,
  onPlay,
}: {
  songs: SongDTO[];
  onOrder: (song: SongDTO) => void;
  onPlay: (song: SongDTO) => void;
}) {
  return (
    <div className="mt-6">
      <h3 className="px-5 text-lg font-semibold">Recommend for you</h3>
      <div className="mt-3 ml-2 flex flex-col gap-3 pr-3">
        {/* card Music */}
        {songs.map((song) => (
          <motion.div
            key={song._id}
            whileHover={{ scale: 1.01 }}
            className="glass flex items-center gap-3 rounded-2xl bg-[rgba(17,16,33,0.6)] p-0.8"
          >
            <img src={song.coverImage} className="h-12 w-12 ml-2 rounded-xl object-cover" alt="cover" onClick={() => onPlay(song)} />
            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onPlay(song)}>
              <p className="truncate text-sm font-medium">{song.title}</p>
              <p className="truncate text-xs text-white/60">{song.artist}</p>
              {/* song played how many times ? */}
              <p className="text-[11px] text-white/40">{Intl.NumberFormat().format(song.playCount || 0)} / plays</p>
            </div>
            <button
              onClick={() => onOrder(song)}
              className="rounded-lg bg-[#6b5cff]/20 px-3 py-2 mr-2 text-xs text-violet-300 transition hover:bg-[#6b5cff]/30 hover:shadow-[0_10px_40px_rgba(107,92,255,0.35)]"
            >
              Order Song
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BottomNav() {
  const items = [
    { icon: Icon.Home, label: "Home" },
    { icon: Icon.Music, label: "Music" },
    { icon: Icon.Heart, label: "Favorites" },
    { icon: Icon.User, label: "Profile" },
  ];
  return (
    <div className="fixed bottom-3 left-0 right-0">
      <div className="glass mx-auto w-[92%] rounded-[24px] shadow-[0_10px_40px_rgba(107,92,255,0.35)]">
        <div className="flex items-center justify-around py-3">
          {items.map(({ icon: I, label }) => (
            <button key={label} className="flex flex-col items-center gap-1 text-white/70 hover:text-white">
              <I className="h-5 w-5" />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Player({ song }: { song: SongDTO | null }) {
  if (!song) return null;

  return (
    <div className="fixed bottom-20 left-1/2 flex w-[95%] max-w-4xl -translate-x-1/2 items-center gap-4 rounded-lg bg-gray-800/50 p-2 shadow-lg backdrop-blur-lg">
      <img src={song.coverImage} alt={song.title} className="h-12 w-12 rounded-md object-cover" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{song.title}</p>
        <p className="text-sm text-gray-300 truncate">{song.artist}</p>
      </div>
      {song.previewUrl ? (
        <CustomAudioPlayer 
          src={song.previewUrl} 
          title={song.title}
          artist={song.artist}
        />
      ) : (
        <span className="text-xs text-white/50">No preview</span>
      )}
    </div>
  );
}

export function CustomerApp() {
  const [recent, setRecent] = useState<SongDTO[]>([]);
  const [recommended, setRecommended] = useState<SongDTO[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SongDTO[]>([]);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [toast, setToast] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongDTO | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    const searchTimeout = setTimeout(() => {
      void handleSearch();
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [query]);

  useEffect(() => {
    async function load() {
      const [recentRes, recommendedRes, userRes] = await Promise.all([
        fetch("/api/songs/recent?limit=10", { cache: "no-store" }),
        fetch("/api/songs/recommended?limit=10", { cache: "no-store" }),
        fetch("/api/users/demo?role=customer", { cache: "no-store" }),
      ]);

      const recentJson = (await recentRes.json()) as ApiResponse<SongDTO[]>;
      const recommendedJson = (await recommendedRes.json()) as ApiResponse<SongDTO[]>;
      const userJson = (await userRes.json()) as ApiResponse<UserDTO>;

      setRecent(recentJson.data ?? []);
      setRecommended(recommendedJson.data ?? []);
      setUser(userJson.data ?? null);
    }
    load().catch(() => setToast("Failed to load app data"));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSearch() {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}&limit=25`, {
        cache: "no-store",
      });
      const payload = (await res.json()) as ApiResponse<SongDTO[]>;
      setSearchResults(payload.data ?? []);
    } catch {
      setToast("Search failed");
    }
  }

  async function handlePlay(song: SongDTO) {
    setCurrentSong(song);
    await fetch(`/api/songs/${song._id}/play`, {
      method: "POST",
    }).catch(() => null);
  }

  async function handleOrder(song: SongDTO) {
    if (!user?._id) {
      setToast("User unavailable");
      return;
    }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: user._id, songId: song._id }),
      });
      const payload = (await res.json()) as ApiResponse<unknown>;
      if (!payload.success) {
        setToast(payload.message ?? "Order failed");
        return;
      }
      setToast(`Queued: ${song.title}`);
      setQuery("");
      setIsSearching(false);
    } catch {
      setToast("Order failed");
    }
  }

  return (
    <div className="pb-28">
      <TopBar user={user} />
      <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
      {isSearching || query ? (
        <SearchResults songs={searchResults} onPlay={handlePlay} onOrder={handleOrder} />
      ) : (
        <>
          <RecentlyPlayed songs={recent} onPlay={handlePlay} />
          <RecommendedList songs={recommended} onOrder={handleOrder} onPlay={handlePlay} />
        </>
      )}
      <Player song={currentSong} />
      <BottomNav />
      {toast ? (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-lg bg-[#6b5cff]/30 px-4 py-2 text-violet-200 backdrop-blur"
        >
          {toast}
        </motion.div>
      ) : null}
    </div>
  );
}
