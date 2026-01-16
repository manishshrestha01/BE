import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const defaultProfile = {
  full_name: '',
  semester: '',
  faculty: 'Computer Engineering',
  university: 'Pokhara University',
  college: '',
  setupComplete: false
}

const mapDbProfileToClient = (data) => ({
  id: data?.id,
  full_name: data?.full_name ?? '',
  semester: data?.semester ?? '',
  faculty: data?.faculty ?? defaultProfile.faculty,
  university: data?.university ?? defaultProfile.university,
  college: data?.college ?? defaultProfile.college,
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
        setLoading(false);
        setProfileInitialized(false);
        return;
      }

      setLoading(true);
      setError(null);
      // Try to fetch by user id first
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
        // No profile found, create one with default values and try to return the created row
        console.log('No profile found, creating default profile for user');
        const defaultProfileData = {
          id: user.id,
          full_name: '',
          semester: '',
          faculty: defaultProfile.faculty,
          university: defaultProfile.university,
          college: defaultProfile.college,
          setup_complete: false
        };

        try {
          const { data: inserted, error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfileData, { returning: 'representation' });

          console.log('Insert default profile response:', { inserted, insertError });

          if (insertError) {
            console.error('Error creating default profile:', insertError);
            setError('Failed to create profile');
            setProfile(defaultProfile);
          } else if (inserted && inserted.length > 0) {
            const mappedProfile = { ...defaultProfile, ...mapDbProfileToClient(inserted[0]) };
            setProfile(mappedProfile);
            console.log('Default profile created:', mappedProfile);
          } else {
            // Insert succeeded but no representation returned (rare) - set defaults
            setProfile(defaultProfile);
            console.log('Default profile created (no representation returned)');
          }
        } catch (err) {
          console.error('Unhandled error creating default profile:', err);
          setProfile(defaultProfile);
          setError('Failed to create profile');
        }
      }

      setLoading(false);
      setProfileInitialized(true);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  // Save profile to Supabase
  const updateProfile = async (updates) => {
    if (!user) return null;
    // Merge updates into in-memory profile
    const newProfile = { ...profile, ...updates };

    // Normalize: if caller passed snake_case setup_complete, convert to camelCase in-memory
    if (typeof newProfile.setup_complete !== 'undefined' && typeof newProfile.setupComplete === 'undefined') {
      newProfile.setupComplete = newProfile.setup_complete;
    }

    setProfile(newProfile);

    const upsertData = {
      id: user.id,
      full_name: newProfile.full_name,
      semester: newProfile.semester,
      faculty: newProfile.faculty,
      university: newProfile.university,
      college: newProfile.college
    };

    // Accept either camelCase or snake_case from callers
    let setupCompleteVal;
    if (typeof newProfile.setupComplete !== 'undefined') setupCompleteVal = newProfile.setupComplete;
    else if (typeof newProfile.setup_complete !== 'undefined') setupCompleteVal = newProfile.setup_complete;

    if (typeof setupCompleteVal !== 'undefined') {
      upsertData.setup_complete = Boolean(setupCompleteVal);
    }

    try {
      // Try to get a DB representation back so we can keep in-memory state consistent
      const { data: upsertedData, error } = await supabase.from('profiles').upsert(upsertData, { returning: 'representation' });
      console.log('Upsert response:', { upsertedData, error })

      if (error) {
        setError(error.message || JSON.stringify(error));
        console.error('Database error during profile update:', error);
        throw error; // Throw the error so calling code can handle it
      }

      // If DB returned representation, map that to client profile to ensure consistency
      if (upsertedData && upsertedData.length > 0) {
        const mapped = { ...defaultProfile, ...mapDbProfileToClient(upsertedData[0]) };
        setProfile(mapped);
        console.log('Profile updated successfully in database, upsertData:', upsertData, 'db:', mapped);
        return mapped; // return the fresh profile from DB
      }

      // No representation returned, attempt to read the profile directly to verify
      console.log('No representation returned by upsert; fetching profile to verify state')
      const { data: fetched, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('Fetch after upsert result:', { fetched, fetchError })

      if (fetchError) {
        const msg = fetchError.message || JSON.stringify(fetchError)
        setError(msg)
        console.error('Failed to verify profile after upsert:', fetchError)
        throw fetchError // Throw so caller can show an error
      }

      const mapped = { ...defaultProfile, ...mapDbProfileToClient(fetched) }
      setProfile(mapped)
      console.log('Profile update verified by fetch:', mapped)
      return mapped
    } catch (err) {
      throw err
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
