import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { MoodCard } from "./MoodCard";
import { Progress } from "@/components/ui/progress";
import { Heart, Brain, Zap, Leaf } from "lucide-react";

const moods = [
  { emoji: "😊", mood: "Great", description: "Feeling positive and energetic", color: "wellness-energy" },
  { emoji: "😌", mood: "Calm", description: "Peaceful and centered", color: "wellness-calm" },
  { emoji: "😕", mood: "Stressed", description: "Overwhelmed or anxious", color: "wellness-stress" },
  { emoji: "😴", mood: "Tired", description: "Low energy, need rest", color: "muted" },
  { emoji: "🤔", mood: "Confused", description: "Unclear or unsure", color: "wellness-focus" },
  { emoji: "😤", mood: "Frustrated", description: "Annoyed or blocked", color: "destructive" },
];

const questions = [
  {
    question: "How are you feeling right now?",
    type: "mood" as const,
  },
  {
    question: "How would you rate your energy level today?",
    type: "scale" as const,
    options: ["Very Low", "Low", "Moderate", "High", "Very High"]
  },
  {
    question: "What's your main focus area today?",
    type: "focus" as const,
    options: ["Academic Work", "Social Life", "Self Care", "Career Planning", "Health & Fitness"]
  }
];

export const VibeCheck = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [selectedMood, setSelectedMood] = useState<string>("");

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setAnswers({ ...answers, mood });
  };

  const handleAnswer = (answer: any) => {
    const newAnswers = { ...answers, [questions[currentQuestion].type]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-wellness-calm/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Vibe Check
            </CardTitle>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            {questions[currentQuestion].question}
          </h2>

          {questions[currentQuestion].type === "mood" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <MoodCard
                  key={mood.mood}
                  {...mood}
                  onClick={() => handleMoodSelect(mood.mood)}
                  isSelected={selectedMood === mood.mood}
                />
              ))}
            </div>
          )}

          {questions[currentQuestion].type === "scale" && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {questions[currentQuestion].options?.map((option, index) => (
                <EnhancedButton
                  key={option}
                  variant="outline"
                  size="lg"
                  onClick={() => handleAnswer(option)}
                  className="h-20 flex-col"
                >
                  <div className="text-2xl mb-1">{index + 1}</div>
                  <div className="text-sm">{option}</div>
                </EnhancedButton>
              ))}
            </div>
          )}

          {questions[currentQuestion].type === "focus" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options?.map((option) => {
                const icons = {
                  "Academic Work": "📚",
                  "Social Life": "👥",
                  "Self Care": "🧘",
                  "Career Planning": "🎯",
                  "Health & Fitness": "💪"
                };
                return (
                  <EnhancedButton
                    key={option}
                    variant="outline"
                    size="xl"
                    onClick={() => handleAnswer(option)}
                    className="h-16 justify-start space-x-3"
                  >
                    <span className="text-2xl">{icons[option as keyof typeof icons]}</span>
                    <span>{option}</span>
                  </EnhancedButton>
                );
              })}
            </div>
          )}

          {selectedMood && questions[currentQuestion].type === "mood" && (
            <div className="flex justify-center mt-6">
              <EnhancedButton
                variant="wellness"
                size="lg"
                onClick={() => handleAnswer(selectedMood)}
              >
                Continue
              </EnhancedButton>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};