
import AuthPage from '../components/auth/authPage';
import GameLobby from '../components/game/GameLobby';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const {  isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <GameLobby />;
};

export default Index;