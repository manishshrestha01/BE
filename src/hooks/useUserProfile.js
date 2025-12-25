import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const defaultProfile = {
  full_name: '',
  semester: '',
  faculty: 'Computer Engineering',
  university: 'Pokhara University',
  setupComplete: false
}

const mapDbProfileToClient = (data) => ({
  id: data?.id,
  full_name: data?.full_name ?? '',
  semester: data?.semester ?? '',
  faculty: data?.faculty ?? defaultProfile.faculty,
  university: data?.university ?? defaultProfile.university,
  setupComplete: Boolean(data?.setup_complete)
})

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true); // Start as true to prevent premature checks
  const [error, setError] = useState(null);
  const [profileInitialized, setProfileInitialized] = useState(false);

  // Fetch profile from Supabase on mount or when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(defaultProfile);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Profile fetch result:', { data, error, userId: user.id });
      
      if (error && error.code !== 'PGRST116') { // ignore no row found
        setError(error.message);
      } else if (data) {
        const mappedProfile = { ...defaultProfile, ...mapDbProfileToClient(data) };
        setProfile(mappedProfile);
        console.log('Profile loaded from database:', mappedProfile, 'isSetupComplete:', mappedProfile.setupComplete);
      } else {
        // No profile found, create one with default values
        console.log('No profile found, creating default profile for user');
        const defaultProfileData = {
          id: user.id,
          full_name: '',
          semester: '',
          faculty: defaultProfile.faculty,
          university: defaultProfile.university,
          setup_complete: false
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfileData);
        
        if (insertError) {
          console.error('Error creating default profile:', insertError);
          setError('Failed to create profile');
        } else {
          console.log('Default profile created');
        }
        
        setProfile(defaultProfile);
      }
      setLoading(false);
      setProfileInitialized(true);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  // Save profile to Supabase
  const updateProfile = async (updates) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    const upsertData = {
      id: user.id,
      full_name: newProfile.full_name,
      semester: newProfile.semester,
      faculty: newProfile.faculty,
      university: newProfile.university
    };

    if (typeof newProfile.setupComplete !== 'undefined') {
      upsertData.setup_complete = newProfile.setupComplete;
    }

    const { error } = await supabase.from('profiles').upsert(upsertData);
    if (error) {
      setError(error.message);
      console.error('Database error during profile update:', error);
      throw error; // Throw the error so calling code can handle it
    } else {
      console.log('Profile updated successfully in database, upsertData:', upsertData);
    }
  };

  const completeSetup = () => {
    setProfile(prev => ({ ...prev, setupComplete: true }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  const getInitials = () => {
    if (!profile.full_name) return '?';
    return profile.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    profile,
    updateProfile,
    completeSetup,
    resetProfile,
    getInitials,
    isSetupComplete: profile.setupComplete,
    loading,
    profileInitialized,
    error
  };
}

export default useUserProfile
