import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { SpotifyTrack, SpotifyUser, spotifyService } from "@/lib/spotify";

interface SpotifyPlayerProps {
  track: SpotifyTrack;
  user: SpotifyUser;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const SpotifyPlayer = ({ track, user, isPlaying = false, onPlayStateChange }: SpotifyPlayerProps) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(isPlaying);
  const [webPlayer, setWebPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isPremium = user.product === 'premium';
  const hasPreview = !!track.preview_url;

  useEffect(() => {
    if (isPremium && !webPlayer) {
      initializeWebPlayer();
    }
  }, [isPremium, webPlayer]);

  const initializeWebPlayer = async () => {
    try {
      const player = await spotifyService.initializeWebPlayback((id) => {
        setDeviceId(id);
      });
      setWebPlayer(player);
    } catch (error) {
      console.error('Failed to initialize web player:', error);
      setError('Failed to initialize Spotify player');
    }
  };

  const handlePlay = async () => {
    if (currentlyPlaying) {
      handlePause();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isPremium && webPlayer && deviceId) {
        // Use Spotify Web Playback SDK for premium users
        await spotifyService.playTrack(`spotify:track:${track.id}`, deviceId);
        setCurrentlyPlaying(true);
      } else if (hasPreview && audioRef.current) {
        // Use preview URL for free users or fallback
        audioRef.current.play();
        setCurrentlyPlaying(true);
      } else {
        // Fallback to opening in Spotify app/web
        window.open(track.external_urls.spotify, '_blank');
      }
      
      onPlayStateChange?.(true);
    } catch (error) {
      console.error('Playback error:', error);
      setError('Playback failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (isPremium && webPlayer) {
      webPlayer.pause();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentlyPlaying(false);
    onPlayStateChange?.(false);
  };

  const handleAudioEnded = () => {
    setCurrentlyPlaying(false);
    onPlayStateChange?.(false);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Album Art */}
          <div className="relative flex-shrink-0">
            <img 
              src={track.album.images[0]?.url || '/placeholder.svg'} 
              alt={track.album.name}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
              <EnhancedButton
                variant="ghost"
                size="icon"
                onClick={handlePlay}
                disabled={isLoading}
                className="text-white hover:bg-white/20"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : currentlyPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </EnhancedButton>
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{track.name}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {track.artists.map(artist => artist.name).join(', ')}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDuration(track.duration_ms)}
              </span>
              {isPremium ? (
                <Badge variant="secondary" className="bg-green-500/20 text-green-700 text-xs">
                  Full Track
                </Badge>
              ) : hasPreview ? (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 text-xs">
                  30s Preview
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  External Only
                </Badge>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={handlePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : currentlyPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => window.open(track.external_urls.spotify, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </EnhancedButton>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Audio Element for Preview Playback */}
        {hasPreview && !isPremium && (
          <audio
            ref={audioRef}
            src={track.preview_url!}
            onEnded={handleAudioEnded}
            onPlay={() => setCurrentlyPlaying(true)}
            onPause={() => setCurrentlyPlaying(false)}
            className="hidden"
          />
        )}
      </CardContent>
    </Card>
  );
};