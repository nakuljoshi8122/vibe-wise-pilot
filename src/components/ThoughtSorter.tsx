import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Heart, AlertTriangle } from "lucide-react";

interface ThoughtAnalysis {
  emotions: string[];
  challenges: string[];
  insights: string[];
  actionStep: string;
  priority: "low" | "medium" | "high";
}

export const ThoughtSorter = () => {
  const [thoughts, setThoughts] = useState("");
  const [analysis, setAnalysis] = useState<ThoughtAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock AI analysis - in real app would call Gemini API
  const analyzeThoughts = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis based on keywords
    const mockAnalysis: ThoughtAnalysis = {
      emotions: thoughts.toLowerCase().includes('stress') ? ['Anxious', 'Overwhelmed'] : 
                thoughts.toLowerCase().includes('tired') ? ['Exhausted', 'Drained'] :
                ['Thoughtful', 'Reflective'],
      challenges: thoughts.toLowerCase().includes('exam') ? ['Academic Pressure', 'Time Management'] :
                  thoughts.toLowerCase().includes('friend') ? ['Social Dynamics', 'Communication'] :
                  ['Self-Organization', 'Focus'],
      insights: [
        'Your feelings are valid and many students experience similar challenges',
        'Breaking down overwhelming thoughts can help create clarity',
        'Small actions often lead to meaningful progress'
      ],
      actionStep: thoughts.toLowerCase().includes('study') ? 
                  'Create a 25-minute focused study session with a specific goal' :
                  'Take 5 deep breaths and write down one small step you can take today',
      priority: thoughts.length > 200 ? 'high' : thoughts.length > 100 ? 'medium' : 'low'
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'wellness-energy';
      case 'low': return 'wellness-calm';
      default: return 'muted';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-wellness-focus/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="w-8 h-8 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-wellness-focus bg-clip-text text-transparent">
              Thought Sorter
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Dump your thoughts here and get instant clarity with actionable insights
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Don't worry about organizing your thoughts - just let them flow..."
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <EnhancedButton
              variant="mood"
              size="lg"
              onClick={analyzeThoughts}
              disabled={!thoughts.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing your thoughts..." : "Sort My Thoughts"}
            </EnhancedButton>
          </div>

          {analysis && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emotions */}
                <Card className="bg-wellness-calm/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-wellness-stress" />
                      Emotions Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.emotions.map((emotion) => (
                        <Badge key={emotion} variant="secondary">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Challenges */}
                <Card className="bg-wellness-energy/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-wellness-energy" />
                      Key Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.challenges.map((challenge) => (
                        <Badge key={challenge} variant="outline" className={`border-${getPriorityColor(analysis.priority)}`}>
                          {challenge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights */}
              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                    Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Step */}
              <Card className="bg-gradient-to-r from-wellness-calm/20 to-accent/20 border-wellness-calm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2 text-accent" />
                    Your Next Step
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground font-medium">{analysis.actionStep}</p>
                  <div className="mt-4">
                    <EnhancedButton variant="wellness" size="sm">
                      I'll Do This Now
                    </EnhancedButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};