import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, LogOut, User } from "lucide-react";
import { spotifyService } from "@/lib/spotify";

interface SpotifyUser {
  display_name: string;
  email: string;
  images: { url: string }[];
  followers: { total: number };
}

interface SpotifyLoginProps {
  onAuthChange: (isAuthenticated: boolean) => void;
}

export const SpotifyLogin = ({ onAuthChange }: SpotifyLoginProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = spotifyService.isAuthenticated();
      setIsAuthenticated(authenticated);
      onAuthChange(authenticated);

      if (authenticated) {
        try {
          const userProfile = await spotifyService.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Token might be expired
          spotifyService.logout();
          setIsAuthenticated(false);
          onAuthChange(false);
        }
      }
    };

    checkAuth();
  }, [onAuthChange]);

  const handleLogin = () => {
    setIsLoading(true);
    const authUrl = spotifyService.generateAuthUrl();
    
    // In a real app, you'd handle the OAuth flow properly
    // For demo purposes, we'll simulate a successful login
    setTimeout(() => {
      // Simulate receiving an access token
      const mockToken = 'mock_spotify_token_' + Date.now();
      spotifyService.setAccessToken(mockToken);
      setIsAuthenticated(true);
      onAuthChange(true);
      
      // Mock user data
      const mockUser: SpotifyUser = {
        display_name: 'Demo User',
        email: 'demo@example.com',
        images: [{ url: '/placeholder.svg' }],
        followers: { total: 42 }
      };
      setUser(mockUser);
      setIsLoading(false);
    }, 2000);
  };

  const handleLogout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setUser(null);
    onAuthChange(false);
  };

  if (isAuthenticated && user) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.images[0]?.url} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{user.display_name}</h4>
                <p className="text-sm text-muted-foreground">Connected to Spotify</p>
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
          Connect your Spotify account to get personalized music recommendations based on your mood
        </p>
        <EnhancedButton
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            "Connecting..."
          ) : (
            <>
              <Music className="w-4 h-4 mr-2" />
              Connect with Spotify
            </>
          )}
        </EnhancedButton>
        <p className="text-xs text-muted-foreground">
          We'll only access your music preferences to provide better recommendations
        </p>
      </CardContent>
    </Card>
  );
};