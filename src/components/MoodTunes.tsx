import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Music, Play, Pause, Heart, Plus, ExternalLink } from "lucide-react";
import { MoodCard } from "./MoodCard";
import { SpotifyLogin } from "./SpotifyLogin";
import { spotifyService, SpotifyTrack } from "@/lib/spotify";

interface Track {
  title: string;
  artist: string;
  mood: string;
  duration: string;
  isPlaying?: boolean;
}

const moodMusic = {
  "Great": [
    { title: "Good Vibes", artist: "Study Beats", mood: "Uplifting", duration: "3:24" },
    { title: "Positive Energy", artist: "Lofi Collective", mood: "Energetic", duration: "2:45" },
  ],
  "Calm": [
    { title: "Ocean Waves", artist: "Nature Sounds", mood: "Peaceful", duration: "4:12" },
    { title: "Meditation Flow", artist: "Zen Masters", mood: "Serene", duration: "5:30" },
  ],
  "Stressed": [
    { title: "Deep Breathing", artist: "Calm Studios", mood: "Relaxing", duration: "6:15" },
    { title: "Stress Relief", artist: "Ambient Therapy", mood: "Soothing", duration: "4:45" },
  ],
  "Tired": [
    { title: "Gentle Wake Up", artist: "Morning Light", mood: "Refreshing", duration: "3:00" },
    { title: "Energy Boost", artist: "Revive Music", mood: "Invigorating", duration: "2:30" },
  ],
};

const moods = [
  { emoji: "🎵", mood: "Great", description: "Feeling positive and energetic", color: "wellness-energy" },
  { emoji: "🎶", mood: "Calm", description: "Peaceful and centered", color: "wellness-calm" },
  { emoji: "🎼", mood: "Stressed", description: "Need to relax and unwind", color: "wellness-stress" },
  { emoji: "🎧", mood: "Tired", description: "Low energy, need motivation", color: "muted" },
];

export const MoodTunes = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [playingTrack, setPlayingTrack] = useState<string>("");
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [userPlaylists] = useState([
    { name: "My Study Mix", tracks: 15, mood: "Focus" },
    { name: "Chill Vibes", tracks: 8, mood: "Relax" },
    { name: "Workout Energy", tracks: 12, mood: "Energetic" },
  ]);

  const handlePlay = (trackTitle: string) => {
    setPlayingTrack(playingTrack === trackTitle ? "" : trackTitle);
  };

  const handleSpotifyAuth = (isAuthenticated: boolean) => {
    setIsSpotifyConnected(isAuthenticated);
    if (!isAuthenticated) {
      setSpotifyTracks([]);
    }
  };

  const loadSpotifyRecommendations = async (mood: string) => {
    if (!isSpotifyConnected) return;
    
    setIsLoadingTracks(true);
    try {
      const tracks = await spotifyService.getRecommendations(mood);
      setSpotifyTracks(tracks);
    } catch (error) {
      console.error('Failed to load Spotify recommendations:', error);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (isSpotifyConnected) {
      loadSpotifyRecommendations(mood);
    }
  };

  const currentTracks = selectedMood ? moodMusic[selectedMood as keyof typeof moodMusic] || [] : [];

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
          
          {/* Mood Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">How are you feeling?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Spotify Recommendations */}
          {isSpotifyConnected && selectedMood && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold flex items-center">
                <Music className="w-5 h-5 mr-2 text-green-600" />
                Spotify Recommendations for {selectedMood} Mood
                {isLoadingTracks && (
                  <Badge variant="secondary" className="ml-2">
                    Loading...
                  </Badge>
                )}
              </h3>
              
              {spotifyTracks.length > 0 && (
                <div className="space-y-3">
                  {spotifyTracks.slice(0, 5).map((track, index) => (
                    <Card key={track.id} className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-colors border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {track.album.images[0] && (
                              <img 
                                src={track.album.images[0].url} 
                                alt={track.name}
                                className="w-12 h-12 rounded-md"
                              />
                            )}
                            <div>
                              <h4 className="font-medium">{track.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {track.artists.map(artist => artist.name).join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                            </span>
                            <EnhancedButton
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(track.external_urls.spotify, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </EnhancedButton>
                            <EnhancedButton variant="ghost" size="icon">
                              <Heart className="w-4 h-4" />
                            </EnhancedButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommended Tracks */}
          {selectedMood && currentTracks.length > 0 && !isSpotifyConnected && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold flex items-center">                
                Default Recommendations for {selectedMood} Mood
                <Badge variant="secondary" className="ml-2">
                  {currentTracks.length} tracks
                </Badge>
              </h3>
              <div className="space-y-3">
                {currentTracks.map((track, index) => (
                  <Card key={index} className="bg-card/50 hover:bg-card/80 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <EnhancedButton
                            variant="outline"
                            size="icon"
                            onClick={() => handlePlay(track.title)}
                            className="shrink-0"
                          >
                            {playingTrack === track.title ? 
                              <Pause className="w-4 h-4" /> : 
                              <Play className="w-4 h-4" />
                            }
                          </EnhancedButton>
                          <div>
                            <h4 className="font-medium">{track.title}</h4>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{track.mood}</Badge>
                          <span className="text-sm text-muted-foreground">{track.duration}</span>
                          <EnhancedButton variant="ghost" size="icon">
                            <Heart className="w-4 h-4" />
                          </EnhancedButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* User Playlists */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Playlists</h3>
              <EnhancedButton variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Playlist
              </EnhancedButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userPlaylists.map((playlist, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{playlist.name}</h4>
                      <Badge variant="secondary">{playlist.mood}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {playlist.tracks} tracks
                    </p>
                    <EnhancedButton variant="outline" size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Play Playlist
                    </EnhancedButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};