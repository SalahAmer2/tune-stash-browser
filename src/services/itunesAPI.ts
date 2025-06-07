
import { ITunesResponse } from '@/types/Track';

const BASE_URL = 'https://itunes.apple.com/search';

export const searchTracks = async (query: string, limit: number = 50): Promise<ITunesResponse> => {
  try {
    const params = new URLSearchParams({
      term: query,
      media: 'podcast',
      entity: 'podcastEpisode',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch podcast episodes');
    }

    const data: ITunesResponse = await response.json();
    // Filter out episodes without preview URLs to ensure they're playable
    const playableEpisodes = {
      ...data,
      results: data.results.filter(episode => episode.previewUrl)
    };
    return playableEpisodes;
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    throw error;
  }
};

export const searchByArtist = async (artist: string, limit: number = 50): Promise<ITunesResponse> => {
  return searchTracks(`artist:${artist}`, limit);
};

export const searchByAlbum = async (album: string, limit: number = 50): Promise<ITunesResponse> => {
  return searchTracks(`album:${album}`, limit);
};

export const getTrendingPodcasts = async (limit: number = 20): Promise<ITunesResponse> => {
  try {
    const params = new URLSearchParams({
      term: 'podcast',
      media: 'podcast',
      entity: 'podcastEpisode',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending podcast episodes');
    }

    const data: ITunesResponse = await response.json();
    // Filter out episodes without preview URLs to ensure they're playable
    const playableEpisodes = {
      ...data,
      results: data.results.filter(episode => episode.previewUrl)
    };
    return playableEpisodes;
  } catch (error) {
    console.error('Error fetching trending podcast episodes:', error);
    throw error;
  }
};

export const getPodcastsByGenre = async (genre: string, limit: number = 20): Promise<ITunesResponse> => {
  try {
    const params = new URLSearchParams({
      term: `${genre} podcast`,
      media: 'podcast',
      entity: 'podcastEpisode',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${genre} podcast episodes`);
    }

    const data: ITunesResponse = await response.json();
    // Filter out episodes without preview URLs to ensure they're playable
    const playableEpisodes = {
      ...data,
      results: data.results.filter(episode => episode.previewUrl)
    };
    return playableEpisodes;
  } catch (error) {
    console.error(`Error fetching ${genre} podcast episodes:`, error);
    throw error;
  }
};
