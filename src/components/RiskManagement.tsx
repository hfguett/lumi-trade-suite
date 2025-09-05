import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, AlertTriangle, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";

interface PositionSizeResult {
  positionSize: number;
  shares: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
}

export function RiskManagement() {
  const [accountSize, setAccountSize] = useState("10000");
  const [riskPercentage, setRiskPercentage] = useState("2");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [result, setResult] = useState<PositionSizeResult | null>(null);

  const calculatePositionSize = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercentage);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const target = parseFloat(takeProfit);

    if (!account || !risk || !entry || !stop) return;

    const riskAmount = (account * risk) / 100;
    const stopDistance = Math.abs(entry - stop);
    const positionSize = riskAmount / stopDistance;
    const shares = positionSize / entry;
    
    const rewardAmount = target ? Math.abs(target - entry) * shares : 0;
    const riskRewardRatio = target ? rewardAmount / riskAmount : 0;

    setResult({
      positionSize,
      shares,
      riskAmount,
      rewardAmount,
      riskRewardRatio
    });
  };

  // Portfolio heat map data
  const positions = [
    { symbol: "BTC/USDT", size: 2500, risk: 2.5, pnl: 125.50 },
    { symbol: "ETH/USDT", size: 1800, risk: 1.8, pnl: -89.20 },
    { symbol: "SOL/USDT", size: 1200, risk: 1.2, pnl: 67.80 },
    { symbol: "ADA/USDT", size: 800, risk: 0.8, pnl: 34.10 },
  ];

  const totalRisk = positions.reduce((sum, pos) => sum + pos.risk, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Risk Management</h2>
          <p className="text-sm text-muted-foreground">Position sizing and portfolio risk analysis</p>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Portfolio Risk"
          value={`${totalRisk.toFixed(1)}%`}
          changeType={totalRisk <= 6 ? "profit" : totalRisk <= 10 ? "neutral" : "loss"}
          icon={<AlertTriangle className="w-5 h-5 text-primary" />}
          description="Current exposure"
          glowEffect={totalRisk > 10}
        />
        
        <MetricCard
          title="Available Risk"
          value={`${Math.max(0, 10 - totalRisk).toFixed(1)}%`}
          changeType="profit"
          icon={<Shield className="w-5 h-5 text-profit" />}
          description="Remaining capacity"
        />
        
        <MetricCard
          title="Risk/Reward Avg"
          value="1.85"
          changeType="profit"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          description="Average R:R ratio"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Size Calculator */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Position Size Calculator</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountSize">Account Size ($)</Label>
                <Input
                  id="accountSize"
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="riskPercentage">Risk per Trade (%)</Label>
                <Select value={riskPercentage} onValueChange={setRiskPercentage}>
                  <SelectTrigger className="font-mono bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="0.5">0.5%</SelectItem>
                    <SelectItem value="1">1%</SelectItem>
                    <SelectItem value="1.5">1.5%</SelectItem>
                    <SelectItem value="2">2%</SelectItem>
                    <SelectItem value="2.5">2.5%</SelectItem>
                    <SelectItem value="3">3%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price ($)</Label>
                <Input
                  id="entryPrice"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="50,000"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss ($)</Label>
                <Input
                  id="stopLoss"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="48,000"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit ($)</Label>
                <Input
                  id="takeProfit"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="54,000"
                  className="font-mono"
                />
              </div>
            </div>

            <Button 
              onClick={calculatePositionSize}
              variant="hero"
              className="w-full"
            >
              Calculate Position Size
            </Button>

            {result && (
              <div className="mt-6 space-y-3 p-4 bg-muted/20 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Position Size:</span>
                  <span className="font-mono font-semibold text-card-foreground">
                    ${result.positionSize.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Amount:</span>
                  <span className="font-mono font-semibold text-loss">
                    ${result.riskAmount.toFixed(2)}
                  </span>
                </div>
                {result.rewardAmount > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reward Amount:</span>
                      <span className="font-mono font-semibold text-profit">
                        ${result.rewardAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk/Reward:</span>
                      <span className={`font-mono font-semibold ${
                        result.riskRewardRatio >= 2 ? 'text-profit' : 
                        result.riskRewardRatio >= 1 ? 'text-neutral' : 'text-loss'
                      }`}>
                        1:{result.riskRewardRatio.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Portfolio Heat Map */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Portfolio Heat Map</h3>
          <div className="space-y-4">
            {positions.map((position, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-card-foreground">{position.symbol}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      position.risk <= 1.5 ? 'bg-profit' :
                      position.risk <= 2.5 ? 'bg-primary' : 'bg-loss'
                    }`} />
                  </div>
                  <span className={`font-mono text-sm ${
                    position.pnl >= 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Size: ${position.size.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">
                    Risk: {position.risk}%
                  </span>
                </div>
                
                <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      position.risk <= 1.5 ? 'bg-gradient-profit' :
                      position.risk <= 2.5 ? 'bg-gradient-primary' : 'bg-gradient-loss'
                    }`}
                    style={{ width: `${(position.risk / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">Total Portfolio Risk</span>
              <span className={`font-mono font-bold ${
                totalRisk <= 6 ? 'text-profit' : 
                totalRisk <= 10 ? 'text-primary' : 'text-loss'
              }`}>
                {totalRisk.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  totalRisk <= 6 ? 'bg-gradient-profit' : 
                  totalRisk <= 10 ? 'bg-gradient-primary' : 'bg-gradient-loss'
                }`}
                style={{ width: `${Math.min((totalRisk / 15) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Guidelines */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Risk Management Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-profit/10 rounded-lg border border-profit/20">
            <h4 className="font-semibold text-profit mb-2">Conservative (1-2%)</h4>
            <p className="text-sm text-muted-foreground">
              Recommended for beginners and steady growth. Lower volatility, consistent returns.
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Moderate (2-3%)</h4>
            <p className="text-sm text-muted-foreground">
              Balanced approach. Good for experienced traders with proven strategies.
            </p>
          </div>
          
          <div className="p-4 bg-loss/10 rounded-lg border border-loss/20">
            <h4 className="font-semibold text-loss mb-2">Aggressive (3%+)</h4>
            <p className="text-sm text-muted-foreground">
              High risk, high reward. Only for experienced traders with strong risk management.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}