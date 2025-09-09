import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Percent, DollarSign, Target, TrendingUp, AlertTriangle, Clock, Zap } from "lucide-react";

export function TradingTools() {
  // Position Size Calculator
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('2');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  // R:R Calculator  
  const [rrEntry, setRrEntry] = useState('');
  const [rrStop, setRrStop] = useState('');
  const [rrTarget, setRrTarget] = useState('');

  // Fibonacci Calculator
  const [fibHigh, setFibHigh] = useState('');
  const [fibLow, setFibLow] = useState('');

  // Breakeven Calculator
  const [beEntry, setBeEntry] = useState('');
  const [beQuantity, setBeQuantity] = useState('');
  const [beLoss, setBeLoss] = useState('');

  const calculatePositionSize = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopPrice);

    if (!account || !risk || !entry || !stop) return { size: 0, riskAmount: 0 };

    const riskAmount = (account * risk) / 100;
    const riskPerShare = Math.abs(entry - stop);
    const positionSize = riskAmount / riskPerShare;

    return { size: positionSize, riskAmount };
  };

  const calculateRR = () => {
    const entry = parseFloat(rrEntry);
    const stop = parseFloat(rrStop);
    const target = parseFloat(rrTarget);

    if (!entry || !stop || !target) return { ratio: 0, risk: 0, reward: 0 };

    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const ratio = reward / risk;

    return { ratio, risk, reward };
  };

  const calculateFibLevels = () => {
    const high = parseFloat(fibHigh);
    const low = parseFloat(fibLow);

    if (!high || !low) return [];

    const diff = high - low;
    const levels = [
      { level: '0%', price: high, name: 'High' },
      { level: '23.6%', price: high - (diff * 0.236), name: 'Fib 23.6%' },
      { level: '38.2%', price: high - (diff * 0.382), name: 'Fib 38.2%' },
      { level: '50%', price: high - (diff * 0.5), name: 'Fib 50%' },
      { level: '61.8%', price: high - (diff * 0.618), name: 'Fib 61.8%' },
      { level: '78.6%', price: high - (diff * 0.786), name: 'Fib 78.6%' },
      { level: '100%', price: low, name: 'Low' }
    ];

    return levels;
  };

  const calculateBreakeven = () => {
    const entry = parseFloat(beEntry);
    const quantity = parseFloat(beQuantity);
    const loss = parseFloat(beLoss);

    if (!entry || !quantity || !loss) return { price: 0, targetQuantity: 0 };

    const lossPerShare = Math.abs(loss) / quantity;
    const breakevenPrice = entry + lossPerShare;
    const targetQuantity = Math.abs(loss) / lossPerShare;

    return { price: breakevenPrice, targetQuantity };
  };

  const { size, riskAmount } = calculatePositionSize();
  const { ratio, risk, reward } = calculateRR();
  const fibLevels = calculateFibLevels();
  const { price: bePrice, targetQuantity } = calculateBreakeven();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Trading Tools</h2>
          <p className="text-sm text-muted-foreground">Essential calculators for trading</p>
        </div>
      </div>

      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="position" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Position
          </TabsTrigger>
          <TabsTrigger value="rr" className="gap-2">
            <Target className="w-4 h-4" />
            Risk/Reward
          </TabsTrigger>
          <TabsTrigger value="fib" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Fibonacci
          </TabsTrigger>
          <TabsTrigger value="breakeven" className="gap-2">
            <Zap className="w-4 h-4" />
            Breakeven
          </TabsTrigger>
        </TabsList>

        {/* Position Size Calculator */}
        <TabsContent value="position">
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Position Size Calculator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="account">Account Size ($)</Label>
                  <Input
                    id="account"
                    type="number"
                    value={accountSize}
                    onChange={(e) => setAccountSize(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="riskPercent">Risk Percentage (%)</Label>
                  <Input
                    id="riskPercent"
                    type="number"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(e.target.value)}
                    placeholder="2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="stopPrice">Stop Loss Price</Label>
                  <Input
                    id="stopPrice"
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Results</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Amount:</span>
                      <span className="font-mono font-bold text-loss">
                        ${riskAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Position Size:</span>
                      <span className="font-mono font-bold">
                        {size.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk per Unit:</span>
                      <span className="font-mono font-bold">
                        ${Math.abs(parseFloat(entryPrice || '0') - parseFloat(stopPrice || '0')).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {riskAmount > parseFloat(accountSize) * 0.05 && (
                  <div className="p-3 bg-loss/10 border border-loss/20 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-loss" />
                    <div>
                      <p className="text-sm font-medium text-loss">High Risk Warning</p>
                      <p className="text-xs text-loss/80">Consider reducing position size or risk percentage</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Risk/Reward Calculator */}
        <TabsContent value="rr">
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Risk/Reward Calculator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rrEntry">Entry Price</Label>
                  <Input
                    id="rrEntry"
                    type="number"
                    value={rrEntry}
                    onChange={(e) => setRrEntry(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rrStop">Stop Loss</Label>
                  <Input
                    id="rrStop"
                    type="number"
                    value={rrStop}
                    onChange={(e) => setRrStop(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rrTarget">Take Profit</Label>
                  <Input
                    id="rrTarget"
                    type="number"
                    value={rrTarget}
                    onChange={(e) => setRrTarget(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Analysis</h4>
                  <div className="space-y-3">
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Risk/Reward Ratio</p>
                      <p className={`text-2xl font-bold ${ratio >= 2 ? 'text-profit' : ratio >= 1 ? 'text-neutral' : 'text-loss'}`}>
                        1:{ratio > 0 ? ratio.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk:</span>
                      <span className="font-mono text-loss">${risk.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-mono text-profit">${reward.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {ratio >= 3 && (
                    <Badge className="w-full justify-center bg-profit/20 text-profit hover:bg-profit/30">
                      Excellent R:R Ratio
                    </Badge>
                  )}
                  {ratio >= 2 && ratio < 3 && (
                    <Badge className="w-full justify-center bg-primary/20 text-primary hover:bg-primary/30">
                      Good R:R Ratio
                    </Badge>
                  )}
                  {ratio >= 1 && ratio < 2 && (
                    <Badge className="w-full justify-center bg-neutral/20 text-foreground hover:bg-neutral/30">
                      Acceptable R:R Ratio
                    </Badge>
                  )}
                  {ratio > 0 && ratio < 1 && (
                    <Badge className="w-full justify-center bg-loss/20 text-loss hover:bg-loss/30">
                      Poor R:R Ratio
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Fibonacci Calculator */}
        <TabsContent value="fib">
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Fibonacci Retracement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fibHigh">Swing High</Label>
                  <Input
                    id="fibHigh"
                    type="number"
                    value={fibHigh}
                    onChange={(e) => setFibHigh(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fibLow">Swing Low</Label>  
                  <Input
                    id="fibLow"
                    type="number"
                    value={fibLow}
                    onChange={(e) => setFibLow(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Fibonacci Levels</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {fibLevels.map((level, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {level.level}
                          </Badge>
                          <span className="text-sm">{level.name}</span>
                        </div>
                        <span className="font-mono text-sm">
                          ${level.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Breakeven Calculator */}
        <TabsContent value="breakeven">
          <Card className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Breakeven Calculator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="beEntry">Original Entry Price</Label>
                  <Input
                    id="beEntry"
                    type="number"
                    value={beEntry}
                    onChange={(e) => setBeEntry(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="beQuantity">Original Quantity</Label>
                  <Input
                    id="beQuantity"
                    type="number"
                    value={beQuantity}
                    onChange={(e) => setBeQuantity(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="beLoss">Current Loss ($)</Label>
                  <Input
                    id="beLoss"
                    type="number"
                    value={beLoss}
                    onChange={(e) => setBeLoss(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Breakeven Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Breakeven Price:</span>
                      <span className="font-mono font-bold">
                        ${bePrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional Quantity:</span>
                      <span className="font-mono font-bold">
                        {targetQuantity.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Investment:</span>
                      <span className="font-mono font-bold">
                        ${((parseFloat(beEntry || '0') * parseFloat(beQuantity || '0')) + parseFloat(beLoss || '0')).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {bePrice > 0 && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium">Breakeven Strategy</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Buy {targetQuantity.toFixed(4)} more units to break even when price reaches ${bePrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}