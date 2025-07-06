
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, Trophy, Target } from 'lucide-react';

interface GameSessionProps {
  session: {
    id: string;
    isActive: boolean;
    timeLeft: number;
    totalDuration: number;
    playersCount: number;
  };
  timeLeft: number;
  onLeave: () => void;
}

const GameSession = ({ session, timeLeft, onLeave }: GameSessionProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    if (timeLeft === 0 && !gameEnded) {
      endGame();
    }
  }, [timeLeft, gameEnded]);

  const endGame = () => {
    const randomWinningNumber = Math.floor(Math.random() * 10) + 1;
    setWinningNumber(randomWinningNumber);
    setGameEnded(true);
    
    if (selectedNumber === randomWinningNumber) {
      setHasWon(true);
      toast({
        title: "🎉 You Won!",
        description: `Congratulations! You picked the winning number ${randomWinningNumber}!`,
      });
    } else {
      toast({
        title: "Better luck next time!",
        description: `The winning number was ${randomWinningNumber}. You picked ${selectedNumber || 'nothing'}.`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  console.log(numbers);


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
                      Winning Number: {winningNumber}
                    </span>
                  </div>
                  {hasWon ? (
                    <p className="text-green-300 font-semibold">🎉 Congratulations! You won! 🎉</p>
                  ) : (
                    <p className="text-red-300">Better luck next time!</p>
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
                  onClick={() => !gameEnded && setSelectedNumber(number)}
                  disabled={gameEnded}
                  className={`h-16 text-2xl font-bold transition-all duration-200 ${
                    selectedNumber === number
                      ? 'bg-blue-600 text-white border-2 border-blue-400 scale-105'
                      : gameEnded && winningNumber === number
                      ? 'bg-green-600 text-white border-2 border-green-400 animate-pulse'
                      : gameEnded
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  {number}
                  {gameEnded && winningNumber === number && (
                    <Trophy className="h-4 w-4 ml-1" />
                  )}
                </Button>
              ))}
            </div>
            
            {!selectedNumber && !gameEnded && (
              <p className="text-center text-blue-300 mt-4">
                Click on a number to make your selection
              </p>
            )}
          </CardContent>
        </Card>

        {/* Game End Actions */}
        {gameEnded && (
          <div className="text-center space-y-4">
            <p className="text-blue-200">
              The next session will start automatically in a few seconds...
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
