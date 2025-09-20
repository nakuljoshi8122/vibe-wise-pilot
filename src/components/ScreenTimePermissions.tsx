import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Smartphone, Bell, MapPin, CheckCircle, XCircle, Info } from "lucide-react";
import { screenTimeService, AccessibilityPermissions } from "@/lib/screenTime";

interface ScreenTimePermissionsProps {
  onPermissionsChange: (permissions: AccessibilityPermissions) => void;
}

export const ScreenTimePermissions = ({ onPermissionsChange }: ScreenTimePermissionsProps) => {
  const [permissions, setPermissions] = useState<AccessibilityPermissions>({
    screenTime: false,
    notifications: false,
    location: false
  });
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const currentPermissions = screenTimeService.getPermissions();
    setPermissions(currentPermissions);
    onPermissionsChange(currentPermissions);
  }, [onPermissionsChange]);

  const handleRequestPermissions = async () => {
    setIsRequesting(true);
    try {
      const newPermissions = await screenTimeService.requestPermissions();
      setPermissions(newPermissions);
      onPermissionsChange(newPermissions);
    } catch (error) {
      console.error('Failed to request permissions:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const getPermissionIcon = (granted: boolean) => {
    return granted ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getPermissionBadge = (granted: boolean) => {
    return (
      <Badge variant={granted ? "default" : "destructive"} className="text-xs">
        {granted ? "Granted" : "Required"}
      </Badge>
    );
  };

  const allPermissionsGranted = permissions.screenTime && permissions.notifications;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary" />
          Accessibility Permissions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            To provide accurate wellness insights, we need access to your device usage data. 
            All data stays on your device and is used only for your personal wellness tracking.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Screen Time Access</h4>
                <p className="text-sm text-muted-foreground">
                  Track app usage and screen time for wellness insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.screenTime)}
              {getPermissionBadge(permissions.screenTime)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Send mindful break reminders and wellness tips
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.notifications)}
              {getPermissionBadge(permissions.notifications)}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Location (Optional)</h4>
                <p className="text-sm text-muted-foreground">
                  For location-based wellness suggestions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>

        {!allPermissionsGranted && (
          <EnhancedButton
            variant="wellness"
            className="w-full"
            onClick={handleRequestPermissions}
            disabled={isRequesting}
          >
            {isRequesting ? "Requesting Permissions..." : "Grant Permissions"}
          </EnhancedButton>
        )}

        {allPermissionsGranted && (
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-green-800">All Set!</h4>
            <p className="text-sm text-green-600">
              Your wellness analytics are now active and tracking.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Your data never leaves your device</p>
          <p>• You can revoke permissions anytime in settings</p>
          <p>• We only collect usage patterns, not content</p>
        </div>
      </CardContent>
    </Card>
  );
};