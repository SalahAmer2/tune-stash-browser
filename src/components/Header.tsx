
import React from 'react';
import { Music } from 'lucide-react';
import SearchBar from './SearchBar';
import AuthButton from './AuthButton';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-emerald-400 rounded-full">
              <Music className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <SearchBar onSearch={onSearch} />
          </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
