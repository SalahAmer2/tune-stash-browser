
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SearchHistoryItem {
  id: string;
  query: string;
  results_count: number;
  searched_at: string;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('searched_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSearchHistory(data || []);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const addToSearchHistory = async (query: string, resultsCount: number) => {
    if (!user || !query.trim()) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .insert({
          user_id: user.id,
          query: query.trim(),
          results_count: resultsCount,
        });

      if (error) throw error;
      
      // Refresh search history
      fetchSearchHistory();
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  };
};
