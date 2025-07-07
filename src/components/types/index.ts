export interface User {
    id: string;
    token: string; 
    username: string;
    wins: number;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    incrementWins: () => void;
  }