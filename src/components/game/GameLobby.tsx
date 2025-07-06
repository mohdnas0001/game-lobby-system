
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import GameSession from './GameSession';
import Leaderboard from './Leaderboard';
import { Timer, Users, Trophy, LogOut } from 'lucide-react';

interface GameSessionData {
  id: string;
  isActive: boolean;
  timeLeft: number;
  totalDuration: number;
  playersCount: number;
}

const GameLobby = () => {
  const { user, logout } = useAuth();
  const [currentSession, setCurrentSession] = useState<GameSessionData | null>(null);
  const [inGame, setInGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Simulate game session management
  useEffect(() => {
    // Start with a new session
    startNewSession();
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Session ended, start a new one after a brief pause
          setTimeout(() => startNewSession(), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startNewSession = () => {
    const sessionDuration = 20; 
    const newSession: GameSessionData = {
      id: `session_${Date.now()}`,
      isActive: true,
      timeLeft: sessionDuration,
      totalDuration: sessionDuration,
      playersCount: Math.floor(Math.random() * 15) + 5 // Random players count
    };
    
    setCurrentSession(newSession);
    setTimeLeft(sessionDuration);
    
    toast({
      title: "New Session Started!",
      description: "Join now to participate in the next round",
    });
  };

  const handleJoinSession = () => {
    if (currentSession && timeLeft > 0) {
      setInGame(true);
    }
  };

  const handleLeaveGame = () => {
    setInGame(false);
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (inGame && currentSession) {
    return (
      <GameSession 
        session={currentSession} 
        timeLeft={timeLeft}
        onLeave={handleLeaveGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Game Lobby System</h1>
            <p className="text-blue-200">Welcome back, {user?.username}!</p>
          </div>
          <Button 
            variant="outline" 
            onClick={logout}
            className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Current Session */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-400" />
                  Current Session
                  {currentSession?.isActive && timeLeft > 0 && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Active
                    </Badge>
                  )}
                  {timeLeft === 0 && (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                      Ended
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSession ? (
                  <>
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold text-white">
                        {formatTime(timeLeft)}
                      </div>
                      <p className="text-blue-200">
                        {timeLeft > 0 ? 'Time left to join' : 'Session ended - New session starting soon...'}
                      </p>
                    </div>
                    
                    <div className="flex justify-center items-center gap-4 text-sm text-blue-300">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {currentSession.playersCount} players
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        Numbers 1-10
                      </div>
                    </div>

                    <div className="text-center">
                      <Button 
                        onClick={handleJoinSession}
                        disabled={timeLeft === 0}
                        className={`text-lg px-8 py-6 ${
                          timeLeft > 0 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {timeLeft > 0 ? 'Join Session' : 'Session Closed'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-blue-200 py-8">
                    Loading session...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Rules */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-200 space-y-2">
                <p>• Join an active session within the time limit</p>
                <p>• Pick a number between 1-10</p>
                <p>• Wait for the session to end</p>
                <p>• Winners are those who picked the randomly chosen winning number</p>
                <p>• Climb the leaderboard by winning more games!</p>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <Leaderboard />
            
            {/* User Stats */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Total Wins:</span>
                  <span className="text-white font-semibold">{user?.wins || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Rank:</span>
                  <span className="text-white font-semibold">#N/A</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
