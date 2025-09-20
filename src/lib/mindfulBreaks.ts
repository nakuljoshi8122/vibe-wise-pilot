// Mindful Breaks Timer System
export interface BreakTimer {
  id: string;
  name: string;
  duration: number; // in seconds
  type: 'breathing' | 'stretch' | 'eye-rest' | 'gratitude' | 'meditation';
  instructions: string[];
  isActive: boolean;
  timeRemaining: number;
}

export interface BreakSession {
  id: string;
  breakType: string;
  startTime: Date;
  duration: number;
  completed: boolean;
}

export class MindfulBreaksService {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private activeBreaks: Map<string, BreakTimer> = new Map();

  private breakTemplates: Omit<BreakTimer, 'id' | 'isActive' | 'timeRemaining'>[] = [
    {
      name: 'Deep Breathing',
      duration: 180, // 3 minutes
      type: 'breathing',
      instructions: [
        'Sit comfortably with your back straight',
        'Close your eyes or soften your gaze',
        'Inhale slowly for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly for 6 counts',
        'Repeat this cycle'
      ]
    },
    {
      name: 'Gentle Stretch',
      duration: 120, // 2 minutes
      type: 'stretch',
      instructions: [
        'Stand up from your chair',
        'Roll your shoulders backward 5 times',
        'Gently turn your head left and right',
        'Reach your arms up and stretch',
        'Touch your toes or reach toward the floor',
        'Take deep breaths throughout'
      ]
    },
    {
      name: 'Eye Rest Exercise',
      duration: 20, // 20 seconds
      type: 'eye-rest',
      instructions: [
        'Look at something 20 feet away',
        'Focus on the distant object',
        'Blink slowly several times',
        'Let your eyes relax completely'
      ]
    },
    {
      name: 'Gratitude Moment',
      duration: 60, // 1 minute
      type: 'gratitude',
      instructions: [
        'Take three deep breaths',
        'Think of one thing you\'re grateful for today',
        'Feel the positive emotion in your body',
        'Smile and appreciate this moment'
      ]
    },
    {
      name: 'Mini Meditation',
      duration: 300, // 5 minutes
      type: 'meditation',
      instructions: [
        'Find a comfortable seated position',
        'Close your eyes gently',
        'Focus on your natural breathing',
        'When thoughts arise, gently return to your breath',
        'Notice sensations in your body',
        'End with three deep breaths'
      ]
    }
  ];

  createBreakTimer(templateName: string): BreakTimer {
    const template = this.breakTemplates.find(t => t.name === templateName);
    if (!template) {
      throw new Error(`Break template "${templateName}" not found`);
    }

    const timer: BreakTimer = {
      id: `break_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...template,
      isActive: false,
      timeRemaining: template.duration
    };

    return timer;
  }

  startBreak(breakTimer: BreakTimer, onTick?: (timeRemaining: number) => void, onComplete?: () => void): void {
    if (this.activeBreaks.has(breakTimer.id)) {
      this.stopBreak(breakTimer.id);
    }

    breakTimer.isActive = true;
    breakTimer.timeRemaining = breakTimer.duration;
    this.activeBreaks.set(breakTimer.id, breakTimer);

    const interval = setInterval(() => {
      breakTimer.timeRemaining -= 1;
      
      if (onTick) {
        onTick(breakTimer.timeRemaining);
      }

      if (breakTimer.timeRemaining <= 0) {
        this.completeBreak(breakTimer.id);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    this.timers.set(breakTimer.id, interval);

    // Log the session start
    this.logBreakSession(breakTimer);
  }

  pauseBreak(breakId: string): void {
    const timer = this.timers.get(breakId);
    const breakTimer = this.activeBreaks.get(breakId);
    
    if (timer && breakTimer) {
      clearInterval(timer);
      breakTimer.isActive = false;
      this.timers.delete(breakId);
    }
  }

  resumeBreak(breakId: string, onTick?: (timeRemaining: number) => void, onComplete?: () => void): void {
    const breakTimer = this.activeBreaks.get(breakId);
    if (!breakTimer) return;

    this.startBreak(breakTimer, onTick, onComplete);
  }

  stopBreak(breakId: string): void {
    const timer = this.timers.get(breakId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(breakId);
    }
    this.activeBreaks.delete(breakId);
  }

  private completeBreak(breakId: string): void {
    const breakTimer = this.activeBreaks.get(breakId);
    if (breakTimer) {
      breakTimer.isActive = false;
      this.stopBreak(breakId);
      
      // Update session as completed
      this.updateBreakSession(breakId, true);
      
      // Show completion notification
      this.showCompletionNotification(breakTimer);
    }
  }

  private logBreakSession(breakTimer: BreakTimer): void {
    const session: BreakSession = {
      id: breakTimer.id,
      breakType: breakTimer.name,
      startTime: new Date(),
      duration: breakTimer.duration,
      completed: false
    };

    const sessions = this.getBreakSessions();
    sessions.push(session);
    localStorage.setItem('mindful_break_sessions', JSON.stringify(sessions));
  }

  private updateBreakSession(breakId: string, completed: boolean): void {
    const sessions = this.getBreakSessions();
    const sessionIndex = sessions.findIndex(s => s.id === breakId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].completed = completed;
      localStorage.setItem('mindful_break_sessions', JSON.stringify(sessions));
    }
  }

  getBreakSessions(): BreakSession[] {
    const stored = localStorage.getItem('mindful_break_sessions');
    return stored ? JSON.parse(stored) : [];
  }

  getTodaysSessions(): BreakSession[] {
    const today = new Date().toDateString();
    return this.getBreakSessions().filter(session => 
      new Date(session.startTime).toDateString() === today
    );
  }

  getBreakTemplates() {
    return this.breakTemplates;
  }

  getActiveBreaks(): BreakTimer[] {
    return Array.from(this.activeBreaks.values());
  }

  private showCompletionNotification(breakTimer: BreakTimer): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Mindful Break Complete! 🧘‍♀️', {
        body: `Great job completing your ${breakTimer.name}. How do you feel?`,
        icon: '/favicon.ico'
      });
    }
  }

  // Auto-reminder system
  setupAutoReminders(intervalMinutes: number = 60): void {
    setInterval(() => {
      const lastBreak = this.getLastBreakTime();
      const now = Date.now();
      const timeSinceLastBreak = now - lastBreak;
      const reminderInterval = intervalMinutes * 60 * 1000;

      if (timeSinceLastBreak >= reminderInterval) {
        this.showBreakReminder();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private getLastBreakTime(): number {
    const sessions = this.getBreakSessions();
    if (sessions.length === 0) return 0;
    
    const lastSession = sessions[sessions.length - 1];
    return new Date(lastSession.startTime).getTime();
  }

  private showBreakReminder(): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Time for a Mindful Break! 🌱', {
        body: 'You\'ve been focused for a while. Take a moment to recharge.',
        icon: '/favicon.ico'
      });
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export const mindfulBreaksService = new MindfulBreaksService();