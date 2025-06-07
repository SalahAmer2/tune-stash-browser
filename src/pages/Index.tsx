import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import TrackCard from '@/components/TrackCard';
import TrackDetails from '@/components/TrackDetails';
import MusicPlayer from '@/components/MusicPlayer';
import SearchHistory from '@/components/SearchHistory';
import { searchTracks, getTrendingPodcasts, getPodcastsByGenre } from '@/services/itunesAPI';
import { Track } from '@/types/Track';
import { useSupabaseFavorites } from '@/hooks/useSupabaseFavorites';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useSupabaseFavorites();
  const { addToSearchHistory } = useSearchHistory();

  const { data: searchData, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: ['podcasts', searchQuery],
    queryFn: () => searchTracks(searchQuery),
    enabled: !!searchQuery,
  });

  const { data: trendingPodcasts, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-podcasts'],
    queryFn: () => getTrendingPodcasts(20),
    enabled: !searchQuery && !showFavorites,
  });

  const { data: comedyPodcasts } = useQuery({
    queryKey: ['comedy-podcasts'],
    queryFn: () => getPodcastsByGenre('comedy', 20),
    enabled: !searchQuery && !showFavorites,
  });

  const { data: businessPodcasts } = useQuery({
    queryKey: ['business-podcasts'],
    queryFn: () => getPodcastsByGenre('business', 20),
    enabled: !searchQuery && !showFavorites,
  });

  const { data: technologyPodcasts } = useQuery({
    queryKey: ['technology-podcasts'],
    queryFn: () => getPodcastsByGenre('technology', 20),
    enabled: !searchQuery && !showFavorites,
  });

  useEffect(() => {
    console.log('Current search query:', searchQuery);
    console.log('API Response:', searchData);
    
    // Add to search history when search completes
    if (searchData && searchQuery) {
      addToSearchHistory(searchQuery, searchData.results.length);
    }
  }, [searchQuery, searchData, addToSearchHistory]);

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

  const handleToggleFavorite = (track: Track) => {
    if (isFavorite(track.trackId)) {
      removeFromFavorites(track.trackId);
    } else {
      addToFavorites(track);
    }
  };

  const tracksToShow = showFavorites ? favorites : (searchData?.results || []);

  const renderPodcastRow = (title: string, podcasts: Track[] | undefined, isLoading: boolean = false) => (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
      {isLoading ? (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="music-card animate-pulse">
                <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {podcasts?.slice(0, 10).map((track) => (
            <div key={track.trackId} className="flex-shrink-0 w-48">
              <TrackCard
                track={track}
                onPlay={handlePlay}
                onShowDetails={handleShowDetails}
                onToggleFavorite={user ? handleToggleFavorite : undefined}
                isFavorite={user ? isFavorite(track.trackId) : false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
            {searchQuery ? 'Search Results' : 'Browse Podcasts'}
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

        {/* Search History - only show when not searching and not showing favorites */}
        {!searchQuery && !showFavorites && user && (
          <SearchHistory onSelectQuery={handleSearch} />
        )}

        {/* Content */}
        {showFavorites ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Your Favorite Podcasts</h2>
            {!user ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400 mb-4">Sign in to view your favorites</p>
                <p className="text-gray-500">Sign in with email to save your favorite podcasts</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400 mb-4">No favorites yet</p>
                <p className="text-gray-500">Add some podcasts to your favorites to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favorites.map((track) => (
                  <TrackCard
                    key={track.trackId}
                    track={track}
                    onPlay={handlePlay}
                    onShowDetails={handleShowDetails}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : searchQuery ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Podcast results for "{searchQuery}"
            </h2>
            
            {searchLoading && (
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

            {searchError && (
              <div className="text-center py-12">
                <p className="text-xl text-red-400 mb-4">Failed to load podcasts</p>
                <p className="text-gray-500">Please try again later</p>
              </div>
            )}

            {searchData && !searchLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracksToShow.map((track) => (
                  <TrackCard
                    key={track.trackId}
                    track={track}
                    onPlay={handlePlay}
                    onShowDetails={handleShowDetails}
                    onToggleFavorite={user ? handleToggleFavorite : undefined}
                    isFavorite={user ? isFavorite(track.trackId) : false}
                  />
                ))}
              </div>
            )}

            {searchData && searchData.results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400 mb-4">No podcasts found</p>
                <p className="text-gray-500">Try searching for something else</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Discover Podcasts</h2>
            
            {/* Trending Podcasts */}
            {renderPodcastRow('Trending Podcasts', trendingPodcasts?.results, trendingLoading)}
            
            {/* Popular by Genre */}
            {renderPodcastRow('Comedy Podcasts', comedyPodcasts?.results)}
            {renderPodcastRow('Business Podcasts', businessPodcasts?.results)}
            {renderPodcastRow('Technology Podcasts', technologyPodcasts?.results)}
          </div>
        )}
      </main>

      {/* Track Details Modal */}
      <TrackDetails
        track={selectedTrack}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onPlay={handlePlay}
        onToggleFavorite={selectedTrack && user ? () => handleToggleFavorite(selectedTrack) : undefined}
        isFavorite={selectedTrack && user ? isFavorite(selectedTrack.trackId) : false}
      />

      {/* Music Player */}
      <MusicPlayer currentTrack={currentTrack} />
    </div>
  );
};

export default Index;
