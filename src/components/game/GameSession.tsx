/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, Trophy, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthHook';
import { post } from '@/lib/axiosConfig';

interface GameSessionProps {
  session: {
    id: string;
    isActive: boolean;
    createdAt: string;
    totalDuration: number;
    playersCount: number;
  };
  onLeave: () => void;
}

const SESSION_END_DELAY = 5; // seconds

const GameSession = ({ session, onLeave }: GameSessionProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [pickLoading, setPickLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(session.totalDuration);
  const [nextSessionCountdown, setNextSessionCountdown] = useState<number | null>(null);
  const { incrementWins, user } = useAuth();

  // Local timer for timeLeft
  useEffect(() => {
    if (gameEnded) return;

    const startTime = new Date(session.createdAt).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const calculatedTimeLeft = Math.max(0, Math.floor((startTime + session.totalDuration * 1000 - now) / 1000));
      setTimeLeft(calculatedTimeLeft);

      if (calculatedTimeLeft === 0 && session.isActive) {
        endGame();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session.createdAt, session.totalDuration, gameEnded, session.isActive]);

  // Allow user to change pick before session ends
  const handlePickNumber = async (number: number) => {
    if (pickLoading || gameEnded || timeLeft === 0) return;
    setPickLoading(true);
    try {
      await post('/game/pick-number', { number }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedNumber(number);
      toast({
        title: 'Number picked!',
        description: `You picked ${number}. You can change your pick before the session ends.`,
      });
    } catch (error: any) {
      toast({
        title: 'Failed to pick number',
        description: error?.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
    setPickLoading(false);
  };

  const endGame = async () => {
    setGameEnded(true);
    try {
      const result = await post<{ winningNumber: number; winners: string[] }>(
        '/game/end',
        { sessionId: session.id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setWinningNumber(result.winningNumber);

      if (result.winners.includes(user.id)) {
        setHasWon(true);
        incrementWins();
        toast({
          title: '🎉 You Won!',
          description: `Congratulations! You picked the winning number ${result.winningNumber}!`,
        });
      } else {
        toast({
          title: 'Better luck next time!',
          description: `The winning number was ${result.winningNumber}.`,
        });
      }

      // Start countdown for next session (display only)
      setNextSessionCountdown(SESSION_END_DELAY);
      const countdownTimer = setInterval(() => {
        setNextSessionCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownTimer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Session ended',
        description: error?.response?.data?.message || 'Could not fetch result. Please return to the lobby.',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onLeave}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Leave Game
          </Button>
          <div className="text-center">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              Session #{session.id.slice(-6)}
            </Badge>
          </div>
        </div>

        {/* Game Status */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Timer className="h-6 w-6 text-blue-400" />
                <span className="text-4xl font-bold text-white">
                  {formatTime(timeLeft)}
                </span>
              </div>
              {!gameEnded ? (
                <p className="text-blue-200">
                  {selectedNumber ? 'Waiting for session to end...' : 'Pick your lucky number!'}
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <span className="text-xl font-semibold text-white">
                      Winning Number: {winningNumber ?? 'Waiting for result...'}
                    </span>
                  </div>
                  {winningNumber && hasWon ? (
                    <p className="text-green-300 font-semibold">🎉 Congratulations! You won! 🎉</p>
                  ) : winningNumber ? (
                    <p className="text-red-300">Better luck next time!</p>
                  ) : (
                    <p className="text-blue-200">Fetching session results...</p>
                  )}
                  {nextSessionCountdown !== null && (
                    <p className="text-blue-200">
                      Next session starts in {nextSessionCountdown} seconds...
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Number Selection */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              {gameEnded ? 'Your Pick' : 'Choose Your Number'}
              {selectedNumber && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Selected: {selectedNumber}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {numbers.map((number) => (
                <Button
                  key={number}
                  onClick={() => !gameEnded && handlePickNumber(number)}
                  disabled={gameEnded || pickLoading || timeLeft === 0}
                  className={`h-16 text-2xl font-bold transition-all duration-200 ${
                    selectedNumber === number
                      ? 'bg-blue-600 text-white border-2 border-blue-400 scale-105'
                      : gameEnded && winningNumber === number
                      ? 'bg-green-600 text-white border-2 border-green-400 animate-pulse'
                      : gameEnded
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  {number}
                  {gameEnded && winningNumber === number && (
                    <Trophy className="h-4 w-4 ml-1" />
                  )}
                </Button>
              ))}
            </div>
            {!selectedNumber && !gameEnded && timeLeft > 0 && (
              <p className="text-center text-blue-200 mt-4">
                Click on a number to make your selection
              </p>
            )}
          </CardContent>
        </Card>

        {/* Game End Actions */}
        {gameEnded && (
          <div className="text-center space-y-4">
            <p className="text-blue-200">
              {nextSessionCountdown !== null
                ? `The next session will start soon...`
                : 'Session has ended. Return to the lobby to join a new session.'}
            </p>
            <Button
              onClick={onLeave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Return to Lobby
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSession;