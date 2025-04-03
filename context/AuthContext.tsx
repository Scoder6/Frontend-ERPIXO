import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    user: any;
    loading: boolean;
    error: string | null;
    register: (userData: any) => Promise<void>;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const userData = await api.getProfile();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to load user', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleError = (error: any) => {
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unexpected error occurred';
    };

    const register = async (userData: any) => {
        try {
            setLoading(true);
            await api.registerUser(userData);
            const userDataFromApi = await api.getProfile();
            setUser(userDataFromApi);
            setError(null);
        } catch (error) {
            setError(handleError(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: any) => {
        try {
            setLoading(true);
            await api.loginUser(credentials);
            const userData = await api.getProfile();
            setUser(userData);
            setError(null);
        } catch (error) {
            setError(handleError(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await api.logoutUser();
            setUser(null);
            setError(null);
        } catch (error) {
            setError(handleError(error));
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (profileData: any) => {
        try {
            setLoading(true);
            await api.updateProfile(profileData);
            const updatedProfile = await api.getProfile();
            setUser(updatedProfile);
            setError(null);
        } catch (error) {
            setError(handleError(error));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                register,
                login,
                logout,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
