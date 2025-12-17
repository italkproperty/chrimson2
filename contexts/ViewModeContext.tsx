import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ViewModeContextType {
  isAdminView: boolean;
  toggleViewMode: () => void;
  isViewModeLoaded: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isAdminView, setIsAdminView] = useState(false);
  const [isViewModeLoaded, setIsViewModeLoaded] = useState(false);

  useEffect(() => {
    // Load preference from local storage
    const savedMode = localStorage.getItem('chrimson_admin_view');
    if (isAuthenticated) {
      if (savedMode !== null) {
        setIsAdminView(JSON.parse(savedMode));
      } else {
        setIsAdminView(true); // Default to admin view if logged in
      }
    } else {
      setIsAdminView(false); // Force user view if not logged in
    }
    setIsViewModeLoaded(true);
  }, [isAuthenticated]);

  const toggleViewMode = () => {
    if (!isAuthenticated) return;
    setIsAdminView((prev) => {
      const newVal = !prev;
      localStorage.setItem('chrimson_admin_view', JSON.stringify(newVal));
      return newVal;
    });
  };

  // If user logs out, reset
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdminView(false);
    }
  }, [isAuthenticated]);

  return (
    <ViewModeContext.Provider value={{ isAdminView, toggleViewMode, isViewModeLoaded }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};