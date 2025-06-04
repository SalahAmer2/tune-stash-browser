
import { useState, useEffect } from 'react';
import { Track } from '@/types/Track';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Track[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('tune-stash-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Track[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('tune-stash-favorites', JSON.stringify(newFavorites));
  };

  const addToFavorites = (track: Track) => {
    const newFavorites = [...favorites, track];
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (trackId: number) => {
    const newFavorites = favorites.filter(track => track.trackId !== trackId);
    saveFavorites(newFavorites);
  };

  const clearFavorites = () => {
    saveFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
  };
};
