
import { ITunesResponse } from '@/types/Track';

const BASE_URL = 'https://itunes.apple.com/search';

export const searchTracks = async (query: string, limit: number = 50): Promise<ITunesResponse> => {
  try {
    const params = new URLSearchParams({
      term: query,
      media: 'music',
      entity: 'song',
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }

    const data: ITunesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
};

export const searchByArtist = async (artist: string, limit: number = 50): Promise<ITunesResponse> => {
  return searchTracks(`artist:${artist}`, limit);
};

export const searchByAlbum = async (album: string, limit: number = 50): Promise<ITunesResponse> => {
  return searchTracks(`album:${album}`, limit);
};
