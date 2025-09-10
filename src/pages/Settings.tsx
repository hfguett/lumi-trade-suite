import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Palette, 
  TrendingUp, 
  Bell, 
  Shield, 
  Database, 
  User, 
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info
} from "lucide-react";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { TradingSettings } from "@/components/settings/TradingSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const exportData = async () => {
    setExportLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = {
        settings: localStorage.getItem('tradingSettings'),
        notifications: localStorage.getItem('notificationSettings'),
        trades: localStorage.getItem('trades'),
        watchlist: localStorage.getItem('watchlist'),
        alerts: localStorage.getItem('alerts'),
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tradepro-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your trading data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImportLoading(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Validate data structure
        if (!data.version || !data.exportDate) {
          throw new Error('Invalid backup file format');
        }

        // Restore data
        if (data.settings) localStorage.setItem('tradingSettings', data.settings);
        if (data.notifications) localStorage.setItem('notificationSettings', data.notifications);
        if (data.trades) localStorage.setItem('trades', data.trades);
        if (data.watchlist) localStorage.setItem('watchlist', data.watchlist);
        if (data.alerts) localStorage.setItem('alerts', data.alerts);

        toast({
          title: "Data Imported",
          description: "Your trading data has been restored. Please refresh the page.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid backup file or corrupted data.",
          variant: "destructive"
        });
      } finally {
        setImportLoading(false);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All local data has been removed. Please refresh the page.",
        variant: "destructive"
      });
    }
  };

  const resetApplication = () => {
    if (confirm('Are you sure you want to reset the application? This will clear all settings and data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your trading experience</p>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="trading" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-6">
          <ThemeSettings />
        </TabsContent>

        {/* Trading Settings */}
        <TabsContent value="trading" className="mt-6">
          <TradingSettings />
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Security & Privacy</h3>
                <p className="text-sm text-muted-foreground">Protect your trading data and privacy</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold">Data Storage</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your trading data is stored locally in your browser. No sensitive information is transmitted to external servers without your explicit consent.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Local Storage Usage:</span>
                    <Badge variant="secondary">~2.4 MB</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Session Storage:</span>
                    <Badge variant="secondary">~180 KB</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-3">Privacy Settings</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Analytics data is anonymized and aggregated</p>
                  <p>• No personal trading strategies are shared</p>
                  <p>• All API keys are encrypted and stored locally</p>
                  <p>• No third-party tracking without consent</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="mt-6">
          <div className="space-y-6">
            {/* Backup & Restore */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Database className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Backup & Restore</h3>
                  <p className="text-sm text-muted-foreground">Manage your trading data and settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download all your trades, settings, and configuration as a JSON file.
                  </p>
                  <Button 
                    onClick={exportData}
                    disabled={exportLoading}
                    className="w-full gap-2"
                  >
                    {exportLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {exportLoading ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restore your data from a previously exported backup file.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={importData}
                    disabled={importLoading}
                    className="w-full gap-2"
                  >
                    {importLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {importLoading ? 'Importing...' : 'Import Data'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="glass-card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Irreversible actions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-red-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-500">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Remove all locally stored data including trades, settings, and preferences.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={clearAllData}
                    className="w-full gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Data
                  </Button>
                </div>

                <div className="p-4 border border-red-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-500">Reset Application</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Reset the entire application to its default state.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={resetApplication}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset App
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="mt-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <User className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Account Information</h3>
                <p className="text-sm text-muted-foreground">Manage your account preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Trading Experience</label>
                    <p className="text-lg font-semibold">Intermediate Trader</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Markets</label>
                    <div className="flex gap-2 mt-2">
                      <Badge>Crypto</Badge>
                      <Badge>Forex</Badge>
                      <Badge>Stocks</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                    <p className="text-lg font-semibold">December 2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Trades</label>
                    <p className="text-lg font-semibold">247 trades</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="font-semibold mb-4">Application Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">Version</label>
                    <p className="font-mono">v2.1.0</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Last Updated</label>
                    <p className="font-mono">Dec 10, 2024</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Build</label>
                    <p className="font-mono">#1247</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}