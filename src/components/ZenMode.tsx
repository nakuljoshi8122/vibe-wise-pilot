import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Clock, Moon, BarChart3, Pause, Play, Settings } from "lucide-react";

interface ZenModeProps {
  onBack: () => void;
}

export const ZenMode = ({ onBack }: ZenModeProps) => {
  const [focusTimer, setFocusTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(focusTimer);
  const [sleepMode, setSleepMode] = useState(false);
  const [blueLight, setBlueLight] = useState(false);
  const [breakReminders, setBreakReminders] = useState(true);
  const [focusDuration, setFocusDuration] = useState([25]);

  // Mock usage data
  const [usageData] = useState({
    todayScreenTime: 4.2,
    averagePickups: 89,
    mostUsedApp: "Instagram",
    focusScore: 72
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
      // Show completion notification
      alert("Focus session complete! Time for a break.");
      setTimeRemaining(focusTimer);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, focusTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startFocusSession = () => {
    setIsTimerRunning(true);
  };

  const pauseFocusSession = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(focusTimer);
  };

  const activateSleepMode = () => {
    setSleepMode(!sleepMode);
    setBlueLight(!sleepMode);
    if (!sleepMode) {
      // Simulate sleep mode activation
      document.body.style.filter = 'sepia(1) saturate(0.8) hue-rotate(15deg)';
    } else {
      document.body.style.filter = 'none';
    }
  };

  const takeMindfulBreak = () => {
    // Simple breathing exercise
    alert("Take 3 deep breaths:\n1. Inhale for 4 seconds\n2. Hold for 4 seconds\n3. Exhale for 6 seconds\n\nRepeat 3 times.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-card to-wellness-calm/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-wellness-calm/20">
              <Moon className="w-8 h-8 text-wellness-calm" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-wellness-calm bg-clip-text text-transparent">
            Zen Mode
          </CardTitle>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create healthy digital boundaries and practice mindful technology use
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="focus" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="focus">Focus Timer</TabsTrigger>
              <TabsTrigger value="sleep">Sleep Mode</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="breaks">Mindful Breaks</TabsTrigger>
            </TabsList>

            <TabsContent value="focus" className="space-y-6">
              <Card className="p-6">
                <div className="text-center space-y-6">
                  <div className="text-6xl font-mono text-primary">
                    {formatTime(timeRemaining)}
                  </div>
                  <Progress 
                    value={((focusTimer - timeRemaining) / focusTimer) * 100} 
                    className="w-full h-3"
                  />
                  <div className="flex justify-center space-x-4">
                    {!isTimerRunning ? (
                      <EnhancedButton 
                        variant="wellness" 
                        size="lg"
                        onClick={startFocusSession}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Focus
                      </EnhancedButton>
                    ) : (
                      <EnhancedButton 
                        variant="outline" 
                        size="lg"
                        onClick={pauseFocusSession}
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </EnhancedButton>
                    )}
                    <EnhancedButton variant="ghost" onClick={resetTimer}>
                      Reset
                    </EnhancedButton>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Focus Duration (minutes)</label>
                    <Slider
                      value={focusDuration}
                      onValueChange={(value) => {
                        setFocusDuration(value);
                        const newDuration = value[0] * 60;
                        setFocusTimer(newDuration);
                        if (!isTimerRunning) {
                          setTimeRemaining(newDuration);
                        }
                      }}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      {focusDuration[0]} minutes
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="sleep" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Sleep Mode</h3>
                      <p className="text-muted-foreground">
                        Activate wind-down routine with blue light filtering
                      </p>
                    </div>
                    <Switch 
                      checked={sleepMode} 
                      onCheckedChange={activateSleepMode}
                    />
                  </div>
                  
                  {sleepMode && (
                    <div className="space-y-4 p-4 bg-wellness-calm/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>Blue Light Filter</span>
                        <Badge variant={blueLight ? "default" : "secondary"}>
                          {blueLight ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Notification Silence</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Screen Dimming</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  )}
                  
                  <EnhancedButton 
                    variant={sleepMode ? "destructive" : "calm"} 
                    className="w-full"
                    onClick={activateSleepMode}
                  >
                    {sleepMode ? "Deactivate Sleep Mode" : "Activate Sleep Mode"}
                  </EnhancedButton>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Today's Screen Time</h3>
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {usageData.todayScreenTime}h
                  </div>
                  <p className="text-sm text-muted-foreground">
                    15% less than yesterday
                  </p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Phone Pickups</h3>
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-wellness-energy mb-2">
                    {usageData.averagePickups}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average today
                  </p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Most Used App</h3>
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-xl font-bold text-accent mb-2">
                    {usageData.mostUsedApp}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2.1 hours today
                  </p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Focus Score</h3>
                    <Badge variant="secondary">{usageData.focusScore}/100</Badge>
                  </div>
                  <Progress value={usageData.focusScore} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Based on app usage patterns
                  </p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="breaks" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Break Reminders</h3>
                      <p className="text-muted-foreground">
                        Get reminded to take mindful breaks every hour
                      </p>
                    </div>
                    <Switch 
                      checked={breakReminders} 
                      onCheckedChange={setBreakReminders}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EnhancedButton 
                      variant="wellness" 
                      className="h-20 flex-col"
                      onClick={takeMindfulBreak}
                    >
                      <span className="text-lg mb-1">Breathing Exercise</span>
                      <span className="text-sm opacity-75">3 minutes</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="calm" 
                      className="h-20 flex-col"
                      onClick={() => alert("Stand up and stretch for 2 minutes. Move your shoulders, neck, and legs.")}
                    >
                      <span className="text-lg mb-1">Stretch Break</span>
                      <span className="text-sm opacity-75">2 minutes</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => alert("Look at something 20 feet away for 20 seconds to rest your eyes.")}
                    >
                      <span className="text-lg mb-1">Eye Rest</span>
                      <span className="text-sm opacity-75">20 seconds</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="secondary" 
                      className="h-20 flex-col"
                      onClick={() => alert("Take 5 deep breaths and think of 3 things you're grateful for.")}
                    >
                      <span className="text-lg mb-1">Gratitude Moment</span>
                      <span className="text-sm opacity-75">1 minute</span>
                    </EnhancedButton>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};