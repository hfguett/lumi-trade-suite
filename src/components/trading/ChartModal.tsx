import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Download, Eye, EyeOff, Calendar, TrendingUp, TrendingDown, BarChart3, Calculator } from "lucide-react";
import { TradeEntry, ChartTimeframe, ChartInterval, CandleData } from "@/types/trading";
import { format } from "date-fns";
import { TradingChart } from "./TradingChart";
import { TradingViewChart } from "./TradingViewChart";
import { QuickTradeActions } from "./QuickTradeActions";
import { useState, useMemo } from "react";

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeEntry | null;
}

const TIMEFRAMES: ChartTimeframe[] = [
  { label: "1D", value: "1D", minutes: 1440 },
  { label: "3D", value: "3D", minutes: 4320 },
  { label: "1W", value: "1W", minutes: 10080 },
  { label: "2W", value: "2W", minutes: 20160 },
  { label: "1M", value: "1M", minutes: 43200 },
];

const INTERVALS: ChartInterval[] = [
  { label: "1m", value: "1m", seconds: 60 },
  { label: "5m", value: "5m", seconds: 300 },
  { label: "15m", value: "15m", seconds: 900 },
  { label: "1h", value: "1h", seconds: 3600 },
  { label: "4h", value: "4h", seconds: 14400 },
  { label: "1D", value: "1D", seconds: 86400 },
];

// Mock function to generate realistic candle data
const generateCandleData = (trade: TradeEntry, timeframe: string, interval: string): CandleData[] => {
  const candles: CandleData[] = [];
  const timeframeMinutes = TIMEFRAMES.find(tf => tf.value === timeframe)?.minutes || 1440;
  const intervalSeconds = INTERVALS.find(iv => iv.value === interval)?.seconds || 3600;
  
  const totalCandles = Math.min(200, (timeframeMinutes * 60) / intervalSeconds);
  const startTime = new Date(trade.entryTime.getTime() - (timeframeMinutes * 60 * 1000 / 2));
  
  let currentPrice = trade.entryPrice * (0.95 + Math.random() * 0.1); // Start near entry price
  
  for (let i = 0; i < totalCandles; i++) {
    const time = new Date(startTime.getTime() + (i * intervalSeconds * 1000));
    
    // Create realistic price movement
    const volatility = 0.02;
    const trend = Math.sin(i / 20) * 0.001;
    const randomChange = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const change = (trend + randomChange) * open;
    const close = open + change;
    
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    candles.push({
      time: time.getTime(),
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000 + 100000,
    });
    
    currentPrice = close;
  }
  
  return candles;
};

