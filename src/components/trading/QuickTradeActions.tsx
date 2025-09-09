import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, TrendingDown, Target, AlertTriangle, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickTradeActionsProps {
  currentSymbol: string;
  currentPrice?: number;
}

export function QuickTradeActions({ currentSymbol, currentPrice = 0 }: QuickTradeActionsProps) {
  const [position, setPosition] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState(currentPrice.toString());
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [riskAmount, setRiskAmount] = useState('100');

  // Risk calculator
  const calculatePositionSize = () => {
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const risk = parseFloat(riskAmount);
    
    if (!entry || !stop || !risk) return 0;
    
    const riskPerUnit = Math.abs(entry - stop);
    return risk / riskPerUnit;
  };

  const calculateRR = () => {
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    
    if (!entry || !stop || !tp) return 0;
    
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(tp - entry);
    return reward / risk;
  };

  const handleQuickSetup = (type: 'scalp' | 'swing' | 'dca') => {
    const entry = parseFloat(entryPrice);
    if (!entry) return;

    switch (type) {
      case 'scalp':
        setStopLoss((entry * 0.995).toFixed(2)); // 0.5% stop
        setTakeProfit((entry * 1.01).toFixed(2)); // 1% target
        break;
      case 'swing':
        setStopLoss((entry * 0.97).toFixed(2)); // 3% stop
        setTakeProfit((entry * 1.09).toFixed(2)); // 9% target
        break;
      case 'dca':
        setStopLoss((entry * 0.85).toFixed(2)); // 15% stop
        setTakeProfit((entry * 1.5).toFixed(2)); // 50% target
        break;
    }
    
    toast({
      title: `${type.toUpperCase()} Setup Applied`,
      description: `Stop loss and take profit levels set for ${type} trading.`
    });
  };

  const positionSize = calculatePositionSize();
  const riskReward = calculateRR();

  return (
    <div className="space-y-4">
      {/* Quick Position Setup */}
      <Card className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Quick Trade Setup</h3>
          <Badge variant="outline">{currentSymbol.split(':')[1] || currentSymbol}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Direction */}
            <div className="flex gap-2">
              <Button
                variant={position === 'LONG' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPosition('LONG')}
                className="flex-1 gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                LONG
              </Button>
              <Button
                variant={position === 'SHORT' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setPosition('SHORT')}
                className="flex-1 gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                SHORT
              </Button>
            </div>

            {/* Entry Price */}
            <div>
              <Label htmlFor="entry">Entry Price</Label>
              <Input
                id="entry"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Risk Amount */}
            <div>
              <Label htmlFor="risk">Risk Amount ($)</Label>
              <Input
                id="risk"
                type="number"
                value={riskAmount}
                onChange={(e) => setRiskAmount(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Stop Loss */}
            <div>
              <Label htmlFor="stop">Stop Loss</Label>
              <Input
                id="stop"
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Take Profit */}
            <div>
              <Label htmlFor="tp">Take Profit</Label>
              <Input
                id="tp"
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Calculated Quantity */}
            <div>
              <Label>Calculated Size</Label>
              <div className="p-2 bg-muted rounded border text-sm font-mono">
                {positionSize > 0 ? positionSize.toFixed(4) : '0.0000'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Setup Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => handleQuickSetup('scalp')}
            className="flex-1"
          >
            Scalp Setup
          </Button>
          <Button
            variant="outline"
            size="sm" 
            onClick={() => handleQuickSetup('swing')}
            className="flex-1"
          >
            Swing Setup
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickSetup('dca')}
            className="flex-1"
          >
            DCA Setup
          </Button>
        </div>
      </Card>

      {/* Risk Metrics */}
      <Card className="glass-card p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Risk Metrics
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Risk/Reward</p>
            <p className={`text-lg font-bold ${riskReward >= 2 ? 'text-profit' : riskReward >= 1 ? 'text-neutral' : 'text-loss'}`}>
              1:{riskReward > 0 ? riskReward.toFixed(2) : '0.00'}
            </p>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Position Size</p>
            <p className="text-lg font-bold font-mono">
              {positionSize > 0 ? positionSize.toFixed(4) : '0.0000'}
            </p>
          </div>
        </div>

        {riskReward > 0 && riskReward < 1.5 && (
          <div className="mt-3 p-2 bg-loss/10 border border-loss/20 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-loss" />
            <p className="text-sm text-loss">Low risk/reward ratio. Consider adjusting levels.</p>
          </div>
        )}
      </Card>

      {/* Market Quick Stats */}
      <Card className="glass-card p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Market Info
        </h4>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Current Price:</span>
            <span className="text-sm font-mono">${currentPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">24h Change:</span>
            <span className="text-sm font-mono text-profit">+2.34%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Volume:</span>
            <span className="text-sm font-mono">1.2M</span>
          </div>
        </div>
      </Card>
    </div>
  );
}