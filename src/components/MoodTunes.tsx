import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Music, RefreshCw, Heart, Loader2 } from "lucide-react";
import { MoodCard } from "./MoodCard";
import { SpotifyLogin } from "./SpotifyLogin";
import { SpotifyPlayer } from "./SpotifyPlayer";
import { spotifyService, SpotifyTrack, SpotifyUser } from "@/lib/spotify";

const moods = [
  { emoji: "😊", mood: "Great", description: "Feeling positive and energetic", color: "wellness-energy" },
  { emoji: "😌", mood: "Calm", description: "Peaceful and centered", color: "wellness-calm" },
  { emoji: "😕", mood: "Stressed", description: "Need to relax and unwind", color: "wellness-stress" },
  { emoji: "😴", mood: "Tired", description: "Low energy, need motivation", color: "muted" },
  { emoji: "🤔", mood: "Focused", description: "Need concentration music", color: "wellness-focus" },
  { emoji: "🤯", mood: "Confused", description: "Feeling unclear or unsure", color: "secondary" },
  { emoji: "😤", mood: "Frustrated", description: "Annoyed or blocked", color: "destructive" },
];

export const MoodTunes = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  useEffect(() => {
    // Load user's liked songs when connected
    if (isSpotifyConnected && user) {
      loadUserLikedSongs();
    }
  }, [isSpotifyConnected, user]);

  const handleSpotifyAuth = (isAuthenticated: boolean, userData?: SpotifyUser) => {
    setIsSpotifyConnected(isAuthenticated);
    setUser(userData || null);
    setError(null);
    
    if (!isAuthenticated) {
      setTracks([]);
      setSelectedMood("");
    }
  };

  const loadUserLikedSongs = async () => {
    if (!isSpotifyConnected) return;
    
    setIsLoadingTracks(true);
    setError(null);
    
    try {
      const likedSongs = await spotifyService.getUserLikedSongs(20);
      
      if (likedSongs.length > 0) {
        // Show top 4 liked songs
        setTracks(likedSongs.slice(0, 4));
      } else {
        // No liked songs, show mood selector
        setTracks([]);
      }
    } catch (error) {
      console.error('Failed to load liked songs:', error);
      setError('Failed to load your liked songs. Please try again.');
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const loadMoodRecommendations = async (mood: string) => {
    if (!isSpotifyConnected) return;
    
    setIsLoadingTracks(true);
    setError(null);
    
    try {
      const recommendations = await spotifyService.getRecommendations(mood, 20);
      // Show top 4 recommendations
      setTracks(recommendations.slice(0, 4));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    loadMoodRecommendations(mood);
  };

  const handleRefresh = () => {
    if (selectedMood) {
      loadMoodRecommendations(selectedMood);
    } else {
      loadUserLikedSongs();
    }
  };

  const handlePlayStateChange = (trackId: string, isPlaying: boolean) => {
    setPlayingTrackId(isPlaying ? trackId : null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-wellness-focus/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-wellness-focus bg-clip-text text-transparent">
              MoodTunes
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Music therapy tailored to your emotional state
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Spotify Integration */}
          <SpotifyLogin onAuthChange={handleSpotifyAuth} />
          
          {/* Content based on connection status */}
          {!isSpotifyConnected ? (
            <Card className="p-6 text-center bg-muted/20">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Connect Spotify to Get Started</h3>
              <p className="text-sm text-muted-foreground">
                Connect your Spotify account to access your liked songs and get personalized recommendations
              </p>
            </Card>
          ) : (
            <>
              {/* Show liked songs or mood selector */}
              {tracks.length === 0 && !isLoadingTracks && !selectedMood && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">No Liked Songs Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Let's find some music based on your current mood
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-4">How are you feeling?</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {moods.map((mood) => (
                        <MoodCard
                          key={mood.mood}
                          {...mood}
                          onClick={() => handleMoodSelect(mood.mood)}
                          isSelected={selectedMood === mood.mood}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoadingTracks && (
                <Card className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    {selectedMood ? `Finding ${selectedMood.toLowerCase()} music...` : 'Loading your music...'}
                  </p>
                </Card>
              )}

              {/* Error State */}
              {error && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="text-center">
                    <p className="text-red-600 mb-3">{error}</p>
                    <EnhancedButton variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </EnhancedButton>
                  </div>
                </Card>
              )}

              {/* Track List */}
              {tracks.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {selectedMood ? (
                          <>
                            <span className="text-2xl mr-2">
                              {moods.find(m => m.mood === selectedMood)?.emoji}
                            </span>
                            {selectedMood} Mood Recommendations
                          </>
                        ) : (
                          <>
                            <Heart className="w-5 h-5 mr-2 text-red-500" />
                            Your Liked Songs
                          </>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.product === 'premium' 
                          ? 'Full tracks available with Premium' 
                          : '30-second previews available'
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedMood && (
                        <EnhancedButton
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMood("");
                            setTracks([]);
                            loadUserLikedSongs();
                          }}
                        >
                          Back to Liked Songs
                        </EnhancedButton>
                      )}
                      <EnhancedButton
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isLoadingTracks}
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingTracks ? 'animate-spin' : ''}`} />
                      </EnhancedButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tracks.map((track) => (
                      <SpotifyPlayer
                        key={track.id}
                        track={track}
                        user={user!}
                        isPlaying={playingTrackId === track.id}
                        onPlayStateChange={(isPlaying) => handlePlayStateChange(track.id, isPlaying)}
                      />
                    ))}
                  </div>

                  {/* Show mood selector if we have liked songs */}
                  {!selectedMood && tracks.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <div className="text-center">
                        <h4 className="text-md font-semibold mb-2">Want music for a specific mood?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get personalized recommendations based on how you're feeling
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {moods.map((mood) => (
                          <MoodCard
                            key={mood.mood}
                            {...mood}
                            onClick={() => handleMoodSelect(mood.mood)}
                            isSelected={false}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};