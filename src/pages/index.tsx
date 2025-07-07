
import { useAuth } from '@/hooks/useAuthHook';
import AuthPage from '../components/auth/authPage';
import GameLobby from '../components/game/GameLobby';

const Index = () => {
  const {  isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <GameLobby />;
};

export default Index;