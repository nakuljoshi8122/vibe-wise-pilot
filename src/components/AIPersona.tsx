import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Heart, Target } from "lucide-react";

interface PersonaData {
  mood: string;
  energy: string;
  focus: string;
}

export const AIPersona = ({ personaData }: { personaData: PersonaData }) => {
  const getPersonalizedMessage = () => {
    if (personaData.mood === "Stressed") {
      return "I notice you're feeling overwhelmed. Let's work together to break things down into manageable steps. Remember, it's okay to take things one moment at a time.";
    } else if (personaData.mood === "Great") {
      return "I love your positive energy! Let's channel this momentum into something meaningful. What would you like to accomplish today?";
    } else if (personaData.mood === "Tired") {
      return "It sounds like you need some gentle care today. Let's focus on small, achievable goals that won't drain your energy further.";
    }
    return "I'm here to support you on your wellness journey. Together, we can navigate whatever comes your way.";
  };

  const getPersonalityTraits = () => {
    const traits = ["Empathetic", "Non-judgmental"];
    
    if (personaData.energy === "Low" || personaData.energy === "Very Low") {
      traits.push("Gentle", "Patient");
    } else {
      traits.push("Encouraging", "Motivating");
    }
    
    if (personaData.focus === "Academic Work") {
      traits.push("Study-focused", "Goal-oriented");
    } else if (personaData.focus === "Self Care") {
      traits.push("Wellness-focused", "Mindful");
    }
    
    return traits;
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-wellness-calm/20 border-primary/20">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10 animate-pulse-soft">
            <Bot className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 mr-2 text-primary" />
          Your AI Co-pilot is Ready
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-foreground leading-relaxed italic">
            "{getPersonalizedMessage()}"
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-wellness-stress" />
              Personality Traits
            </h4>
            <div className="flex flex-wrap gap-2">
              {getPersonalityTraits().map((trait) => (
                <Badge key={trait} variant="secondary" className="bg-wellness-calm/20">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2 text-primary" />
              Optimized For
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Current Mood:</span>
                <Badge variant="outline">{personaData.mood}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Energy Level:</span>
                <Badge variant="outline">{personaData.energy}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Focus Area:</span>
                <Badge variant="outline">{personaData.focus}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};