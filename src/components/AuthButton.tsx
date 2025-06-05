
import React, { useState, useEffect } from 'react';
import { User, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const AuthButton = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You've been signed out successfully.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-white">
          <img 
            src={user.user_metadata?.avatar_url} 
            alt={user.user_metadata?.full_name || user.email}
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden sm:block text-sm">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <button
          onClick={signOut}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/auth"
      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In</span>
    </Link>
  );
};

export default AuthButton;
