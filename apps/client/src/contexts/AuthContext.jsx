import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password
            });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 