
import React, { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import { Track } from '@/types/Track';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onShowDetails: (track: Track) => void;
  onToggleFavorite?: (track: Track) => void;
  isFavorite?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ 
  track, 
  onPlay, 
  onShowDetails, 
  onToggleFavorite,
  isFavorite = false 
}) => {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Favorite clicked for track:', track.trackName, 'Current favorite status:', isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(track);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !track.artworkUrl100) {
      return `https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop&crop=center`;
    }
    return track.artworkUrl100;
  };

  return (
    <div 
      className="music-card cursor-pointer group relative"
      onClick={() => onShowDetails(track)}
    >
      <div className="relative">
        <img
          src={getImageSrc()}
          alt={track.trackName}
          className="w-full aspect-square object-cover rounded-lg mb-4 shadow-lg"
          onError={handleImageError}
        />
        
        {/* Play button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(track);
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-lg"
        >
          <div className="play-button">
            <Play className="w-6 h-6 fill-current" />
          </div>
        </button>

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-primary text-black' 
                : 'bg-black/70 text-white hover:bg-black/90'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
          {track.trackName}
        </h3>
        <p className="text-sm text-gray-400 truncate">
          {track.artistName}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {track.collectionName}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{track.primaryGenreName}</span>
          <span>{formatDuration(track.trackTimeMillis)}</span>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
