import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calculator, AlertTriangle, Target, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TradingSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    defaultRiskPercent: "2",
    defaultTimeframe: "1H",
    defaultExchange: "BINANCE",
    autoCalculatePosition: true,
    showPnLInPercent: true,
    enableSoundAlerts: true,
    confirmTrades: true,
    darkPool: false,
    riskWarningLevel: "5",
    maxDailyTrades: "10",
    defaultStopLoss: "2",
    defaultTakeProfit: "4",
    tradingSessionStart: "09:00",
    tradingSessionEnd: "16:00"
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Save to localStorage or backend
    localStorage.setItem('tradingSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your trading preferences have been updated.",
    });
  };

  const resetToDefaults = () => {
    setSettings({
      defaultRiskPercent: "2",
      defaultTimeframe: "1H",
      defaultExchange: "BINANCE",
      autoCalculatePosition: true,
      showPnLInPercent: true,
      enableSoundAlerts: true,
      confirmTrades: true,
      darkPool: false,
      riskWarningLevel: "5",
      maxDailyTrades: "10",
      defaultStopLoss: "2",
      defaultTakeProfit: "4",
      tradingSessionStart: "09:00",
      tradingSessionEnd: "16:00"
    });
    toast({
      title: "Reset Complete",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Risk Management */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Risk Management</h3>
            <p className="text-sm text-muted-foreground">Configure your risk parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="risk-percent">Default Risk Per Trade (%)</Label>
            <Input
              id="risk-percent"
              type="number"
              value={settings.defaultRiskPercent}
              onChange={(e) => updateSetting('defaultRiskPercent', e.target.value)}
              max="10"
              min="0.1"
              step="0.1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 1-3% of account balance
            </p>
          </div>

          <div>
            <Label htmlFor="risk-warning">Risk Warning Level (%)</Label>
            <Input
              id="risk-warning"
              type="number"
              value={settings.riskWarningLevel}
              onChange={(e) => updateSetting('riskWarningLevel', e.target.value)}
              max="20"
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Show warning when risk exceeds this level
            </p>
          </div>

          <div>
            <Label htmlFor="stop-loss">Default Stop Loss (%)</Label>
            <Input
              id="stop-loss"
              type="number"
              value={settings.defaultStopLoss}
              onChange={(e) => updateSetting('defaultStopLoss', e.target.value)}
              max="10"
              min="0.1"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="take-profit">Default Take Profit (%)</Label>
            <Input
              id="take-profit"
              type="number"
              value={settings.defaultTakeProfit}
              onChange={(e) => updateSetting('defaultTakeProfit', e.target.value)}
              max="20"
              min="0.1"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="max-trades">Max Daily Trades</Label>
            <Input
              id="max-trades"
              type="number"
              value={settings.maxDailyTrades}
              onChange={(e) => updateSetting('maxDailyTrades', e.target.value)}
              max="50"
              min="1"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Auto-Calculate Position Size</p>
                <p className="text-sm text-muted-foreground">Automatically calculate position based on risk</p>
              </div>
            </div>
            <Switch 
              checked={settings.autoCalculatePosition}
              onCheckedChange={(value) => updateSetting('autoCalculatePosition', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Confirm All Trades</p>
                <p className="text-sm text-muted-foreground">Show confirmation dialog before placing trades</p>
              </div>
            </div>
            <Switch 
              checked={settings.confirmTrades}
              onCheckedChange={(value) => updateSetting('confirmTrades', value)}
            />
          </div>
        </div>
      </Card>

      {/* Trading Preferences */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Trading Preferences</h3>
            <p className="text-sm text-muted-foreground">Default trading configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Default Timeframe</Label>
            <Select value={settings.defaultTimeframe} onValueChange={(value) => updateSetting('defaultTimeframe', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Minute</SelectItem>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="15m">15 Minutes</SelectItem>
                <SelectItem value="1H">1 Hour</SelectItem>
                <SelectItem value="4H">4 Hours</SelectItem>
                <SelectItem value="1D">1 Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Default Exchange</Label>
            <Select value={settings.defaultExchange} onValueChange={(value) => updateSetting('defaultExchange', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BINANCE">Binance</SelectItem>
                <SelectItem value="COINBASE">Coinbase</SelectItem>
                <SelectItem value="NASDAQ">NASDAQ</SelectItem>
                <SelectItem value="NYSE">NYSE</SelectItem>
                <SelectItem value="FOREX">Forex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="session-start">Trading Session Start</Label>
            <Input
              id="session-start"
              type="time"
              value={settings.tradingSessionStart}
              onChange={(e) => updateSetting('tradingSessionStart', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="session-end">Trading Session End</Label>
            <Input
              id="session-end"
              type="time"
              value={settings.tradingSessionEnd}
              onChange={(e) => updateSetting('tradingSessionEnd', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Show PnL in Percentage</p>
                <p className="text-sm text-muted-foreground">Display profit/loss as percentage instead of dollar amount</p>
              </div>
            </div>
            <Switch 
              checked={settings.showPnLInPercent}
              onCheckedChange={(value) => updateSetting('showPnLInPercent', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Enable Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Play sounds for price alerts and notifications</p>
              </div>
            </div>
            <Switch 
              checked={settings.enableSoundAlerts}
              onCheckedChange={(value) => updateSetting('enableSoundAlerts', value)}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={saveSettings} className="flex-1">
          Save Settings
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}