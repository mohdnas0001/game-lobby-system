/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthHook';
import { get } from '@/lib/axiosConfig';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface LeaderboardEntry {
  id: string;
  username: string;
  wins: number;
}

interface AxiosError {
  response?: { data?: { message?: string } };
}

const fetchLeaderboard = async (token: string): Promise<LeaderboardEntry[]> => {
  const response = await get<
    { _id: string; username: string; wins: number; __v: number }[]
  >('/game/leaderboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10)
    .map((entry) => ({
      id: entry._id,
      username: entry.username,
      wins: entry.wins,
    }));
};

const Leaderboard = () => {
  const { user } = useAuth();

  const {
    data: leaderboard,
    isLoading,
    isError,
    error,
  } = useQuery<LeaderboardEntry[], AxiosError>({
    queryKey: ['leaderboard', user?.token],
    queryFn: () => fetchLeaderboard(user.token),
    enabled: !!user?.token,
    initialData: [], 
    staleTime: 5 * 60 * 1000, 
    refetchInterval: 10000, 
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (isError && error) {
      console.error('Failed to fetch leaderboard:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load leaderboard',
        variant: 'destructive',
      });
    }
  }, [isError, error]);

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
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 2:
        return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
      case 3:
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
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
        {isLoading && leaderboard.length === 0 ? (
          <div className="text-center text-blue-200 py-8">Loading leaderboard...</div>
        ) : isError ? (
          <div className="text-center text-red-300 py-8">
            {error?.response?.data?.message || 'Failed to load leaderboard'}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-blue-200 py-8">No players on the leaderboard yet.</div>
        ) : (
          leaderboard.map((player, index) => {
            const position = index + 1;
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  position <= 3 ? 'bg-white/10 border border-white/20' : 'bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(position)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{player.username}</p>
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
          })
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;