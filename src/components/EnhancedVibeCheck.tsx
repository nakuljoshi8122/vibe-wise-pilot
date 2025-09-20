import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { MoodCard } from "./MoodCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Utensils, Moon, Clock, Target } from "lucide-react";

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
  },
  {
    question: "How well did you sleep last night?",
    type: "scale" as const,
    options: ["Terrible", "Poor", "Okay", "Good", "Excellent"]
  },
  {
    question: "What's your stress level right now?",
    type: "scale" as const,
    options: ["Very Low", "Low", "Moderate", "High", "Very High"]
  },
  {
    question: "How connected do you feel to others today?",
    type: "scale" as const,
    options: ["Very Isolated", "Lonely", "Neutral", "Connected", "Very Connected"]
  },
  {
    question: "What type of support do you need most right now?",
    type: "support" as const,
    options: ["Emotional Support", "Academic Help", "Social Connection", "Stress Relief", "Motivation Boost", "Time Management"]
  },
  {
    question: "How confident do you feel about handling today's challenges?",
    type: "scale" as const,
    options: ["Not Confident", "Slightly Confident", "Moderately Confident", "Very Confident", "Extremely Confident"]
  }
];

interface WellnessPlan {
  diet: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
    hydration: string;
  };
  sleep: {
    recommendedHours: number;
    bedtime: string;
    wakeTime: string;
    routine: string[];
  };
  reminders: string[];
}

export const EnhancedVibeCheck = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [showPlan, setShowPlan] = useState(false);
  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setAnswers({ ...answers, mood });
  };

  const generateWellnessPlan = (userData: any): WellnessPlan => {
    const sleepQuality = userData.scale || "Okay";
    const stressLevel = userData.scale2 || "Moderate";
    const energyLevel = userData.scale || "Moderate";
    const mood = userData.mood || "Calm";

    // Generate personalized diet recommendations
    let dietPlan = {
      breakfast: "Oatmeal with berries and nuts",
      lunch: "Quinoa salad with vegetables",
      dinner: "Grilled salmon with sweet potato",
      snacks: ["Greek yogurt", "Mixed nuts", "Fresh fruit"],
      hydration: "8-10 glasses of water daily"
    };

    // Adjust based on energy and stress
    if (energyLevel === "Very Low" || energyLevel === "Low") {
      dietPlan.breakfast = "Protein smoothie with banana and spinach";
      dietPlan.snacks = ["Energy balls", "Green tea", "Dark chocolate"];
    }

    if (stressLevel === "High" || stressLevel === "Very High") {
      dietPlan.snacks = ["Chamomile tea", "Almonds", "Blueberries"];
      dietPlan.hydration = "10-12 glasses of water daily + herbal teas";
    }

    // Generate sleep recommendations
    let sleepHours = 8;
    let bedtime = "10:30 PM";
    let wakeTime = "6:30 AM";

    if (sleepQuality === "Poor" || sleepQuality === "Terrible") {
      sleepHours = 9;
      bedtime = "10:00 PM";
      wakeTime = "7:00 AM";
    }

    const sleepRoutine = [
      "No screens 1 hour before bed",
      "Read or listen to calming music",
      "Practice deep breathing",
      "Keep room cool and dark"
    ];

    if (stressLevel === "High" || stressLevel === "Very High") {
      sleepRoutine.unshift("Take a warm bath or shower");
      sleepRoutine.push("Try progressive muscle relaxation");
    }

    // Generate reminders
    const reminders = [
      "Drink water every 2 hours",
      "Take a 5-minute break every hour",
      "Practice gratitude before bed"
    ];

    if (mood === "Stressed" || stressLevel === "High") {
      reminders.push("Do 3 deep breaths when feeling overwhelmed");
      reminders.push("Step outside for fresh air");
    }

    return {
      diet: dietPlan,
      sleep: {
        recommendedHours: sleepHours,
        bedtime,
        wakeTime,
        routine: sleepRoutine
      },
      reminders
    };
  };

  const handleAnswer = (answer: any) => {
    const questionType = questions[currentQuestion].type;
    const newAnswers = { ...answers, [questionType]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate wellness plan
      const plan = generateWellnessPlan(newAnswers);
      setWellnessPlan(plan);
      setShowPlan(true);
      onComplete(newAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showPlan && wellnessPlan) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="bg-gradient-to-br from-card to-wellness-calm/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-primary mr-2" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Your Personalized Wellness Plan
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              Based on your responses, here's your customized plan for optimal well-being
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Diet Plan */}
            <Card className="p-6 bg-wellness-energy/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-wellness-energy" />
                Nutrition Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Meals</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Breakfast:</strong> {wellnessPlan.diet.breakfast}</div>
                    <div><strong>Lunch:</strong> {wellnessPlan.diet.lunch}</div>
                    <div><strong>Dinner:</strong> {wellnessPlan.diet.dinner}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Snacks & Hydration</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Snacks:</strong> {wellnessPlan.diet.snacks.join(", ")}</div>
                    <div><strong>Hydration:</strong> {wellnessPlan.diet.hydration}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sleep Plan */}
            <Card className="p-6 bg-wellness-calm/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Moon className="w-5 h-5 mr-2 text-wellness-calm" />
                Sleep Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <strong>Bedtime:</strong> {wellnessPlan.sleep.bedtime}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <strong>Wake Time:</strong> {wellnessPlan.sleep.wakeTime}
                    </div>
                    <div><strong>Sleep Duration:</strong> {wellnessPlan.sleep.recommendedHours} hours</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Bedtime Routine</h4>
                  <ul className="space-y-1 text-sm">
                    {wellnessPlan.sleep.routine.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Daily Reminders */}
            <Card className="p-6 bg-primary/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Daily Reminders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {wellnessPlan.reminders.map((reminder, index) => (
                  <Badge key={index} variant="outline" className="justify-start p-3">
                    {reminder}
                  </Badge>
                ))}
              </div>
            </Card>

            <div className="flex justify-center space-x-4">
              <EnhancedButton variant="wellness" size="lg">
                Set Up Reminders
              </EnhancedButton>
              <EnhancedButton variant="outline" onClick={() => setShowPlan(false)}>
                Retake Assessment
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {questions[currentQuestion].options?.map((option) => (
                <EnhancedButton
                  key={option}
                  variant="outline"
                  size="xl"
                  onClick={() => handleAnswer(option)}
                  className="h-16 justify-start space-x-3"
                >
                  <span>{option}</span>
                </EnhancedButton>
              ))}
            </div>
          )}

          {questions[currentQuestion].type === "support" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestion].options?.map((option) => (
                <EnhancedButton
                  key={option}
                  variant="outline"
                  size="xl"
                  onClick={() => handleAnswer(option)}
                  className="h-16 justify-start space-x-3"
                >
                  <span>{option}</span>
                </EnhancedButton>
              ))}
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