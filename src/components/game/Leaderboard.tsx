
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

// Mock leaderboard data - in a real app, this would come from your backend
const mockLeaderboard = [
  { id: '1', username: 'ChampionPlayer', wins: 47 },
  { id: '2', username: 'LuckyGamer', wins: 34 },
  { id: '3', username: 'NumberMaster', wins: 28 },
  { id: '4', username: 'WinStreak', wins: 23 },
  { id: '5', username: 'FastFingers', wins: 19 },
  { id: '6', username: 'RandomKing', wins: 16 },
  { id: '7', username: 'QuickPick', wins: 14 },
  { id: '8', username: 'GoldenTouch', wins: 12 },
  { id: '9', username: 'LuckyNumber', wins: 9 },
  { id: '10', username: 'GameChanger', wins: 7 },
];

const Leaderboard = () => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-400" />;
      default:
        return <span className="text-blue-300 font-bold">#{position}</span>;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case 2:
        return "bg-gray-400/20 text-gray-300 border-gray-400/30";
      case 3:
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Top Players
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockLeaderboard.map((player, index) => {
          const position = index + 1;
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                position <= 3 
                  ? 'bg-white/10 border border-white/20' 
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(position)}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {player.username}
                  </p>
                  {position <= 3 && (
                    <Badge className={`text-xs ${getRankBadge(position)}`}>
                      {position === 1 ? 'Champion' : position === 2 ? 'Runner-up' : 'Bronze'}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-white font-bold">{player.wins}</p>
                <p className="text-blue-300 text-xs">wins</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
