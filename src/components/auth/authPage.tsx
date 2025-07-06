
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Gamepad2, Trophy, Users } from 'lucide-react';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await login(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-full">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Game Lobby System</h1>
            <p className="text-blue-200">Champions Arena</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-400 mx-auto" />
            </div>
            <p className="text-xs text-blue-200">Join Sessions</p>
          </div>
          <div className="space-y-2">
            <div className="bg-green-500/20 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-green-400 mx-auto" />
            </div>
            <p className="text-xs text-green-200">Win Prizes</p>
          </div>
          <div className="space-y-2">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Gamepad2 className="h-6 w-6 text-purple-400 mx-auto" />
            </div>
            <p className="text-xs text-purple-200">Compete</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Enter the Arena</CardTitle>
            <CardDescription className="text-blue-200">
              Choose your username to start playing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading || !username.trim()}
              >
                {loading ? 'Entering...' : 'Enter Arena'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-blue-300">
          Pick numbers, win games, climb the leaderboard!
        </p>
      </div>
    </div>
  );
};

export default AuthPage;