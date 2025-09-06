import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { ExchangeManager, type Exchange } from "./ExchangeManager";

interface PnLResult {
  pnl: number;
  pnlPercentage: number;
  fees: number;
  netPnL: number;
  riskReward: number;
}

const defaultExchanges: Exchange[] = [
  { id: "binance", name: "Binance", makerFee: 0.1, takerFee: 0.1 },
  { id: "coinbase", name: "Coinbase Pro", makerFee: 0.5, takerFee: 0.5 },
  { id: "kraken", name: "Kraken", makerFee: 0.16, takerFee: 0.26 },
  { id: "bybit", name: "Bybit", makerFee: 0.1, takerFee: 0.1 },
  { id: "okx", name: "OKX", makerFee: 0.08, takerFee: 0.1 },
  { id: "kucoin", name: "KuCoin", makerFee: 0.1, takerFee: 0.1 },
  { id: "mexc", name: "MEXC", makerFee: 0.2, takerFee: 0.2 },
  { id: "gate", name: "Gate.io", makerFee: 0.2, takerFee: 0.2 },
  { id: "huobi", name: "HTX (Huobi)", makerFee: 0.2, takerFee: 0.2 },
  { id: "bitget", name: "Bitget", makerFee: 0.1, takerFee: 0.1 },
  { id: "bitfinex", name: "Bitfinex", makerFee: 0.1, takerFee: 0.2 },
  { id: "gemini", name: "Gemini", makerFee: 0.25, takerFee: 0.35 },
  { id: "bitstamp", name: "Bitstamp", makerFee: 0.5, takerFee: 0.5 },
  { id: "ftx", name: "FTX", makerFee: 0.02, takerFee: 0.07 },
  { id: "bitmex", name: "BitMEX", makerFee: -0.025, takerFee: 0.075 },
  { id: "dydx", name: "dYdX", makerFee: 0.05, takerFee: 0.1 },
  { id: "crypto.com", name: "Crypto.com", makerFee: 0.4, takerFee: 0.4 },
  { id: "upbit", name: "Upbit", makerFee: 0.25, takerFee: 0.25 },
  { id: "bithumb", name: "Bithumb", makerFee: 0.25, takerFee: 0.25 },
  { id: "phemex", name: "Phemex", makerFee: -0.025, takerFee: 0.075 },
];

export function PnLCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leverage, setLeverage] = useState("1");
  const [selectedExchange, setSelectedExchange] = useState("binance");
  const [result, setResult] = useState<PnLResult | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>(defaultExchanges);

  const calculatePnL = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const qty = parseFloat(quantity);
    const lev = parseFloat(leverage);
    
    if (!entry || !exit || !qty) return;

    const exchange = exchanges.find(e => e.id === selectedExchange)!;
    const positionSize = qty * lev;
    
    // Calculate raw PnL
    const priceDiff = exit - entry;
    const rawPnL = (priceDiff / entry) * positionSize;
    
    // Calculate fees (entry + exit)
    const entryFee = (positionSize * exchange.takerFee) / 100;
    const exitFee = (positionSize * exchange.takerFee) / 100;
    const totalFees = entryFee + exitFee;
    
    // Net PnL after fees
    const netPnL = rawPnL - totalFees;
    const pnlPercentage = (netPnL / qty) * 100;
    
    // Risk/Reward calculation (assuming stop loss at 2% below entry for long)
    const stopLoss = entry * 0.98;
    const maxLoss = Math.abs((stopLoss - entry) / entry) * positionSize;
    const riskReward = rawPnL > 0 ? Math.abs(rawPnL / maxLoss) : 0;

    setResult({
      pnl: rawPnL,
      pnlPercentage,
      fees: totalFees,
      netPnL,
      riskReward
    });
  };

  useEffect(() => {
    if (entryPrice && exitPrice && quantity) {
      calculatePnL();
    }
  }, [entryPrice, exitPrice, quantity, leverage, selectedExchange, exchanges]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">PnL Calculator</h2>
          <p className="text-sm text-muted-foreground">Calculate profit/loss with leverage and fees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="exitPrice">Exit Price ($)</Label>
                <Input
                  id="exitPrice"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="52,000"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Position Size ($)</Label>
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1,000"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leverage">Leverage</Label>
                <Select value={leverage} onValueChange={setLeverage}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10, 20, 50, 100].map(lev => (
                      <SelectItem key={lev} value={lev.toString()}>
                        {lev}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select value={selectedExchange} onValueChange={setSelectedExchange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exchanges.map(exchange => (
                    <SelectItem key={exchange.id} value={exchange.id}>
                      {exchange.name} ({exchange.takerFee}% fee)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ExchangeManager
              exchanges={exchanges}
              onExchangesChange={setExchanges}
              selectedExchange={selectedExchange}
              onExchangeSelect={setSelectedExchange}
            />

            <Button
              onClick={calculatePnL} 
              variant="hero"
              className="w-full border border-primary/30 hover:border-primary/60"
            >
              Calculate PnL
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <MetricCard
                title="Gross PnL"
                value={`$${result.pnl.toFixed(2)}`}
                change={`${result.pnlPercentage.toFixed(2)}%`}
                changeType={result.pnl >= 0 ? "profit" : "loss"}
                icon={result.pnl >= 0 ? 
                  <TrendingUp className="w-5 h-5 text-profit" /> : 
                  <TrendingDown className="w-5 h-5 text-loss" />
                }
                glowEffect={Math.abs(result.pnl) > 100}
              />
              
              <MetricCard
                title="Trading Fees"
                value={`$${result.fees.toFixed(2)}`}
                description="Entry + Exit fees"
                icon={<Calculator className="w-5 h-5 text-muted-foreground" />}
              />
              
              <MetricCard
                title="Net PnL"
                value={`$${result.netPnL.toFixed(2)}`}
                change={`After fees`}
                changeType={result.netPnL >= 0 ? "profit" : "loss"}
                glowEffect={true}
              />
              
              <MetricCard
                title="Risk/Reward Ratio"
                value={result.riskReward.toFixed(2)}
                description="Based on 2% stop loss"
                changeType={result.riskReward >= 2 ? "profit" : result.riskReward >= 1 ? "neutral" : "loss"}
              />
            </>
          ) : (
            <Card className="glass-card p-8 text-center">
              <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Enter trade details to calculate PnL</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}