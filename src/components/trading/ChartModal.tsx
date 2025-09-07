import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, Target, StopCircle, Download, BarChart3, Volume2 } from "lucide-react";
import { TradeEntry, CandleData, ChartTimeframe, ChartInterval } from "@/types/trading";
import { TradingChart } from "./TradingChart";
import { format } from "date-fns";

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
  const [timeframe, setTimeframe] = useState("1W");
  const [interval, setInterval] = useState("1h");
  const [showVolume, setShowVolume] = useState(true);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (trade && isOpen) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const data = generateCandleData(trade, timeframe, interval);
        setCandleData(data);
        setIsLoading(false);
      }, 500);
    }
  }, [trade, timeframe, interval, isOpen]);

  if (!trade) return null;

  const exportChart = () => {
    // Mock export functionality
    console.log("Exporting chart for trade:", trade.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {trade.symbol} - Trade Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[80vh]">
          {/* Chart Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Chart Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Timeframe:</label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-20">
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
                  <Select value={interval} onValueChange={setInterval}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVALS.map(iv => (
                        <SelectItem key={iv.value} value={iv.value}>
                          {iv.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVolume(!showVolume)}
                  className="gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Volume
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={exportChart} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>

            {/* Chart */}
            <Card className="p-4 h-full min-h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <TradingChart 
                  candleData={candleData}
                  trade={trade}
                  showVolume={showVolume}
                />
              )}
            </Card>
          </div>

          {/* Trade Details Panel */}
          <div className="space-y-4 overflow-y-auto">
            {/* Trade Summary */}
            <Card className="p-4">
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
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
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
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <StopCircle className="w-4 h-4 text-red-500" />
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
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  {trade.totalPnL >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  Exits ({trade.exits.length})
                </h3>
                <div className="space-y-3">
                  {trade.exits.map((exit, index) => (
                    <div key={exit.id}>
                      {index > 0 && <Separator className="my-2" />}
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
              <Card className="p-4">
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