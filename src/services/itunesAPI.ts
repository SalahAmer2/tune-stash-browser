import { ITunesResponse } from '@/types/Track';

const BASE_URL = 'https://itunes.apple.com/search';

export const searchTracks = async (query: string, limit: number = 50): Promise<ITunesResponse> => {
  try {
    const params = new URLSearchParams({
      term: query,
      media: 'podcast',
      entity: 'podcast',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch podcasts');
    }

    const data: ITunesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
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
      entity: 'podcast',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending podcasts');
    }

    const data: ITunesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending podcasts:', error);
    throw error;
  }
};

export const getPodcastsByGenre = async (genre: string, limit: number = 20): Promise<ITunesResponse> => {
  try {
    const params = new URLSearchParams({
      term: `${genre} podcast`,
      media: 'podcast',
      entity: 'podcast',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${genre} podcasts`);
    }

    const data: ITunesResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${genre} podcasts:`, error);
    throw error;
  }
};
