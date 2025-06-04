
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        type="text"
        placeholder="Search for artists, songs, albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
      />
    </form>
  );
};

export default SearchBar;
