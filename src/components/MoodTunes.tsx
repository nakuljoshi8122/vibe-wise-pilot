import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Shuffle } from "lucide-react";
import { MoodCard } from "./MoodCard";

const moods = [
  { emoji: "😊", mood: "Great", description: "Feeling positive and energetic", color: "wellness-energy" },
  { emoji: "😌", mood: "Calm", description: "Peaceful and centered", color: "wellness-calm" },
  { emoji: "😕", mood: "Stressed", description: "Need to relax and unwind", color: "wellness-stress" },
  { emoji: "😴", mood: "Tired", description: "Low energy, need motivation", color: "muted" },
  { emoji: "🤔", mood: "Focused", description: "Need concentration music", color: "wellness-focus" },
  { emoji: "🤯", mood: "Confused", description: "Feeling unclear or unsure", color: "secondary" },
  { emoji: "😤", mood: "Frustrated", description: "Annoyed or blocked", color: "destructive" },
];

// Curated Spotify playlists mapped to moods, language, and vocal type
const EMBEDS = {
  "Great": {
    vocals: {
      en: ["37i9dQZF1DX0XUsuxWHRQd", "37i9dQZF1DXdPec7aLTmlC", "37i9dQZF1DX4fpCWaHOned"], // Good Vibes, Happy Hits, Feel Good Indie Rock
      es: ["37i9dQZF1DX10zKzsJ2jva", "37i9dQZF1DWY7IeIP1cdjF"], // Viva Latino, Latin Pop
      hi: ["37i9dQZF1DX0XUfTFmNBRM", "37i9dQZF1DWZryfp6NSvtz"] // Bollywood Acoustic, Hindi Hits
    },
    instrumental: {
      en: ["37i9dQZF1DWWQRwui0ExPn", "37i9dQZF1DX0SM0LYsmbMT"], // LoFi Beats, Feel Good Piano
      es: ["37i9dQZF1DWSiZvo2J6snt"], // Guitar Covers
      hi: ["37i9dQZF1DX5q67ZpWyRrZ"] // Instrumental Bollywood
    }
  },
  "Calm": {
    vocals: {
      en: ["37i9dQZF1DX4sWSpwq3LiO", "37i9dQZF1DWZqd5JICZI0u"], // Peaceful Piano, Soft Pop Hits
      es: ["37i9dQZF1DWY3PJQC2k4ps"], // Peaceful Guitar
      hi: ["37i9dQZF1DX5YKUl0StRKP"] // Peaceful Hindi
    },
    instrumental: {
      en: ["37i9dQZF1DX4sWSpwq3LiO", "37i9dQZF1DX3YSRoSdA634"], // Peaceful Piano, Ambient Chill
      es: ["37i9dQZF1DX1s9knjP51Oa"], // Classical Essentials
      hi: ["37i9dQZF1DX5q67ZpWyRrZ"] // Instrumental Bollywood
    }
  },
  "Stressed": {
    vocals: {
      en: ["37i9dQZF1DWZqd5JICZI0u", "37i9dQZF1DX4sWSpwq3LiO"], // Soft Pop Hits, Peaceful Piano
      es: ["37i9dQZF1DX5wgKYQVRARv"], // Tranquil Acoustic
      hi: ["37i9dQZF1DX5YKUl0StRKP"] // Peaceful Hindi
    },
    instrumental: {
      en: ["37i9dQZF1DX3YSRoSdA634", "37i9dQZF1DWXe9gFZP0gtP"], // Ambient Chill, Meditation Music
      es: ["37i9dQZF1DX1s9knjP51Oa"], // Classical Essentials
      hi: ["37i9dQZF1DWZryfp6NSvtz"] // Instrumental Bollywood
    }
  },
  "Tired": {
    vocals: {
      en: ["37i9dQZF1DWWQRwui0ExPn", "37i9dQZF1DX0XUsuxWHRQd"], // LoFi Beats, Good Vibes
      es: ["37i9dQZF1DX10zKzsJ2jva"], // Viva Latino
      hi: ["37i9dQZF1DX0XUfTFmNBRM"] // Bollywood Acoustic
    },
    instrumental: {
      en: ["37i9dQZF1DWWQRwui0ExPn", "37i9dQZF1DX0SM0LYsmbMT"], // LoFi Beats, Feel Good Piano
      es: ["37i9dQZF1DWSiZvo2J6snt"], // Guitar Covers
      hi: ["37i9dQZF1DX5q67ZpWyRrZ"] // Instrumental Bollywood
    }
  },
  "Focused": {
    vocals: {
      en: ["37i9dQZF1DWZeKCadgRdKQ", "37i9dQZF1DX0XUsuxWHRQd"], // Deep Focus, Good Vibes
      es: ["37i9dQZF1DX5wgKYQVRARv"], // Tranquil Acoustic
      hi: ["37i9dQZF1DX0XUfTFmNBRM"] // Bollywood Acoustic
    },
    instrumental: {
      en: ["37i9dQZF1DWZeKCadgRdKQ", "37i9dQZF1DX0SM0LYsmbMT"], // Deep Focus, Feel Good Piano
      es: ["37i9dQZF1DX1s9knjP51Oa"], // Classical Essentials
      hi: ["37i9dQZF1DX5q67ZpWyRrZ"] // Instrumental Bollywood
    }
  },
  "Confused": {
    vocals: {
      en: ["37i9dQZF1DX4sWSpwq3LiO", "37i9dQZF1DWZqd5JICZI0u"], // Peaceful Piano, Soft Pop Hits
      es: ["37i9dQZF1DX5wgKYQVRARv"], // Tranquil Acoustic
      hi: ["37i9dQZF1DX5YKUl0StRKP"] // Peaceful Hindi
    },
    instrumental: {
      en: ["37i9dQZF1DX3YSRoSdA634", "37i9dQZF1DX0SM0LYsmbMT"], // Ambient Chill, Feel Good Piano
      es: ["37i9dQZF1DX1s9knjP51Oa"], // Classical Essentials
      hi: ["37i9dQZF1DX5q67ZpWyRrZ"] // Instrumental Bollywood
    }
  },
  "Frustrated": {
    vocals: {
      en: ["37i9dQZF1DX0XUsuxWHRQd", "37i9dQZF1DXdPec7aLTmlC"], // Good Vibes, Happy Hits
      es: ["37i9dQZF1DX10zKzsJ2jva"], // Viva Latino
      hi: ["37i9dQZF1DWZryfp6NSvtz"] // Hindi Hits
    },
    instrumental: {
      en: ["37i9dQZF1DWWQRwui0ExPn", "37i9dQZF1DX0SM0LYsmbMT"], // LoFi Beats, Feel Good Piano
      es: ["37i9dQZF1DWSiZvo2J6snt"], // Guitar Covers
      hi: ["37i9dQZF1DX5q67ZpWyRrZ"] // Instrumental Bollywood
    }
  }
};

