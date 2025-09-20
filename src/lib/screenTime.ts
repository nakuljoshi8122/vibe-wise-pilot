// Screen Time and Device Analytics
export interface ScreenTimeData {
  totalScreenTime: number; // in minutes
  pickups: number;
  mostUsedApp: string;
  appUsage: { [appName: string]: number };
  lastUpdated: Date;
}

export interface AccessibilityPermissions {
  screenTime: boolean;
  notifications: boolean;
  location: boolean;
}

export class ScreenTimeService {
  private permissions: AccessibilityPermissions = {
    screenTime: false,
    notifications: false,
    location: false
  };

  async requestPermissions(): Promise<AccessibilityPermissions> {
    // For web applications, we'll simulate permission requests
    // In a real mobile app, this would interface with native APIs
    
    try {
      // Request notification permission (real API)
      if ('Notification' in window) {
        const notificationPermission = await Notification.requestPermission();
        this.permissions.notifications = notificationPermission === 'granted';
      }

      // For screen time, we'll show a modal explaining the need for permissions
      // In a real app, this would trigger native permission dialogs
      const screenTimePermission = await this.showPermissionDialog('screen time tracking');
      this.permissions.screenTime = screenTimePermission;

      // Store permissions
      localStorage.setItem('accessibility_permissions', JSON.stringify(this.permissions));
      
      return this.permissions;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return this.permissions;
    }
  }

  private async showPermissionDialog(permissionType: string): Promise<boolean> {
    return new Promise((resolve) => {
      const granted = confirm(
        `To provide accurate ${permissionType} insights, we need access to your device's usage data. ` +
        `This data stays on your device and is used only for wellness insights. Grant permission?`
      );
      resolve(granted);
    });
  }

  getPermissions(): AccessibilityPermissions {
    const stored = localStorage.getItem('accessibility_permissions');
    if (stored) {
      this.permissions = JSON.parse(stored);
    }
    return this.permissions;
  }

  async getScreenTimeData(): Promise<ScreenTimeData> {
    if (!this.permissions.screenTime) {
      throw new Error('Screen time permission not granted');
    }

    // In a real app, this would interface with native APIs
    // For demo purposes, we'll generate realistic mock data
    const mockData: ScreenTimeData = {
      totalScreenTime: Math.floor(Math.random() * 480) + 120, // 2-10 hours
      pickups: Math.floor(Math.random() * 100) + 30, // 30-130 pickups
      mostUsedApp: this.getRandomApp(),
      appUsage: this.generateAppUsage(),
      lastUpdated: new Date()
    };

    // Store for consistency
    localStorage.setItem('screen_time_data', JSON.stringify(mockData));
    return mockData;
  }

  private getRandomApp(): string {
    const apps = ['Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Twitter', 'Facebook', 'Snapchat', 'Discord'];
    return apps[Math.floor(Math.random() * apps.length)];
  }

  private generateAppUsage(): { [appName: string]: number } {
    const apps = ['Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Twitter', 'Chrome', 'Messages'];
    const usage: { [appName: string]: number } = {};
    
    apps.forEach(app => {
      usage[app] = Math.floor(Math.random() * 120) + 10; // 10-130 minutes
    });
    
    return usage;
  }

  // Real-time screen time tracking (simplified)
  startTracking() {
    if (!this.permissions.screenTime) return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Track user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, this.handleUserActivity.bind(this), { passive: true });
    });
  }

  private handleVisibilityChange() {
    const now = Date.now();
    if (document.hidden) {
      localStorage.setItem('last_active', now.toString());
    } else {
      const lastActive = localStorage.getItem('last_active');
      if (lastActive) {
        const sessionTime = now - parseInt(lastActive);
        this.updateSessionTime(sessionTime);
      }
    }
  }

  private handleUserActivity() {
    localStorage.setItem('last_activity', Date.now().toString());
  }

  private updateSessionTime(sessionTime: number) {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`session_time_${today}`);
    const currentTime = stored ? parseInt(stored) : 0;
    localStorage.setItem(`session_time_${today}`, (currentTime + sessionTime).toString());
  }
}

export const screenTimeService = new ScreenTimeService();