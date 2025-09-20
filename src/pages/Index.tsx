import { useState } from "react";
import { EnhancedVibeCheck } from "@/components/EnhancedVibeCheck";
import { ThoughtSorter } from "@/components/ThoughtSorter";
import { MoodTunes } from "@/components/MoodTunes";
import { ZenMode } from "@/components/ZenMode";
import { SquadGoals } from "@/components/SquadGoals";
import { AIPersona } from "@/components/AIPersona";
import { FeatureCard } from "@/components/FeatureCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Lightbulb, 
  Music, 
  Users, 
  Smartphone, 
  Heart,
  Sparkles,
  ArrowRight,
  Star
} from "lucide-react";

type AppView = "home" | "vibe-check" | "thought-sorter" | "mood-tunes" | "persona" | "zen" | "squad-goals";

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [personaData, setPersonaData] = useState<any>(null);

  const handleVibeCheckComplete = (data: any) => {
    setPersonaData(data);
    setCurrentView("persona");
  };

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "Vibe Check & AI Co-pilot",
      description: "Smart quiz that creates your unique profile for hyper-personalized guidance",
      status: "available" as const,
      features: [
        "Mood assessment with emoji selection",
        "Energy level tracking",
        "Focus area identification",
        "Personalized diet & sleep plans"
      ]
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-wellness-focus" />,
      title: "Thought Sorter",
      description: "Transform your mental brain dump into structured, actionable insights",
      status: "available" as const,
      features: [
        "AI-powered emotion detection",
        "Challenge identification",
        "Instant clarity and insights",
        "Actionable next steps"
      ]
    },
    {
      icon: <Music className="w-8 h-8 text-wellness-energy" />,
      title: "MoodTunes",
      description: "Music therapy that adapts to your emotional state for instant relief",
      status: "available" as const,
      features: [
        "Mood-based music recommendations",
        "Personal playlist integration",
        "Instant stress relief",
        "Focus and energy boosting tracks"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Squad Goals",
      description: "AI-powered group challenges that build community and accountability",
      status: "available" as const,
      features: [
        "Group wellness challenges",
        "Real-time group chat",
        "Team progress tracking",
        "Peer accountability system"
      ]
    },
    {
      icon: <Smartphone className="w-8 h-8 text-wellness-calm" />,
      title: "Zen Mode",
      description: "Mindful tech use tools to help you build healthier digital habits",
      status: "available" as const,
      features: [
        "Functional focus timer",
        "Sleep mode with blue light filter",
        "Usage analytics dashboard",
        "Guided mindful breaks"
      ]
    }
  ];

  const getFeatureAction = (title: string) => {
    switch (title) {
      case "Vibe Check & AI Co-pilot":
        return () => setCurrentView("vibe-check");
      case "Thought Sorter":
        return () => setCurrentView("thought-sorter");
      case "MoodTunes":
        return () => setCurrentView("mood-tunes");
      case "Squad Goals":
        return () => setCurrentView("squad-goals");
      case "Zen Mode":
        return () => setCurrentView("zen");
      default:
        return undefined;
    }
  };

  if (currentView === "vibe-check") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <EnhancedButton variant="ghost" onClick={() => setCurrentView("home")}>
              Back to Home
            </EnhancedButton>
            <ThemeToggle />
          </div>
          <EnhancedVibeCheck onComplete={handleVibeCheckComplete} />
        </div>
      </div>
    );
  }

  if (currentView === "thought-sorter") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <EnhancedButton variant="ghost" onClick={() => setCurrentView("home")}>
              Back to Home
            </EnhancedButton>
            <ThemeToggle />
          </div>
          <ThoughtSorter />
        </div>
      </div>
    );
  }

  if (currentView === "mood-tunes") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <EnhancedButton variant="ghost" onClick={() => setCurrentView("home")}>
              Back to Home
            </EnhancedButton>
            <ThemeToggle />
          </div>
          <MoodTunes />
        </div>
      </div>
    );
  }

  if (currentView === "squad-goals") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <EnhancedButton variant="ghost" onClick={() => setCurrentView("home")}>
              Back to Home
            </EnhancedButton>
            <ThemeToggle />
          </div>
          <SquadGoals onBack={() => setCurrentView("home")} />
        </div>
      </div>
    );
  }

  if (currentView === "zen") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <EnhancedButton variant="ghost" onClick={() => setCurrentView("home")}>
              Back to Home
            </EnhancedButton>
            <ThemeToggle />
          </div>
          <ZenMode onBack={() => setCurrentView("home")} />
        </div>
      </div>
    );
  }

  if (currentView === "persona" && personaData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-6 flex justify-between items-center">
            <EnhancedButton variant="ghost" onClick={() => setCurrentView("home")}>
              Back to Home
            </EnhancedButton>
            <ThemeToggle />
          </div>
          <AIPersona personaData={personaData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("thought-sorter")}>
              <CardContent className="p-6 text-center">
                <Lightbulb className="w-12 h-12 text-wellness-focus mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Try Thought Sorter</h3>
                <p className="text-sm text-muted-foreground">Sort through your thoughts with AI guidance</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("mood-tunes")}>
              <CardContent className="p-6 text-center">
                <Music className="w-12 h-12 text-wellness-energy mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Explore MoodTunes</h3>
                <p className="text-sm text-muted-foreground">Find music that matches your mood</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-wellness-calm/10 to-accent/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-wellness-calm/20">
                Powered by AI & Empathy
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-wellness-focus to-accent bg-clip-text text-transparent leading-tight">
              Sorted
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your holistic well-being ecosystem powered by Google Cloud's Gemini 1.5 Pro
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <EnhancedButton 
                variant="wellness" 
                size="xl"
                onClick={() => setCurrentView("vibe-check")}
                className="animate-pulse-soft"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Vibe Check
                <ArrowRight className="w-5 h-5 ml-2" />
              </EnhancedButton>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-wellness-energy mr-1" />
                AI-Powered
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-wellness-stress mr-1" />
                Empathetic
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 text-primary mr-1" />
                Personalized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Complete Wellness Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From instant mood insights to personalized music therapy - everything you need for student mental wellness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={feature.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard
                {...feature}
                onClick={getFeatureAction(feature.title)}
              />
            </div>
          ))}
        </div>

        {/* Core Innovation Spotlight */}
        <Card className="bg-gradient-to-r from-primary/5 to-wellness-focus/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 mr-2 text-wellness-focus" />
              Core Innovation: Thought Sorter
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our breakthrough feature transforms chaotic thoughts into structured insights, 
              identifying emotions and challenges to deliver instant clarity with actionable next steps.
            </p>
            <EnhancedButton 
              variant="mood" 
              size="lg"
              onClick={() => setCurrentView("thought-sorter")}
            >
              Try Thought Sorter Now
            </EnhancedButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;