
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
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
    // Try different image sizes from iTunes API
    if (imageError) {
      // Use a podcast-themed placeholder instead of music
      return `https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=400&fit=crop&crop=center`;
    }
    
    // Try to get higher resolution image first
    if (track.artworkUrl600) {
      return track.artworkUrl600;
    }
    if (track.artworkUrl100) {
      return track.artworkUrl100;
    }
    if (track.artworkUrl60) {
      return track.artworkUrl60;
    }
    if (track.artworkUrl30) {
      return track.artworkUrl30;
    }
    
    // If no artwork URL available, use placeholder
    return `https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=400&fit=crop&crop=center`;
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
          className="w-full aspect-square object-cover rounded-lg mb-4 shadow-lg group-hover:opacity-80 transition-opacity duration-300"
          onError={handleImageError}
        />

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
