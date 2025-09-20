import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Clock, Moon, BarChart3, Pause, Play, Settings, Timer } from "lucide-react";
import { ScreenTimePermissions } from "./ScreenTimePermissions";
import { MindfulBreakTimer } from "./MindfulBreakTimer";
import { screenTimeService, ScreenTimeData, AccessibilityPermissions } from "@/lib/screenTime";
import { mindfulBreaksService, BreakTimer } from "@/lib/mindfulBreaks";

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
  const [permissions, setPermissions] = useState<AccessibilityPermissions>({
    screenTime: false,
    notifications: false,
    location: false
  });
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData | null>(null);
  const [activeBreakTimer, setActiveBreakTimer] = useState<BreakTimer | null>(null);
  const [showBreakTimer, setShowBreakTimer] = useState(false);

  useEffect(() => {
    // Initialize screen time tracking
    screenTimeService.startTracking();
    
    // Setup auto reminders for breaks
    mindfulBreaksService.setupAutoReminders(60); // Every hour
    
    // Load screen time data if permissions are granted
    const loadScreenTimeData = async () => {
      if (permissions.screenTime) {
        try {
          const data = await screenTimeService.getScreenTimeData();
          setScreenTimeData(data);
        } catch (error) {
          console.error('Failed to load screen time data:', error);
        }
      }
    };
    
    loadScreenTimeData();
  }, [permissions.screenTime]);

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

  const handlePermissionsChange = (newPermissions: AccessibilityPermissions) => {
    setPermissions(newPermissions);
  };

  const startMindfulBreak = (templateName: string) => {
    const breakTimer = mindfulBreaksService.createBreakTimer(templateName);
    setActiveBreakTimer(breakTimer);
    setShowBreakTimer(true);
  };

  const handleBreakComplete = () => {
    setShowBreakTimer(false);
    setActiveBreakTimer(null);
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

  // Calculate focus score based on screen time data
  const calculateFocusScore = () => {
    if (!screenTimeData) return 72; // Default score
    
    const maxHealthyScreenTime = 6 * 60; // 6 hours in minutes
    const screenTimeScore = Math.max(0, 100 - (screenTimeData.totalScreenTime / maxHealthyScreenTime) * 100);
    
    const maxHealthyPickups = 80;
    const pickupsScore = Math.max(0, 100 - (screenTimeData.pickups / maxHealthyPickups) * 100);
    
    return Math.round((screenTimeScore + pickupsScore) / 2);
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="focus">Focus Timer</TabsTrigger>
              <TabsTrigger value="sleep">Sleep Mode</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="breaks">Mindful Breaks</TabsTrigger>
              <TabsTrigger value="permissions">Settings</TabsTrigger>
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
              {!permissions.screenTime ? (
                <Card className="p-6 text-center">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Enable Screen Time Tracking</h3>
                  <p className="text-muted-foreground mb-4">
                    Grant permissions to see your detailed usage analytics
                  </p>
                  <EnhancedButton variant="outline" onClick={() => setActiveTab("permissions")}>
                    Go to Settings
                  </EnhancedButton>
                </Card>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Today's Screen Time</h3>
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {screenTimeData ? `${(screenTimeData.totalScreenTime / 60).toFixed(1)}h` : '0h'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {screenTimeData ? 'Updated today' : 'No data available'}
                  </p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Phone Pickups</h3>
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-wellness-energy mb-2">
                    {screenTimeData?.pickups || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Times today
                  </p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Most Used App</h3>
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-xl font-bold text-accent mb-2">
                    {screenTimeData?.mostUsedApp || 'Unknown'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Most used today
                  </p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Focus Score</h3>
                    <Badge variant="secondary">{calculateFocusScore()}/100</Badge>
                  </div>
                  <Progress value={calculateFocusScore()} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Based on app usage patterns
                  </p>
                </Card>
              </div>
              )}
            </TabsContent>

            <TabsContent value="breaks" className="space-y-6">
              {showBreakTimer && activeBreakTimer ? (
                <MindfulBreakTimer
                  breakTimer={activeBreakTimer}
                  onComplete={handleBreakComplete}
                  onClose={() => setShowBreakTimer(false)}
                />
              ) : (
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
                      onClick={() => startMindfulBreak('Deep Breathing')}
                    >
                      <Timer className="w-6 h-6 mb-2" />
                      <span className="text-lg mb-1">Breathing Exercise</span>
                      <span className="text-sm opacity-75">3 minutes</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="calm" 
                      className="h-20 flex-col"
                      onClick={() => startMindfulBreak('Gentle Stretch')}
                    >
                      <Timer className="w-6 h-6 mb-2" />
                      <span className="text-lg mb-1">Stretch Break</span>
                      <span className="text-sm opacity-75">2 minutes</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => startMindfulBreak('Eye Rest Exercise')}
                    >
                      <Timer className="w-6 h-6 mb-2" />
                      <span className="text-lg mb-1">Eye Rest</span>
                      <span className="text-sm opacity-75">20 seconds</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="secondary" 
                      className="h-20 flex-col"
                      onClick={() => startMindfulBreak('Gratitude Moment')}
                    >
                      <Timer className="w-6 h-6 mb-2" />
                      <span className="text-lg mb-1">Gratitude Moment</span>
                      <span className="text-sm opacity-75">1 minute</span>
                    </EnhancedButton>
                    
                    <EnhancedButton 
                      variant="mood" 
                      className="h-20 flex-col md:col-span-2"
                      onClick={() => startMindfulBreak('Mini Meditation')}
                    >
                      <Timer className="w-6 h-6 mb-2" />
                      <span className="text-lg mb-1">Mini Meditation</span>
                      <span className="text-sm opacity-75">5 minutes</span>
                    </EnhancedButton>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Today's Break Sessions</h4>
                    <div className="text-sm text-muted-foreground">
                      {mindfulBreaksService.getTodaysSessions().length} breaks completed today
                    </div>
                  </div>
                </div>
              </Card>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <ScreenTimePermissions onPermissionsChange={handlePermissionsChange} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};