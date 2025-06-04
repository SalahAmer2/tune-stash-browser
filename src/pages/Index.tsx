
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import TrackCard from '@/components/TrackCard';
import TrackDetails from '@/components/TrackDetails';
import MusicPlayer from '@/components/MusicPlayer';
import { searchTracks } from '@/services/itunesAPI';
import { Track } from '@/types/Track';
import { useFavorites } from '@/hooks/useFavorites';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('pop music');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites } = useFavorites();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tracks', searchQuery],
    queryFn: () => searchTracks(searchQuery),
    enabled: !!searchQuery,
  });

  useEffect(() => {
    console.log('Current search query:', searchQuery);
    console.log('API Response:', data);
  }, [searchQuery, data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowFavorites(false);
  };

  const handlePlay = (track: Track) => {
    console.log('Playing track:', track.trackName);
    setCurrentTrack(track);
  };

  const handleShowDetails = (track: Track) => {
    setSelectedTrack(track);
    setShowDetails(true);
  };

  const tracksToShow = showFavorites ? favorites : (data?.results || []);

  return (
    <div className="min-h-screen pb-24">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowFavorites(false)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              !showFavorites 
                ? 'bg-primary text-black font-medium' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Browse Music
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              showFavorites 
                ? 'bg-primary text-black font-medium' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {/* Content */}
        {showFavorites ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Your Favorite Tracks</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400 mb-4">No favorites yet</p>
                <p className="text-gray-500">Add some tracks to your favorites to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favorites.map((track) => (
                  <TrackCard
                    key={track.trackId}
                    track={track}
                    onPlay={handlePlay}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              {searchQuery === 'pop music' ? 'Popular Music' : `Results for "${searchQuery}"`}
            </h2>
            
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="music-card animate-pulse">
                    <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-xl text-red-400 mb-4">Failed to load tracks</p>
                <p className="text-gray-500">Please try again later</p>
              </div>
            )}

            {data && !isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracksToShow.map((track) => (
                  <TrackCard
                    key={track.trackId}
                    track={track}
                    onPlay={handlePlay}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            )}

            {data && data.results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400 mb-4">No tracks found</p>
                <p className="text-gray-500">Try searching for something else</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Track Details Modal */}
      <TrackDetails
        track={selectedTrack}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onPlay={handlePlay}
      />

      {/* Music Player */}
      <MusicPlayer currentTrack={currentTrack} />
    </div>
  );
};

export default Index;
