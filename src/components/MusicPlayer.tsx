
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
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

  const getImageSrc = () => {
    // Try different image sizes from iTunes API
    if (currentTrack?.artworkUrl600) {
      return currentTrack.artworkUrl600;
    }
    if (currentTrack?.artworkUrl100) {
      return currentTrack.artworkUrl100;
    }
    if (currentTrack?.artworkUrl60) {
      return currentTrack.artworkUrl60;
    }
    if (currentTrack?.artworkUrl30) {
      return currentTrack.artworkUrl30;
    }
    
    // Use podcast-themed placeholder
    return `https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=60&h=60&fit=crop&crop=center`;
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

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 p-4 shadow-xl">
      <audio ref={audioRef} />
      
      <div className="container mx-auto flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={getImageSrc()}
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
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 bg-gray-700 rounded-full h-2 cursor-pointer hover:h-3 transition-all duration-200 relative"
            onClick={handleSeek}
          >
            <div
              className="bg-primary h-full rounded-full transition-all duration-100 relative"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Progress dot */}
              <div 
                className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-primary shadow-lg"
                style={{ display: progressPercentage > 0 ? 'block' : 'none' }}
              />
            </div>
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
