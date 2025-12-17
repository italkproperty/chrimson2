import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage to persist session across refreshes
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('chrimson_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (email: string, pass: string) => {
    // robust matching: lowercase email, trim whitespace
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Password is chrimson2024 as per requirements (all lowercase)
    if (cleanEmail === 'hello@chrimsoncc.com' && cleanPass === 'chrimson2024') {
      const adminUser: User = { 
        name: 'Chrimson Admin', 
        email: 'hello@chrimsoncc.com', 
        role: 'admin' 
      };
      setUser(adminUser);
      localStorage.setItem('chrimson_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chrimson_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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