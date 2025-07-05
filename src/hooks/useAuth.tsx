
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  wins: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      // This would normally be an API call to your backend
      // For now, we'll simulate the authentication
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        wins: 0
      };
      
      const mockToken = `token_${Date.now()}`;
      
      localStorage.setItem('game_token', mockToken);
      localStorage.setItem('game_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Welcome!",
        description: `Logged in as ${username}`,
      });
    } catch (error) {
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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading
    }}>
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