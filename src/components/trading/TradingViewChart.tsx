import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Activity, Maximize2, RotateCcw } from "lucide-react";
import { TradeEntry } from "@/types/trading";

interface TradingViewChartProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
  trades?: TradeEntry[];
  height?: number;
  showControls?: boolean;
}

// Popular trading pairs for quick access
const POPULAR_SYMBOLS = [
  "BINANCE:BTCUSDT",
  "BINANCE:ETHUSDT", 
  "BINANCE:SOLUSDT",
  "BINANCE:ADAUSDT",
  "BINANCE:DOGEUSDT",
  "BINANCE:BNBUSDT",
  "NASDAQ:AAPL",
  "NASDAQ:TSLA",
  "NASDAQ:MSFT",
  "FOREX:EURUSD",
  "FOREX:GBPUSD",
  "FOREX:USDJPY"
];

const TIMEFRAMES = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" }
];

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewChart({ 
  symbol = "BINANCE:BTCUSDT", 
  onSymbolChange, 
  trades = [],
  height = 600,
  showControls = true 
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("60");
  const [isLoading, setIsLoading] = useState(true);

  // Filter relevant trades for current symbol
  const relevantTrades = trades.filter(trade => {
    const tradeSymbol = trade.symbol.replace('/', '').toUpperCase();
    const chartSymbol = currentSymbol.split(':')[1]?.replace('USDT', '') || currentSymbol;
    return tradeSymbol.includes(chartSymbol) || chartSymbol.includes(tradeSymbol);
  });

  const initializeChart = () => {
    if (!containerRef.current || !window.TradingView) return;

    // Clear previous widget
    if (widgetRef.current) {
      widgetRef.current.remove();
    }

    // Clear container
    containerRef.current.innerHTML = '';

    try {
      widgetRef.current = new window.TradingView.widget({
        width: "100%",
        height: height,
        symbol: currentSymbol,
        interval: timeframe,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "hsl(270, 25%, 8%)",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: true,
        container_id: containerRef.current.id,
        studies: [
          "Volume@tv-basicstudies",
          "RSI@tv-basicstudies"
        ],
        overrides: {
          "paneProperties.background": "hsl(270, 25%, 6%)",
          "paneProperties.backgroundType": "solid",
          "scalesProperties.textColor": "hsl(120, 5%, 90%)",
          "scalesProperties.lineColor": "hsl(270, 25%, 18%)",
          "mainSeriesProperties.candleStyle.upColor": "hsl(140, 85%, 55%)",
          "mainSeriesProperties.candleStyle.downColor": "hsl(0, 85%, 60%)",
          "mainSeriesProperties.candleStyle.borderUpColor": "hsl(140, 85%, 55%)",
          "mainSeriesProperties.candleStyle.borderDownColor": "hsl(0, 85%, 60%)",
          "mainSeriesProperties.candleStyle.wickUpColor": "hsl(140, 85%, 55%)",
          "mainSeriesProperties.candleStyle.wickDownColor": "hsl(0, 85%, 60%)",
        },
        loading_screen: {
          backgroundColor: "hsl(270, 25%, 6%)",
          foregroundColor: "hsl(158, 84%, 52%)"
        },
        onChartReady: () => {
          setIsLoading(false);
          plotTrades();
        }
      });
    } catch (error) {
      console.error("Error initializing TradingView widget:", error);
      setIsLoading(false);
    }
  };

  const plotTrades = () => {
    if (!widgetRef.current || relevantTrades.length === 0) return;

    try {
      const chart = widgetRef.current.chart();
      
      relevantTrades.forEach((trade, index) => {
        // Entry marker
        chart.createShape({
          time: trade.entryTime.getTime() / 1000,
          price: trade.entryPrice
        }, {
          shape: 'arrow_up',
          text: `Entry: $${trade.entryPrice}`,
          color: trade.direction === 'LONG' ? '#22c55e' : '#ef4444'
        });

        // Exit markers
        trade.exits.forEach((exit, exitIndex) => {
          chart.createShape({
            time: exit.time.getTime() / 1000,
            price: exit.price
          }, {
            shape: 'arrow_down',
            text: `Exit ${exitIndex + 1}: $${exit.price}`,
            color: exit.pnl > 0 ? '#22c55e' : '#ef4444'
          });
        });

        // Stop loss line
        if (trade.stopPrice) {
          chart.createShape({
            time: trade.entryTime.getTime() / 1000,
            price: trade.stopPrice
          }, {
            shape: 'horizontal_line',
            text: `Stop: $${trade.stopPrice}`,
            color: '#ef4444',
            style: 2 // dashed
          });
        }
      });
    } catch (error) {
      console.error("Error plotting trades:", error);
    }
  };

  useEffect(() => {
    const checkTradingView = () => {
      if (window.TradingView) {
        initializeChart();
      } else {
        // Keep checking until TradingView loads
        setTimeout(checkTradingView, 500);
      }
    };

    const timer = setTimeout(checkTradingView, 100);
    return () => clearTimeout(timer);
  }, [currentSymbol, timeframe, height]);

  useEffect(() => {
    plotTrades();
  }, [relevantTrades]);

  const handleSymbolChange = (newSymbol: string) => {
    setCurrentSymbol(newSymbol);
    onSymbolChange?.(newSymbol);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const formattedSymbol = searchQuery.toUpperCase().includes(':') 
        ? searchQuery.toUpperCase()
        : `BINANCE:${searchQuery.toUpperCase()}USDT`;
      handleSymbolChange(formattedSymbol);
      setSearchQuery("");
    }
  };

  const getSymbolInfo = () => {
    const parts = currentSymbol.split(':');
    const exchange = parts[0] || 'BINANCE';
    const pair = parts[1] || currentSymbol;
    return { exchange, pair };
  };

  const { exchange, pair } = getSymbolInfo();

  if (!window.TradingView) {
    return (
      <div className="flex items-center justify-center h-full glass-card rounded-lg">
        <div className="text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">TradingView is loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 glass-card rounded-lg">
          {/* Symbol Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search symbol (e.g., BTC, AAPL, EURUSD)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {/* Timeframe Selector */}
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

          {/* Reset button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSymbolChange("BINANCE:BTCUSDT")}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Current Symbol Info */}
      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-lg">{pair}</h3>
            <p className="text-sm text-muted-foreground">{exchange}</p>
          </div>
          {relevantTrades.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              {relevantTrades.length} trades
            </Badge>
          )}
        </div>

        {/* Quick Symbol Buttons */}
        <div className="hidden lg:flex gap-1">
          {POPULAR_SYMBOLS.slice(0, 6).map(sym => (
            <Button
              key={sym}
              variant={currentSymbol === sym ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSymbolChange(sym)}
              className="text-xs"
            >
              {sym.split(':')[1]?.replace('USDT', '') || sym}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative glass-card rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          id={`tradingview-chart-${Math.random().toString(36).substr(2, 9)}`}
          className="w-full"
          style={{ height: `${height}px` }}
        />
      </div>

      {/* Trade Summary for Current Symbol */}
      {relevantTrades.length > 0 && (
        <div className="p-4 glass-card rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Trades on {pair}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relevantTrades.slice(0, 6).map(trade => (
              <div key={trade.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={trade.direction === "LONG" ? "default" : "secondary"}>
                    {trade.direction}
                  </Badge>
                  <Badge variant={trade.status === "open" ? "outline" : "secondary"}>
                    {trade.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Entry: ${trade.entryPrice.toLocaleString()}
                </p>
                <p className={`text-sm font-mono font-bold ${trade.totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                  PnL: {trade.totalPnL >= 0 ? '+' : ''}${trade.totalPnL.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}