type Language = 'en' | 'es' | 'hi';
type VocalsType = 'vocals' | 'instrumental';

export const MoodTunes = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [language, setLanguage] = useState<Language>('en');
  const [vocalsType, setVocalsType] = useState<VocalsType>('vocals');
  const [embeds, setEmbeds] = useState<string[]>([]);

  const getEmbedsFor = (mood: string, lang: Language, vocals: VocalsType): string[] => {
    const moodData = EMBEDS[mood as keyof typeof EMBEDS];
    if (!moodData) return [];

    // Try exact match first
    let playlists = moodData[vocals]?.[lang] || [];
    
    // Fallback to English if language not available
    if (playlists.length === 0) {
      playlists = moodData[vocals]?.['en'] || [];
    }
    
    // Return first 3 playlists
    return playlists.slice(0, 3);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    const newEmbeds = getEmbedsFor(mood, language, vocalsType);
    setEmbeds(newEmbeds);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (selectedMood) {
      const newEmbeds = getEmbedsFor(selectedMood, newLanguage, vocalsType);
      setEmbeds(newEmbeds);
    }
  };

  const handleVocalsTypeChange = (newVocalsType: VocalsType) => {
    setVocalsType(newVocalsType);
    if (selectedMood) {
      const newEmbeds = getEmbedsFor(selectedMood, language, newVocalsType);
      setEmbeds(newEmbeds);
    }
  };

  const handleShuffle = () => {
    if (selectedMood) {
      const newEmbeds = getEmbedsFor(selectedMood, language, vocalsType);
      setEmbeds([...newEmbeds].sort(() => Math.random() - 0.5));
    }
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
            Discover music that matches your current mood and preferences
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Music Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Music Preferences</h3>
            
            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language-select" className="text-sm font-medium">Language</Label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full" data-testid="select-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vocals/Instrumental Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Music Type</Label>
              <RadioGroup value={vocalsType} onValueChange={handleVocalsTypeChange} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vocals" id="vocals" data-testid="radio-vocals" />
                  <Label htmlFor="vocals">With Vocals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instrumental" id="instrumental" data-testid="radio-instrumental" />
                  <Label htmlFor="instrumental">Instrumental</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">How are you feeling?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {moods.map((mood) => (
                <MoodCard
                  key={mood.mood}
                  {...mood}
                  onClick={() => handleMoodSelect(mood.mood)}
                  isSelected={selectedMood === mood.mood}
                  data-testid={`card-mood-${mood.mood.toLowerCase()}`}
                />
              ))}
            </div>
          </div>

          {/* Selected Mood and Music Embeds */}
          {selectedMood && embeds.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="text-2xl mr-2">
                    {moods.find(m => m.mood === selectedMood)?.emoji}
                  </span>
                  {selectedMood} Music
                  <Badge className="ml-2" variant="secondary">
                    {vocalsType === 'vocals' ? 'With Vocals' : 'Instrumental'} • {language.toUpperCase()}
                  </Badge>
                </h3>
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={handleShuffle}
                  data-testid="button-shuffle"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </EnhancedButton>
              </div>
              
              <div className="space-y-4">
                {embeds.map((playlistId, index) => (
                  <iframe
                    key={`${playlistId}-${index}`}
                    data-testid={`embed-${playlistId}`}
                    src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg"
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                🎵 Click play to listen to 30-second previews or full tracks if you have Spotify Premium
              </p>
            </Card>
          )}

          {/* Help Text */}
          {!selectedMood && (
            <Card className="p-6 text-center bg-muted/20">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ready to Find Your Perfect Soundtrack?</h3>
              <p className="text-sm text-muted-foreground">
                Choose your music preferences and select a mood to get curated playlists that match your vibe
              </p>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};