export function ChartModal({ isOpen, onClose, trade }: ChartModalProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<ChartTimeframe>(TIMEFRAMES[2]);
  const [selectedInterval, setSelectedInterval] = useState<ChartInterval>(INTERVALS[3]);
  const [showVolume, setShowVolume] = useState(true);

  const candleData = useMemo(() => {
    if (!trade) return [];
    return generateCandleData(trade, selectedTimeframe.value, selectedInterval.value);
  }, [trade, selectedTimeframe, selectedInterval]);

  if (!trade) return null;

  const convertToTradingViewSymbol = (symbol: string) => {
    const cleanSymbol = symbol.replace('/', '').toUpperCase();
    if (cleanSymbol.includes('USDT')) {
      return `BINANCE:${cleanSymbol}`;
    }
    return `BINANCE:${cleanSymbol}USDT`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] glass-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-bold">
                {trade?.symbol} Chart Analysis
              </DialogTitle>
              <Badge 
                variant={trade?.direction === "LONG" ? "default" : "secondary"}
                className="text-sm"
              >
                {trade?.direction}
              </Badge>
              <Badge 
                variant={trade?.status === "open" ? "outline" : "secondary"}
                className="text-sm"
              >
                {trade?.status.toUpperCase()}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Chart Section */}
          <div className="flex-1 flex flex-col">
            <Tabs defaultValue="tradingview" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="tradingview" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  TradingView
                </TabsTrigger>
                <TabsTrigger value="basic" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Basic Chart
                </TabsTrigger>
                <TabsTrigger value="tools" className="gap-2">
                  <Calculator className="w-4 h-4" />
                  Quick Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tradingview" className="flex-1">
                <TradingViewChart
                  symbol={convertToTradingViewSymbol(trade?.symbol || '')}
                  trades={trade ? [trade] : []}
                  height={500}
                  showControls={true}
                />
              </TabsContent>

              <TabsContent value="basic" className="flex-1 flex flex-col">
                {/* Chart Controls */}
                <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Timeframe:</label>
                      <Select value={selectedTimeframe.value} onValueChange={(value) => {
                        const timeframe = TIMEFRAMES.find(t => t.value === value);
                        if (timeframe) setSelectedTimeframe(timeframe);
                      }}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEFRAMES.map(tf => (
                            <SelectItem key={tf.value} value={tf.value}>
                              {tf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Interval:</label>
                      <Select value={selectedInterval.value} onValueChange={(value) => {
                        const interval = INTERVALS.find(i => i.value === value);
                        if (interval) setSelectedInterval(interval);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INTERVALS.map(interval => (
                            <SelectItem key={interval.value} value={interval.value}>
                              {interval.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVolume(!showVolume)}
                      className="gap-2"
                    >
                      {showVolume ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      Volume
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Chart */}
                <div className="flex-1 bg-muted/20 rounded-lg">
                  <TradingChart
                    candleData={candleData}
                    trade={trade!}
                    showVolume={showVolume}
                  />
                </div>
              </TabsContent>

              <TabsContent value="tools" className="flex-1">
                <QuickTradeActions 
                  currentSymbol={convertToTradingViewSymbol(trade?.symbol || '')}
                  currentPrice={trade?.entryPrice || 0}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Trade Details Panel */}
          <div className="w-80 space-y-4 overflow-y-auto">
            {/* Trade Summary */}
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-3">Trade Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Symbol</span>
                  <span className="font-mono">{trade.symbol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Direction</span>
                  <Badge variant={trade.direction === "LONG" ? "default" : "secondary"}>
                    {trade.direction}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={trade.status === "closed" ? "default" : "outline"}>
                    {trade.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total PnL</span>
                  <span className={`font-mono font-bold ${trade.totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {trade.totalPnL >= 0 ? '+' : ''}${trade.totalPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Entry Details */}
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Entry
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-mono">${trade.entryPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="text-sm">{format(trade.entryTime, "MMM dd HH:mm")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="font-mono">{trade.quantity}</span>
                </div>
              </div>
            </Card>

            {/* Stop Loss */}
            {trade.stopPrice && (
              <Card className="glass-card p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-loss" />
                  Stop Loss
                </h3>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-mono">${trade.stopPrice.toLocaleString()}</span>
                </div>
              </Card>
            )}

            {/* Exits */}
            {trade.exits.length > 0 && (
              <Card className="glass-card p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  {trade.totalPnL >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-profit" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-loss" />
                  )}
                  Exits ({trade.exits.length})
                </h3>
                <div className="space-y-3">
                  {trade.exits.map((exit, index) => (
                    <div key={exit.id}>
                      {index > 0 && <div className="border-t border-border my-2" />}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="font-mono">${exit.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Quantity</span>
                          <span className="font-mono">{exit.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Time</span>
                          <span className="text-sm">{format(exit.time, "MMM dd HH:mm")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">PnL</span>
                          <span className={`font-mono font-bold ${exit.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                            {exit.pnl >= 0 ? '+' : ''}${exit.pnl.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Notes & Tags */}
            {(trade.notes || trade.tags.length > 0) && (
              <Card className="glass-card p-4">
                <h3 className="font-semibold mb-3">Notes & Tags</h3>
                {trade.notes && (
                  <p className="text-sm text-muted-foreground mb-3">{trade.notes}</p>
                )}
                {trade.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {trade.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}