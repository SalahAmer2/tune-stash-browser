
import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface SearchHistoryProps {
  onSelectQuery: (query: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectQuery }) => {
  const { searchHistory, clearSearchHistory } = useSearchHistory();

  if (searchHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Searches
        </h3>
        <button
          onClick={clearSearchHistory}
          className="text-gray-400 hover:text-red-400 transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {searchHistory.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectQuery(item.query)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full text-sm transition-colors"
          >
            {item.query} ({item.results_count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
