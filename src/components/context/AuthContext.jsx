import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  // Login API call
  const login = async (email, password) => {
    try {
      const response = await axios.post('https://email-toner-backend.onrender.com/auth/signin', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ token });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  // Signup API call
  const signup = async (email, password, name) => {
    try {
      const response = await axios.post('https://email-toner-backend.onrender.com/auth/signup', {
        email,
        password,
        name,
      });
      return response.data; // Returns { message: 'OTP sent to your email...' }
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  };

  // Verify OTP API call
  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post('https://email-toner-backend.onrender.com/auth/verify-otp', {
        email,
        otp,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ token });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://email-toner-backend.onrender.com/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Check if user is logged in
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verifyOtp, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};