import { useState, useRef, useEffect } from 'react';

interface CustomAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
}

/**
 * Custom audio player component with seek bar and clickable area to start playback
 * - Clicking on the title/artist area or the play icon toggles play/pause
 * - Designed to start playback on first real user click (browser autoplay policy friendly)
 */
export default function CustomAudioPlayer({ src, title, artist }: CustomAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset player state and audio element when src (song) changes
  useEffect(() => {
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  /**
   * Toggle between play and pause
   * Called when user clicks anywhere on the player header area
   */
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Pause the audio and update UI
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Try to start playback – handle browser autoplay restrictions
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Only update state when playback actually starts
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Playback was blocked by the browser:', err);
            // You could show a message like "Click again to play" here
          });
      }
    }
  };

  /**
   * Update current time display as audio plays
   */
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  //  Handle user dragging the seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  /**
   * Format seconds into MM:SS string
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md">

      {/* Hidden native audio element – we control it manually */}
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Clickable header area – clicking anywhere here toggles playback */}
      <div
        className="flex items-center justify-between mb-0 cursor-pointer"
        onClick={togglePlay}
      >
        {/* Song info */}
        <div className="truncate max-w-[65%]">
          <p className="font-semibold text-white truncate">
            {title || 'Unknown Title'}
          </p>
          <p className="text-sm text-gray-300 truncate">
            {artist || 'Unknown Artist'}
          </p>
        </div>

        {/* Play / Pause icon indicator (click also toggles via parent) */}
        <div className="p-1 rounded-full bg-indigo-600 flex-shrink-0 pointer-events-none">
          {isPlaying ? (
            // Pause icon
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            // Play icon
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-300 w-10 font-mono">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          // Prevent seek clicks from triggering play/pause
          onClick={(e) => e.stopPropagation()}
          className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        <span className="text-xs text-gray-300 w-10 font-mono">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}