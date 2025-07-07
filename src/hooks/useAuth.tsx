
import { useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { post } from '@/lib/axiosConfig';
import { AuthContext } from './AuthContext';
import { User } from '@/components/types';


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('game_token');
    const userData = localStorage.getItem('game_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('game_token');
        localStorage.removeItem('game_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string) => {
    setLoading(true);
    try {
     
      const response = await post<User>('/auth/login', { username });
      const { id, token, username: responseUsername, wins } = response;
      const user: User = {
        id,
        token,
        username: responseUsername,
        wins,
      };
      const userToken = user.token;
      
      localStorage.setItem('game_token', userToken);
      localStorage.setItem('game_user', JSON.stringify(user));
      setUser(user);
      setUser(user);
      
      toast({
        title: "Welcome!",
        description: `Logged in as ${username}`,
      });
    } catch (error)
    {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('game_token');
    localStorage.removeItem('game_user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const isTokenValid = (user: User | null) => {
    if (!user || !user.token) return false;
    return true;
  };

  const incrementWins = () => {
    if (user) {
      const updatedUser = { ...user, wins: user.wins + 1 };
      setUser(updatedUser);
      localStorage.setItem('game_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: isTokenValid(user),
      login,
      logout,
      loading,
      incrementWins
    }}>
      {children}
    </AuthContext.Provider>
  );
};

