
import React, { useState, useRef, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { Track } from '@/types/Track';
import { useFavorites } from '@/hooks/useFavorites';

interface MusicPlayerProps {
  currentTrack: Track | null;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite = currentTrack ? favorites.some(fav => fav.trackId === currentTrack.trackId) : false;

  useEffect(() => {
    if (audioRef.current && currentTrack?.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFavoriteClick = () => {
    if (!currentTrack) return;
    
    console.log('Music player favorite clicked for:', currentTrack.trackName, 'Current favorite status:', isFavorite);
    if (isFavorite) {
      removeFromFavorites(currentTrack.trackId);
      console.log('Removed from favorites in player');
    } else {
      addToFavorites(currentTrack);
      console.log('Added to favorites in player');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 p-4">
        <div className="container mx-auto text-center text-gray-400">
          Select a track to start playing
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 p-4 shadow-xl">
      <audio ref={audioRef} />
      
      <div className="container mx-auto flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={currentTrack.artworkUrl60}
            alt={currentTrack.trackName}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{currentTrack.trackName}</p>
            <p className="text-sm text-gray-400 truncate">{currentTrack.artistName}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={togglePlayPause}
            className="play-button w-12 h-12 flex items-center justify-center"
          >
            <Play className={`w-6 h-6 fill-current ${isPlaying ? 'hidden' : 'block'}`} />
            <div className={`w-2 h-6 bg-current ${isPlaying ? 'block' : 'hidden'}`} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 bg-gray-700 rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
