import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error checking authentication', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            navigate('/');
        } catch (error) {
            console.error('Error logging in', error);
            throw new Error('Login failed');
        }
    };

    const signup = async (email, password, role) => {
        try {
            await axios.post('/api/auth/signup', { email, password, role });
            await login(email, password);
        } catch (error) {
            console.error('Error signing up', error);
            throw new Error('Sign up failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
