
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Track } from '@/types/Track';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseFavorites = () => {
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tracks: Track[] = data?.map(fav => ({
        trackId: fav.track_id,
        trackName: fav.track_name,
        artistName: fav.artist_name,
        collectionName: fav.collection_name || '',
        artworkUrl100: fav.artwork_url || '',
        artworkUrl60: fav.artwork_url || '',
        previewUrl: fav.preview_url || '',
        trackTimeMillis: fav.track_time_millis || 0,
        primaryGenreName: fav.primary_genre_name || '',
        releaseDate: fav.release_date || '',
        country: fav.country || '',
        currency: fav.currency || '',
        trackPrice: fav.track_price || 0,
        collectionPrice: 0,
        trackViewUrl: fav.track_view_url || '',
        collectionViewUrl: '',
      })) || [];

      setFavorites(tracks);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (track: Track) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          track_id: track.trackId,
          track_name: track.trackName,
          artist_name: track.artistName,
          collection_name: track.collectionName,
          artwork_url: track.artworkUrl100,
          preview_url: track.previewUrl,
          track_time_millis: track.trackTimeMillis,
          primary_genre_name: track.primaryGenreName,
          release_date: track.releaseDate,
          country: track.country,
          currency: track.currency,
          track_price: track.trackPrice,
          track_view_url: track.trackViewUrl,
        });

      if (error) throw error;

      setFavorites(prev => [track, ...prev]);
      toast({
        title: "Added to favorites",
        description: `${track.trackName} by ${track.artistName}`,
      });
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already in favorites",
          description: "This track is already in your favorites",
          variant: "destructive",
        });
      } else {
        console.error('Error adding to favorites:', error);
        toast({
          title: "Error",
          description: "Failed to add to favorites",
          variant: "destructive",
        });
      }
    }
  };

  const removeFromFavorites = async (trackId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', trackId);

      if (error) throw error;

      setFavorites(prev => prev.filter(track => track.trackId !== trackId));
      toast({
        title: "Removed from favorites",
        description: "Track removed from your favorites",
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (trackId: number) => {
    return favorites.some(track => track.trackId === trackId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
};
