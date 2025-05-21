import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const [ , payload ] = token.split('.');
        const data = JSON.parse(atob(payload));
        if (!data.exp || data.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      const [ , payload ] = token.split('.');
      const data = JSON.parse(atob(payload));
      return data.exp && data.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  return { isAuthenticated, loading, user, checkAuth, logout };
}