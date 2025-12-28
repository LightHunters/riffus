import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const API_BASE = 'http://localhost:3000'

function useApi() {
  const client = useMemo(() => axios.create({ baseURL: API_BASE }), [])
  return client
}

const Icon = {
  Bell: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.857 17.082A23.848 23.848 0 0112 17.25c-1.01 0-2.006-.067-2.982-.197m5.839 0A23.856 23.856 0 0019.5 15m-2.643 2.082l.262.545A2.25 2.25 0 0115.057 21H8.943a2.25 2.25 0 01-2.062-3.373l.262-.545m0 0A23.85 23.85 0 014.5 15m0 0a6.75 6.75 0 0113.5 0M8.25 21a3.75 3.75 0 007.5 0"/>
    </svg>
  ),
  Home: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10.5L12 3l9 7.5V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21v-10.5z"/>
    </svg>
  ),
  Music: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l10-2v13"/>
      <circle cx="7" cy="19" r="2"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  ),
  Heart: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21s-7-4.35-9-8.25C1.5 9 3.75 6 7.5 6A5.6 5.6 0 0112 8a5.6 5.6 0 014.5-2c3.75 0 6 3 4.5 6.75C19 16.65 12 21 12 21z"/>
    </svg>
  ),
  User: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 3c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
    </svg>
  ),
  Search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7"/>
      <path d="M20 20l-3-3"/>
    </svg>
  )
}

function TopBar({ user }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <div className="flex items-center gap-3">
        <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
        <div className="leading-tight">
          <p className="text-sm text-white/90 font-medium">{user.name}</p>
          <p className="text-[11px] text-violet-300">{user.membershipType} Member</p>
        </div>
        <div className="px-8 mt-1">
          <p className="text-xl font-semibold leading-tight">Listen The{` `}</p>
        </div>
      </div>
      <div className="p-2 rounded-full glass text-white/80 hover:text-white hover:shadow-glow transition">
        <Icon.Bell className="w-6 h-6"/>
      </div>
    </div>
  )
}

function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="px-5 mt-5">
      <div className="flex items-center gap-3 glass rounded-xl px-4 py-3 text-white/80">
        <Icon.Search className="w-5 h-5"/>
        <input value={value} onChange={e=>onChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSearch()} placeholder="Search Music" className="flex-1 bg-transparent outline-none placeholder:text-white/40"/>
      </div>
    </div>
  )
}

