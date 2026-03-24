import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "WaveGen",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-neon-blue p-6 font-mono">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 border border-neon-pink p-1">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover grayscale contrast-125 ${isPlaying ? 'animate-pulse' : ''}`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-0 left-0 w-full h-full border border-neon-blue/30 pointer-events-none" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-pixel text-neon-blue truncate glitch-text">{currentTrack.title}</h3>
            <p className="text-neon-pink text-[10px] mt-1 font-pixel opacity-70">{currentTrack.artist}</p>
            
            <div className="mt-4 flex items-center gap-4">
              <button onClick={prevTrack} className="text-neon-blue hover:text-white transition-colors">
                <SkipBack size={18} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-8 h-8 flex items-center justify-center border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all"
              >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="text-neon-blue hover:text-white transition-colors">
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-end gap-1 h-8 px-1 border-b border-neon-blue/20">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-neon-blue/40"
              animate={{ 
                height: isPlaying ? [
                  Math.random() * 100 + "%", 
                  Math.random() * 100 + "%", 
                  Math.random() * 100 + "%"
                ] : "10%" 
              }}
              transition={{ 
                duration: 0.3, 
                repeat: Infinity, 
                ease: "steps(4)",
                delay: i * 0.02
              }}
            />
          ))}
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
          {TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center gap-3 p-2 border ${
                currentTrackIndex === index 
                  ? 'border-neon-pink bg-neon-pink/10 text-neon-pink' 
                  : 'border-neon-blue/20 text-neon-blue/60 hover:border-neon-blue/50'
              }`}
            >
              <div className="text-[10px] font-pixel">
                {index + 1}.
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[10px] font-pixel truncate">
                  {track.title}
                </div>
              </div>
              {currentTrackIndex === index && isPlaying && (
                <div className="w-2 h-2 bg-neon-pink animate-ping" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-[8px] text-neon-blue/40 font-pixel">
        <div className="flex items-center gap-2">
          <Music2 size={10} />
          <span>SIGNAL_READY</span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 size={10} />
          <span>BITRATE_MAX</span>
        </div>
      </div>
    </div>
  );
}
