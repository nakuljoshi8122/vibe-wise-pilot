import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { BreakTimer, mindfulBreaksService } from "@/lib/mindfulBreaks";

interface MindfulBreakTimerProps {
  breakTimer: BreakTimer;
  onComplete?: () => void;
  onClose?: () => void;
}

export const MindfulBreakTimer = ({ breakTimer, onComplete, onClose }: MindfulBreakTimerProps) => {
  const [currentTimer, setCurrentTimer] = useState<BreakTimer>(breakTimer);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentTimer(breakTimer);
  }, [breakTimer]);

  const handleStart = () => {
    mindfulBreaksService.startBreak(
      currentTimer,
      (timeRemaining) => {
        setCurrentTimer(prev => ({ ...prev, timeRemaining }));
        
        // Auto-advance instructions based on time
        const totalSteps = currentTimer.instructions.length;
        const timePerStep = currentTimer.duration / totalSteps;
        const elapsed = currentTimer.duration - timeRemaining;
        const step = Math.min(Math.floor(elapsed / timePerStep), totalSteps - 1);
        setCurrentStep(step);
      },
      () => {
        setCurrentTimer(prev => ({ ...prev, isActive: false }));
        if (onComplete) onComplete();
      }
    );
    
    setCurrentTimer(prev => ({ ...prev, isActive: true }));
  };

  const handlePause = () => {
    mindfulBreaksService.pauseBreak(currentTimer.id);
    setCurrentTimer(prev => ({ ...prev, isActive: false }));
  };

  const handleResume = () => {
    mindfulBreaksService.resumeBreak(
      currentTimer.id,
      (timeRemaining) => {
        setCurrentTimer(prev => ({ ...prev, timeRemaining }));
      },
      () => {
        setCurrentTimer(prev => ({ ...prev, isActive: false }));
        if (onComplete) onComplete();
      }
    );
    setCurrentTimer(prev => ({ ...prev, isActive: true }));
  };

  const handleStop = () => {
    mindfulBreaksService.stopBreak(currentTimer.id);
    setCurrentTimer(prev => ({ 
      ...prev, 
      isActive: false, 
      timeRemaining: prev.duration 
    }));
    setCurrentStep(0);
  };

  const handleReset = () => {
    mindfulBreaksService.stopBreak(currentTimer.id);
    setCurrentTimer(prev => ({ 
      ...prev, 
      isActive: false, 
      timeRemaining: prev.duration 
    }));
    setCurrentStep(0);
  };

  const progress = ((currentTimer.duration - currentTimer.timeRemaining) / currentTimer.duration) * 100;
  const formattedTime = mindfulBreaksService.formatTime(currentTimer.timeRemaining);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'stretch': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'eye-rest': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'gratitude': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'meditation': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getTypeColor(currentTimer.type)}>
            {currentTimer.type.charAt(0).toUpperCase() + currentTimer.type.slice(1)}
          </Badge>
          {onClose && (
            <EnhancedButton variant="ghost" size="sm" onClick={onClose}>
              ×
            </EnhancedButton>
          )}
        </div>
        <CardTitle className="text-xl">{currentTimer.name}</CardTitle>
        <div className="text-3xl font-mono font-bold text-primary">
          {formattedTime}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-2" />
        
        <div className="text-center space-y-4">
          <div className="min-h-[60px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentTimer.instructions[currentStep] || currentTimer.instructions[0]}
            </p>
          </div>
          
          <div className="flex justify-center space-x-2">
            {!currentTimer.isActive ? (
              currentTimer.timeRemaining === currentTimer.duration ? (
                <EnhancedButton variant="wellness" onClick={handleStart}>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </EnhancedButton>
              ) : (
                <EnhancedButton variant="wellness" onClick={handleResume}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </EnhancedButton>
              )
            ) : (
              <EnhancedButton variant="outline" onClick={handlePause}>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </EnhancedButton>
            )}
            
            <EnhancedButton variant="outline" onClick={handleStop}>
              <Square className="w-4 h-4 mr-2" />
              Stop
            </EnhancedButton>
            
            <EnhancedButton variant="ghost" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </EnhancedButton>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {currentTimer.instructions.length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};