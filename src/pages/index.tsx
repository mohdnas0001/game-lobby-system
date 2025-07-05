
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from '../components/auth/AuthPage';
import GameLobby from '../components/game/GameLobby';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <GameLobby />;
};

export default Index;