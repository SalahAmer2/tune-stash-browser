
export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  artworkUrl60: string;
  artworkUrl30: string;
  artworkUrl600: string;
  previewUrl: string;
  trackTimeMillis: number;
  primaryGenreName: string;
  releaseDate: string;
  country: string;
  currency: string;
  trackPrice: number;
  collectionPrice: number;
  trackViewUrl: string;
  collectionViewUrl: string;
}

export interface ITunesResponse {
  resultCount: number;
  results: Track[];
}
