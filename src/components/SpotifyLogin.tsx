import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, LogOut, User, Loader2 } from "lucide-react";
import { spotifyService, SpotifyUser } from "@/lib/spotify";

interface SpotifyLoginProps {
  onAuthChange: (isAuthenticated: boolean, user?: SpotifyUser) => void;
}

export const SpotifyLogin = ({ onAuthChange }: SpotifyLoginProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if we're returning from Spotify auth
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('code')) {
          const success = await spotifyService.handleAuthCallback();
          if (!success) {
            setError('Authentication failed. Please try again.');
            setIsLoading(false);
            return;
          }
        }

        // Check if user is authenticated
        const authenticated = spotifyService.isAuthenticated();
        setIsAuthenticated(authenticated);
        onAuthChange(authenticated);

        if (authenticated) {
          try {
            const userProfile = await spotifyService.getUserProfile();
            setUser(userProfile);
            onAuthChange(true, userProfile);
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // Token might be expired or invalid
            spotifyService.logout();
            setIsAuthenticated(false);
            onAuthChange(false);
            setError('Session expired. Please log in again.');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setError('Authentication error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [onAuthChange]);

  const handleLogin = () => {
    setIsLoading(true);
    setError(null);
    const authUrl = spotifyService.generateAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setUser(null);
    onAuthChange(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-sm text-muted-foreground">Connecting to Spotify...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-red-600">{error}</p>
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={handleLogin}
              className="border-red-500/20 hover:bg-red-500/10"
            >
              Try Again
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.images?.[0]?.url} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{user.display_name || 'Spotify User'}</h4>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">Connected to Spotify</p>
                  <Badge 
                    variant={user.product === 'premium' ? 'default' : 'secondary'}
                    className={user.product === 'premium' ? 'bg-yellow-500/20 text-yellow-700' : ''}
                  >
                    {user.product === 'premium' ? 'Premium' : 'Free'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                <Music className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </EnhancedButton>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-green-500/5 to-green-600/5 border-green-500/20">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-lg flex items-center justify-center">
          <Music className="w-5 h-5 mr-2 text-green-600" />
          Connect Spotify
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your Spotify account to access your liked songs and get personalized music recommendations
        </p>
        <EnhancedButton
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          <Music className="w-4 h-4 mr-2" />
          Connect with Spotify
        </EnhancedButton>
        <p className="text-xs text-muted-foreground">
          We'll access your music preferences and liked songs to provide better recommendations
        </p>
      </CardContent>
    </Card>
  );
};