'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from '@/components/Loading';

interface LoadingContextType {
  setIsPageLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pathname = usePathname();

  // Reset loading state when the path changes
  useEffect(() => {
    setIsPageLoading(false);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ setIsPageLoading }}>
      {isPageLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};
