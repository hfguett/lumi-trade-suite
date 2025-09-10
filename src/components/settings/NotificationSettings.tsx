import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Smartphone, Volume2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Price Alerts
    priceAlerts: true,
    priceAlertSound: true,
    priceAlertEmail: false,
    priceAlertPush: true,
    
    // Trade Notifications
    tradeExecuted: true,
    tradeExecutedSound: true,
    tradeExecutedEmail: true,
    tradeExecutedPush: true,
    
    // Market Notifications
    marketNews: true,
    marketNewsSound: false,
    marketNewsEmail: true,
    marketNewsFrequency: "important",
    
    // System Notifications
    systemUpdates: true,
    systemUpdatesEmail: true,
    maintenanceAlerts: true,
    
    // General Settings
    soundVolume: "medium",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    quietHoursEnabled: true,
    
    // Risk Alerts
    riskWarnings: true,
    riskWarningsSound: true,
    drawdownAlerts: true,
    profitTargetAlerts: true
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const testNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification from TradePro Analytics',
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Test Notification', {
              body: 'This is a test notification from TradePro Analytics',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
    
    toast({
      title: "Test Notification Sent",
      description: "Check your browser notifications",
    });
  };

  return (
    <div className="space-y-6">
      {/* Price Alerts */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Bell className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Price Alerts</h3>
            <p className="text-sm text-muted-foreground">Configure price movement notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Price Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when price targets are hit</p>
            </div>
            <Switch 
              checked={settings.priceAlerts}
              onCheckedChange={(value) => updateSetting('priceAlerts', value)}
            />
          </div>

          {settings.priceAlerts && (
            <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span>Sound Alerts</span>
                </div>
                <Switch 
                  checked={settings.priceAlertSound}
                  onCheckedChange={(value) => updateSetting('priceAlertSound', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>Email Notifications</span>
                </div>
                <Switch 
                  checked={settings.priceAlertEmail}
                  onCheckedChange={(value) => updateSetting('priceAlertEmail', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span>Push Notifications</span>
                </div>
                <Switch 
                  checked={settings.priceAlertPush}
                  onCheckedChange={(value) => updateSetting('priceAlertPush', value)}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Trade Notifications */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Trade Notifications</h3>
            <p className="text-sm text-muted-foreground">Alerts for trade execution and updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Trade Executed Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified when trades are executed</p>
            </div>
            <Switch 
              checked={settings.tradeExecuted}
              onCheckedChange={(value) => updateSetting('tradeExecuted', value)}
            />
          </div>

          {settings.tradeExecuted && (
            <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span>Sound Alerts</span>
                </div>
                <Switch 
                  checked={settings.tradeExecutedSound}
                  onCheckedChange={(value) => updateSetting('tradeExecutedSound', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>Email Notifications</span>
                </div>
                <Switch 
                  checked={settings.tradeExecutedEmail}
                  onCheckedChange={(value) => updateSetting('tradeExecutedEmail', value)}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Risk Alerts */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Risk Alerts</h3>
            <p className="text-sm text-muted-foreground">Important risk management notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Risk Level Warnings</p>
              <p className="text-sm text-muted-foreground">Alert when risk exceeds set thresholds</p>
            </div>
            <Switch 
              checked={settings.riskWarnings}
              onCheckedChange={(value) => updateSetting('riskWarnings', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Drawdown Alerts</p>
              <p className="text-sm text-muted-foreground">Notify when account drawdown reaches limits</p>
            </div>
            <Switch 
              checked={settings.drawdownAlerts}
              onCheckedChange={(value) => updateSetting('drawdownAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profit Target Alerts</p>
              <p className="text-sm text-muted-foreground">Celebrate when profit targets are achieved</p>
            </div>
            <Switch 
              checked={settings.profitTargetAlerts}
              onCheckedChange={(value) => updateSetting('profitTargetAlerts', value)}
            />
          </div>
        </div>
      </Card>

      {/* General Settings */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Volume2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">General Settings</h3>
            <p className="text-sm text-muted-foreground">Overall notification preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Sound Volume</Label>
            <Select value={settings.soundVolume} onValueChange={(value) => updateSetting('soundVolume', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Market News Frequency</Label>
            <Select value={settings.marketNewsFrequency} onValueChange={(value) => updateSetting('marketNewsFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All News</SelectItem>
                <SelectItem value="important">Important Only</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Quiet Hours</p>
              <p className="text-sm text-muted-foreground">Disable notifications during specified hours</p>
            </div>
            <Switch 
              checked={settings.quietHoursEnabled}
              onCheckedChange={(value) => updateSetting('quietHoursEnabled', value)}
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={saveSettings} className="flex-1">
          Save Settings
        </Button>
        <Button variant="outline" onClick={testNotification}>
          Test Notification
        </Button>
      </div>
    </div>
  );
}