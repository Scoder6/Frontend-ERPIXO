export interface User {
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
}

export interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    profilePicture: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    register: (userData: RegisterData) => Promise<void>;
    login: (credentials: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (profileData: UpdateProfileData) => Promise<void>;
}

// Specific type for registration data
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    profilePicture?: string;
}

// Specific type for login data
export interface LoginData {
    email: string;
    password: string;
}

// Specific type for profile updates
export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    password?: string;
}

// Optional: Response types for API calls
export interface AuthResponse {
    token: string;
    user: User;
}

export interface ErrorResponse {
    error: string;
    message?: string;
    statusCode?: number;
}