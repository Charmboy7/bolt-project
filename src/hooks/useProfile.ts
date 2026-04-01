import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';
import { getProfile, updateProfile } from '../lib/profile';
import { supabase } from '../lib/supabase';

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        loadProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    // Initial load
    loadProfile();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      const updated = await updateProfile(updates);
      if (updated) {
        setProfile(updated);
      }
      return updated;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    reload: loadProfile,
    updateProfile: updateUserProfile
  };
}