import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from '../services/graphqlClient';
import { TokenStorage } from '../services/auth/storage';
import type { AuthToken } from '../services/auth/types';

interface AuthContextType {
  token: AuthToken | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<AuthToken | null>(TokenStorage.get());
  const client = createApolloClient();

  useEffect(() => {
    // Check token validity
    if (token && !TokenStorage.isValid(token)) {
      TokenStorage.clear();
      setToken(null);
    }
  }, [token]);

  const logout = () => {
    TokenStorage.clear();
    setToken(null);
    window.location.href = '/auth';
  };

  const value = {
    token,
    isAuthenticated: !!token && TokenStorage.isValid(token),
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </AuthContext.Provider>
  );
}