export interface AuthResponse{
    token: string;
    refreshToken: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthState{ 
    user : AuthResponse | null;
    isAuthenticated: boolean;
    setUser: (user: AuthResponse) => void;
    logout: () => void;
}