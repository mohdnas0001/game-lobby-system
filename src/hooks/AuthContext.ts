import { AuthContextType } from '@/components/types';
import { User } from 'lucide-react';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { User, AuthContextType };