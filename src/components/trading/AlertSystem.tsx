import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceAlert {
  id: string;
  symbol: string;
  type: "above" | "below" | "cross";
  price: number;
  currentPrice: number;
  createdAt: Date;
  triggered: boolean;
  message?: string;
}

export function AlertSystem() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      symbol: "BINANCE:BTCUSDT",
      type: "above",
      price: 45000,
      currentPrice: 43250.50,
      createdAt: new Date(),
      triggered: false,
      message: "Bitcoin break above 45k resistance"
    },
    {
      id: "2",
      symbol: "BINANCE:ETHUSDT",
      type: "below",
      price: 2500,
      currentPrice: 2650.80,
      createdAt: new Date(),
      triggered: false,
      message: "Ethereum support test"
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    symbol: "",
    type: "above" as "above" | "below",
    price: "",
    message: ""
  });

  const popularSymbols = [
    "BINANCE:BTCUSDT",
    "BINANCE:ETHUSDT",
    "BINANCE:SOLUSDT",
    "BINANCE:ADAUSDT",
    "NASDAQ:AAPL",
    "NASDAQ:TSLA"
  ];

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.price) {
      toast({
        title: "Missing Information",
        description: "Please select a symbol and enter a price",
        variant: "destructive"
      });
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol,
      type: newAlert.type,
      price: parseFloat(newAlert.price),
      currentPrice: getCurrentPrice(newAlert.symbol),
      createdAt: new Date(),
      triggered: false,
      message: newAlert.message
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({ symbol: "", type: "above", price: "", message: "" });
    
    toast({
      title: "Alert Created",
      description: `Price alert set for ${alert.symbol.split(':')[1]} ${alert.type} $${alert.price}`,
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  const getCurrentPrice = (symbol: string) => {
    // Mock current prices - replace with real data
    const prices: { [key: string]: number } = {
      "BINANCE:BTCUSDT": 43250.50,
      "BINANCE:ETHUSDT": 2650.80,
      "BINANCE:SOLUSDT": 98.45,
      "BINANCE:ADAUSDT": 0.485,
      "NASDAQ:AAPL": 185.20,
      "NASDAQ:TSLA": 248.80
    };
    return prices[symbol] || 0;
  };

  const getAlertStatus = (alert: PriceAlert) => {
    const currentPrice = getCurrentPrice(alert.symbol);
    const triggered = alert.type === "above" 
      ? currentPrice >= alert.price 
      : currentPrice <= alert.price;

    return { triggered, currentPrice };
  };

  return (
    <div className="space-y-4">
      {/* Create New Alert */}
      <Card className="glass-card p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Create Price Alert
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              {popularSymbols.map(symbol => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol.split(':')[1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newAlert.type} onValueChange={(value) => setNewAlert(prev => ({ ...prev, type: value as "above" | "below" }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above</SelectItem>
              <SelectItem value="below">Below</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Target Price"
            type="number"
            value={newAlert.price}
            onChange={(e) => setNewAlert(prev => ({ ...prev, price: e.target.value }))}
          />

          <Button onClick={createAlert} className="gap-2">
            <Bell className="w-4 h-4" />
            Create Alert
          </Button>
        </div>

        <Input
          placeholder="Optional message (e.g., 'Break above resistance')"
          value={newAlert.message}
          onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
        />
      </Card>

      {/* Active Alerts */}
      <Card className="glass-card p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Active Alerts ({alerts.filter(a => !a.triggered).length})
        </h3>

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No price alerts set up yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => {
              const { triggered, currentPrice } = getAlertStatus(alert);
              
              return (
                <div key={alert.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${triggered ? 'bg-green-500/10' : 'bg-muted/50'}`}>
                        {alert.type === "above" ? (
                          <TrendingUp className={`w-4 h-4 ${triggered ? 'text-green-500' : 'text-muted-foreground'}`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 ${triggered ? 'text-red-500' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{alert.symbol.split(':')[1]}</span>
                          <Badge variant={triggered ? "default" : "secondary"}>
                            {triggered ? "TRIGGERED" : "ACTIVE"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Alert when price goes {alert.type} ${alert.price.toLocaleString()}
                        </p>
                        {alert.message && (
                          <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-mono font-semibold">${currentPrice.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-mono font-semibold">${alert.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Target</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}