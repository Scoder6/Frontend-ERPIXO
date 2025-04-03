import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProfileFormData } from '@/types';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PROFILE_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

type ProfileContextType = {
    profile: ProfileFormData | null;
    updateProfile: (newProfile: Partial<ProfileFormData>) => Promise<void>; // Keep as Promise<void>
    loading: boolean;
    refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType>({
    profile: null,
    updateProfile: async () => {},
    loading: true,
    refreshProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileFormData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async () => {
        try {
            if (user) {
                const profileData: ProfileFormData = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    password: '',
                    profilePicture: user.profilePicture || DEFAULT_PROFILE_IMAGE,
                };
                setProfile(profileData);
                await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
            } else {
                const storedProfile = await AsyncStorage.getItem('userProfile');
                if (storedProfile) {
                    setProfile(JSON.parse(storedProfile));
                }
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [user]);

    const updateProfile = async (newProfile: Partial<ProfileFormData>) => {
        try {
            setLoading(true);
            const updatedProfile = {
                ...(profile || {
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    profilePicture: DEFAULT_PROFILE_IMAGE
                }),
                ...newProfile
            };

            setProfile(updatedProfile);
            await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));

            // Here you would call your API to update the backend
            // await api.updateProfile(updatedProfile);

            // Don't return the profile data since we declared Promise<void>
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            updateProfile,
            loading,
            refreshProfile: loadProfile
        }}>
            {children}
        </ProfileContext.Provider>
    );
};