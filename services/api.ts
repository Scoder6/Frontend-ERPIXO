import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "https://backend-assignment-7skl.onrender.com/api/auth"; //Afterwords I will Add it in the .env file just keeping here for the app to work for your checking

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Add response interceptor
api.interceptors.response.use(response => {

    if (!response.headers['access-control-allow-origin']) {
        console.warn('Missing CORS headers in response');
    }
    return response;
}, error => {
    if (error.response?.status === 403 && error.response.data?.error?.includes('CORS')) {
        console.error('CORS error:', error.response.data);
        window.location.reload(); // Force refresh if CORS fails
    }
    return Promise.reject(error);
});

// Request interceptor
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        console.error('Token retrieval error:', error);
        return config;
    }
});

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            error.message = 'Request timeout. Please try again.';
        } else if (error.response?.status === 504) {
            error.message = 'Server timeout. Please try again later.';
        }
        return Promise.reject(error);
    }
);

interface ApiError {
    message: string;
    response?: {
        data?: {
            error?: string;
        };
        status?: number;
    };
}

const handleApiError = (error: ApiError): string => {
    if (axios.isAxiosError(error)) {
        // Handle 4xx/5xx responses
        if (error.response) {
            return error.response.data?.error ||
                error.response.data?.message ||
                `Server error (${error.response.status})`;
        }
        // Handle network errors
        if (error.code === 'ERR_NETWORK') {
            return 'Network error - please check your connection';
        }
    }
    return error.message || 'An unexpected error occurred';
};

// Add preflight verification function
const verifyPreflight = async (endpoint: string) => {
    try {
        await axios.options(`${API_URL}${endpoint}`, {
            headers: {
                'Origin': window.location.origin,
                'Access-Control-Request-Method': 'POST'
            }
        });
    } catch (error) {
        console.error('Preflight verification failed:', error);
        throw new Error('Network configuration error');
    }
};

// Replace the existing registerUser function with this:
let activeRegisterRequest: AbortController | null = null;

export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    profilePicture?: string;
}) => {
    // Cancel previous request if exists
    if (activeRegisterRequest) {
        activeRegisterRequest.abort();
        console.log('Cancelled previous register request');
    }

    const controller = new AbortController();
    activeRegisterRequest = controller;

    try {
        console.log('Making register request for:', userData.email);
        const response = await api.post('/signup', userData, {
            signal: controller.signal
        });

        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error: unknown) { // Explicitly type error as unknown
        // Handle Axios cancellation
        if (axios.isCancel(error)) {
            return null;
        }

        // Handle network errors
        if (axios.isAxiosError(error)) {
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Network error - please check your internet connection');
            }

            // Handle server response errors
            if (error.response) {
                throw new Error(
                    error.response.data?.error ||
                    error.response.data?.message ||
                    `Server error (${error.response.status})`
                );
            }
        }

        // Handle generic errors
        if (error instanceof Error) {
            throw error;
        }

        // Fallback for unknown error types
        throw new Error('An unexpected error occurred');
    } finally {
        if (activeRegisterRequest === controller) {
            activeRegisterRequest = null;
        }
    }
};

export const loginUser = async (credentials: {
    email: string;
    password: string
}) => {
    try {
        const response = await api.post('/login', credentials);
        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw handleApiError(error as ApiError);
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        throw handleApiError(error as ApiError);
    }
};

export const updateProfile = async (profileData: {
    name?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    password?: string;
}) => {
    try {
        const response = await api.put('/profile', profileData);
        return response.data;
    } catch (error) {
        throw handleApiError(error as ApiError);
    }
};

export const logoutUser = async () => {
    try {
        await AsyncStorage.removeItem('token');
        await api.post('/logout');
    } catch (error) {
        console.error('Logout error:', error);
    }
};
