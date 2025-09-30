import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    localStorage.setItem('jwt_token', jwtToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  /**
   * Clears the user's session data from localStorage and resets the state.
   */
  const logout = () => {
    // Clear the token from browser storage to end the session
    localStorage.removeItem('jwt_token');
    
    // Clear any cached user data
    localStorage.removeItem('user_data');
    
    // Reset the application state to null, triggering a re-render
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};