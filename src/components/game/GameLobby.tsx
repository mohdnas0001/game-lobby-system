/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import GameSession from './GameSession';
import Leaderboard from './Leaderboard';
import { Timer, Users, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthHook';
import { get, post } from '@/lib/axiosConfig';

interface GameSessionData {
  id: string;
  isActive: boolean;
  createdAt: string;
  playersCount: number;
}

const SESSION_DURATION = 20; // seconds
const SESSION_END_DELAY = 5; // seconds

const GameLobby = () => {
  const { user, logout } = useAuth();
  const [currentSession, setCurrentSession] = useState<GameSessionData | null>(null);
  const [inGame, setInGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [nextSessionCountdown, setNextSessionCountdown] = useState<number | null>(null);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch the current session from the backend
  const fetchSession = async () => {
    try {
      const session = await get<{
        _id: string;
        isActive: boolean;
        createdAt: string;
        players: any[];
      }>('/game/session/active', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const newSession = {
        id: session._id,
        isActive: session.isActive,
        createdAt: session.createdAt,
        playersCount: session.players.length,
      };
      setCurrentSession(newSession);

      const startTime = new Date(session.createdAt).getTime();
      const now = Date.now();
      const calculatedTimeLeft = Math.max(0, Math.floor((startTime + SESSION_DURATION * 1000 - now) / 1000));
      setTimeLeft(calculatedTimeLeft);

      console.log('Fetched session:', session);
      console.log('Calculated timeLeft:', calculatedTimeLeft, 'startTime:', startTime, 'now:', now);
    } catch (error) {
      console.error('Fetch session error:', error);
      setCurrentSession(null);
      setTimeLeft(0);
    }
  };

  useEffect(() => {
    if (inGame) return;

    fetchSession();
    timerRef.current = setInterval(fetchSession, 5000); // Changed from 2000 to 5000

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [inGame]);

  // Local timer for timeLeft
  useEffect(() => {
    if (!currentSession || inGame || isEndingSession) return;

    const timer = setInterval(() => {
      const startTime = new Date(currentSession.createdAt).getTime();
      const now = Date.now();
      const calculatedTimeLeft = Math.max(0, Math.floor((startTime + SESSION_DURATION * 1000 - now) / 1000));
      setTimeLeft(calculatedTimeLeft);

      if (calculatedTimeLeft === 0 && currentSession.isActive && !isEndingSession) {
        clearInterval(timer); // Stop timer to prevent multiple endSession calls
        endSession();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, inGame, isEndingSession]);

  // End session when timeLeft reaches 0
  const endSession = async () => {
    if (!currentSession || isEndingSession) return;
    setIsEndingSession(true);
    try {
      const result = await post('/game/end', { sessionId: currentSession.id }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Session ended:', result);
      setCurrentSession({ ...currentSession, isActive: false });
      setNextSessionCountdown(SESSION_END_DELAY);

      const countdownTimer = setInterval(() => {
        setNextSessionCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownTimer);
            createNewSession();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('Failed to end session:', error);
      toast({
        title: 'Failed to end session',
        description: error?.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
      await fetchSession();
    } finally {
      setIsEndingSession(false);
    }
  };

  // Create new session after delay
  const createNewSession = async () => {
    try {
      const newSession = await post<{
        _id: string;
        isActive: boolean;
        createdAt: string;
        players: any[];
      }>('/game/session/new', {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCurrentSession({
        id: newSession._id,
        isActive: newSession.isActive,
        createdAt: newSession.createdAt,
        playersCount: newSession.players.length,
      });
      setTimeLeft(SESSION_DURATION);
    } catch (error: any) {
      console.error('Failed to create new session:', error);
      if (error?.response?.status === 400 && error?.response?.data?.session) {
        const existingSession = error.response.data.session;
        setCurrentSession({
          id: existingSession._id,
          isActive: existingSession.isActive,
          createdAt: existingSession.createdAt,
          playersCount: existingSession.players.length,
        });
        setTimeLeft(
          Math.max(0, Math.floor((new Date(existingSession.createdAt).getTime() + SESSION_DURATION * 1000 - Date.now()) / 1000))
        );
      } else {
        toast({
          title: 'Failed to start new session',
          description: error?.response?.data?.message || 'Please refresh the page.',
          variant: 'destructive',
        });
        await fetchSession();
      }
    }
  };

  const handleJoinSession = async () => {
    if (!currentSession || timeLeft === 0) return;
    try {
      await post('/game/join', {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setInGame(true);
      toast({ title: 'Joined Session', description: 'You have joined the session!' });
    } catch (error: any) {
      console.error('Failed to join session:', error);
      toast({
        title: 'Failed to join session',
        description: error?.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
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
        session={{
          id: currentSession.id,
          isActive: currentSession.isActive,
          createdAt: currentSession.createdAt,
          totalDuration: SESSION_DURATION,
          playersCount: currentSession.playersCount,
        }}
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
                        {timeLeft > 0
                          ? 'Time left to join'
                          : nextSessionCountdown !== null
                          ? `Session ended - New session starting in ${nextSessionCountdown} seconds...`
                          : 'Session ended - Starting new session...'}
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
                        disabled={timeLeft === 0 || isEndingSession}
                        className={`text-lg px-8 py-6 ${
                          timeLeft > 0 && !isEndingSession
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {timeLeft > 0 && !isEndingSession ? 'Join Session' : 'Session Closed'}
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
                <p>• Join an active session within the {SESSION_DURATION}-second time limit</p>
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