function RecentlyPlayed({ songs, onPlay }) {
  return (
    <div className="mt-7">
      <h3 className="px-5 text-lg font-semibold">Recently Played</h3>
      <div className="mt-3 px-5 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {songs.map((s) => (
            <motion.div key={s.spotifyId || s._id || `${s.title}-${s.artist}`} whileHover={{ y: -4 }} className="w-28 shrink-0" onClick={() => onPlay(s)}>
              <div className="w-28 h-28 rounded-xl overflow-hidden shadow-soft">
                <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover"/>
              </div>
              <p className="mt-2 text-xs text-white/90 line-clamp-2">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchResults({ songs, onPlay, onOrder }) {
  return (
    <div className="mt-6">
      <h3 className="px-5 text-lg font-semibold">Search Results</h3>
      <div className="mt-3 px-4 flex flex-col gap-3">
        {songs.length > 0 ? (
          songs.map((s) => (
            <motion.div
              key={s.spotifyId || s._id || `${s.title}-${s.artist}`}
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl bg-brand-card/60 glass p-3 flex items-center gap-3"
            >
              <img src={s.coverImage} className="w-16 h-16 rounded-xl object-cover" alt="cover" onClick={() => onPlay(s)}/>
              <div className="flex-1 min-w-0" onClick={() => onPlay(s)}>
                <p className="text-sm font-medium truncate">{s.title}</p>
                <p className="text-xs text-white/60 truncate">{s.artist}</p>
                <p className="text-[11px] text-white/40">{Intl.NumberFormat().format(s.playCount || 0)} / plays</p>
              </div>
              <button onClick={() => onOrder(s)} className="px-3 py-2 rounded-lg bg-[#6b5cff]/20 text-violet-300 hover:bg-[#6b5cff]/30 hover:shadow-glow transition text-xs">
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

function RecommendedList({ songs, onOrder, onPlay }) {
  return (
    <div className="mt-6">
      <h3 className="px-5 text-lg font-semibold">Recommend for you</h3>
      <div className="mt-3 ml-2 pr-16 flex flex-col gap-3">
        {songs.map((s) => (
          <motion.div
            key={s.spotifyId || s._id || `${s.title}-${s.artist}`}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-brand-card/60 glass p-1 flex items-center gap-3"
          >
            <img src={s.coverImage} className="w-12 h-12 rounded-xl object-cover" alt="cover" onClick={() => onPlay(s)}/>
            <div className="flex-1 min-w-0" onClick={() => onPlay(s)}>
              <p className="text-sm font-medium truncate">{s.title}</p>
              <p className="text-xs text-white/60 truncate">{s.artist}</p>
              <p className="text-[11px] text-white/40">{Intl.NumberFormat().format(s.playCount || 0)} / plays</p>
            </div>
            <button onClick={() => onOrder(s)} className="px-3 py-2 pr-36 rounded-lg bg-[#6b5cffd]/20 text-violet-300 hover:bg-[#6b5cff]/30 hover:shadow-glow transition text-xs">
              Order Song
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function BottomNav() {
  const items = [
    { icon: Icon.Home, label: 'Home' },
    { icon: Icon.Music, label: 'Music' },
    { icon: Icon.Heart, label: 'Favorites' },
    { icon: Icon.User, label: 'Profile' },
  ]
  return (
    <div className="fixed left-0 right-0 bottom-3">
      <div className="mx-auto w-[92%] glass rounded-[24px] shadow-glow">
        <div className="flex items-center justify-around py-3">
          {items.map(({ icon: I, label }) => (
            <button key={label} className="flex flex-col items-center gap-1 text-white/70 hover:text-white">
              <I className="w-5 h-5"/>
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Player({ song }) {
  if (!song) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 shadow-lg flex items-center gap-4">
      <img src={song.coverImage} alt={song.title} className="w-16 h-16 rounded-md object-cover" />
      <div className="flex-1">
        <p className="font-semibold text-white">{song.title}</p>
        <p className="text-sm text-gray-300">{song.artist}</p>
      </div>
      <audio controls autoPlay src={song.previewUrl || ''} className="w-full max-w-xs">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default function App() {
  const api = useApi()
  const [recent, setRecent] = useState([])
  const [recommended, setRecommended] = useState([])
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState({ name: 'Guest', membershipType: 'Gold', avatar: 'https://i.pravatar.cc/60?img=5', _id: '66c30d17231e48ba9d95a2e2' })
  const [toast, setToast] = useState('')
  const [isSearching, setIsSearching] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    if (query) {
      const searchTimeout = setTimeout(() => {
        handleSearch();
      }, 300); // 300ms debounce
      return () => clearTimeout(searchTimeout);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [query]);

  useEffect(() => {
    async function load() {
      try {
        const [r1, r2] = await Promise.all([
          api.get('/api/songs/recent'),
          api.get('/api/songs/recommended'),
        ])
        setRecent(r1.data)
        setRecommended(r2.data)
      } catch (e) {
        console.error('Failed to load initial lists', e)
      }
    }
    load()
  }, [api])

  async function handleSearch() {
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.get(`/api/songs/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error('Failed to search songs', error);
      setToast('Search failed');
      setTimeout(() => setToast(''), 2000);
    }
  }

  async function handlePlay(song) {
    // set current song immediately so audio starts
    setCurrentSong(song);

    // Try to notify backend about the play (API-only endpoint)
    try {
      // prefer sending spotifyId & previewUrl; backend is API-only
      await api.post('/api/songs/play', {
        spotifyId: song.spotifyId,
        previewUrl: song.previewUrl,
        title: song.title,
        artist: song.artist,
        album: song.album,
      });
      // Optionally refresh recent list if backend maintains it (skip if backend is stateless)
      // const res = await api.get('/api/songs/recent');
      // setRecent(res.data);
    } catch (error) {
      // Do not interrupt playback if backend fails; just log
      console.error('Failed to notify server about play', error);
    }
  }

  async function handleOrder(song) {
    try {
      const res = await api.post('/api/songs/order', {
        userId: user._id,
        spotifyId: song.spotifyId,
        title: song.title,
        artist: song.artist,
      })
      if (res.status === 201) {
        setToast(`Queued: ${song.title}`)
        setQuery('');
        setIsSearching(false);
        setTimeout(() => setToast(''), 2000)
      }
    } catch (e) {
      setToast('Order failed')
      setTimeout(() => setToast(''), 2000)
    }
  }

  return (
    <div className="pb-28">
      <TopBar user={user} />
      <div className="px-5 mt-4"></div>
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

      {toast && (
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="fixed left-1/2 -translate-x-1/2 bottom-24 px-4 py-2 rounded-lg bg-[#6b5cff]/30 text-violet-200 backdrop-blur">
          {toast}
        </motion.div>
      )}
    </div>
  )
}
