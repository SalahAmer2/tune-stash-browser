import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Heart, Music } from 'lucide-react';
import { Track } from '@/types/Track';

interface TrackDetailsProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (track: Track) => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const TrackDetails: React.FC<TrackDetailsProps> = ({ 
  track, 
  isOpen, 
  onClose, 
  onPlay,
  onToggleFavorite,
  isFavorite = false 
}) => {
  const [imageError, setImageError] = useState(false);

  if (!track) return null;

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFavoriteClick = () => {
    console.log('Track details favorite clicked for:', track.trackName, 'Current favorite status:', isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Track Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <img
              src={getImageSrc()}
              alt={track.trackName}
              className="w-full aspect-square object-cover rounded-lg shadow-xl"
              onError={handleImageError}
            />
            
            <div className="flex gap-3">
              <Button 
                onClick={() => onPlay(track)}
                className="flex-1 play-button"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Play Preview
              </Button>
              
              {onToggleFavorite && (
                <Button
                  onClick={handleFavoriteClick}
                  variant={isFavorite ? "default" : "outline"}
                  className={`px-4 ${isFavorite ? 'bg-primary hover:bg-primary/80 text-black' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{track.trackName}</h2>
              <p className="text-lg text-gray-300">{track.artistName}</p>
              <p className="text-gray-400">{track.collectionName}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Genre:</span>
                <span className="text-white">{track.primaryGenreName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{formatDuration(track.trackTimeMillis)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Release Date:</span>
                <span className="text-white">{formatDate(track.releaseDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Country:</span>
                <span className="text-white">{track.country}</span>
              </div>
              
              {track.trackPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white">{track.currency} {track.trackPrice}</span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(track.trackViewUrl, '_blank')}
              >
                <Music className="w-4 h-4 mr-2" />
                View in iTunes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackDetails;
