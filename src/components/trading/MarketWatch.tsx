import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search, Plus, Minus, Eye, Star } from "lucide-react";

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  isWatched: boolean;
}

interface MarketWatchProps {
  onSymbolSelect?: (symbol: string) => void;
  selectedSymbol?: string;
}

export function MarketWatch({ onSymbolSelect, selectedSymbol }: MarketWatchProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock market data - replace with real API
  const mockMarketData: WatchlistItem[] = [
    { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", price: 43250.50, change: 1250.30, changePercent: 2.98, volume: 125000000, high24h: 44500, low24h: 41800, isWatched: true },
    { symbol: "BINANCE:ETHUSDT", name: "Ethereum", price: 2650.80, change: -45.20, changePercent: -1.68, volume: 85000000, high24h: 2720, low24h: 2580, isWatched: true },
    { symbol: "BINANCE:SOLUSDT", name: "Solana", price: 98.45, change: 12.30, changePercent: 14.28, volume: 45000000, high24h: 105, low24h: 85, isWatched: true },
    { symbol: "BINANCE:ADAUSDT", name: "Cardano", price: 0.485, change: 0.025, changePercent: 5.43, volume: 32000000, high24h: 0.52, low24h: 0.44, isWatched: false },
    { symbol: "BINANCE:DOGEUSDT", name: "Dogecoin", price: 0.0845, change: -0.0012, changePercent: -1.40, volume: 28000000, high24h: 0.088, low24h: 0.081, isWatched: false },
    { symbol: "NASDAQ:AAPL", name: "Apple Inc", price: 185.20, change: 2.50, changePercent: 1.37, volume: 65000000, high24h: 187.5, low24h: 182.1, isWatched: true },
    { symbol: "NASDAQ:TSLA", name: "Tesla Inc", price: 248.80, change: -5.30, changePercent: -2.09, volume: 95000000, high24h: 258.2, low24h: 245.5, isWatched: false },
    { symbol: "NASDAQ:MSFT", name: "Microsoft", price: 378.50, change: 4.20, changePercent: 1.12, volume: 42000000, high24h: 382.1, low24h: 372.8, isWatched: true },
    { symbol: "FOREX:EURUSD", name: "EUR/USD", price: 1.0845, change: 0.0025, changePercent: 0.23, volume: 0, high24h: 1.088, low24h: 1.081, isWatched: true },
    { symbol: "FOREX:GBPUSD", name: "GBP/USD", price: 1.2650, change: -0.0035, changePercent: -0.28, volume: 0, high24h: 1.270, low24h: 1.261, isWatched: false }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setWatchlist(mockMarketData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredWatchlist = watchlist.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWatch = (symbol: string) => {
    setWatchlist(prev => prev.map(item =>
      item.symbol === symbol ? { ...item, isWatched: !item.isWatched } : item
    ));
  };

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(3);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVolume = (volume: number) => {
    if (volume === 0) return "N/A";
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Market Watch
        </h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          filteredWatchlist.map((item) => (
            <div
              key={item.symbol}
              className={`p-3 border border-border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                selectedSymbol === item.symbol ? 'bg-primary/10 border-primary' : ''
              }`}
              onClick={() => onSymbolSelect?.(item.symbol)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatch(item.symbol);
                    }}
                    className="p-1 h-auto"
                  >
                    {item.isWatched ? (
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                    ) : (
                      <Star className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.symbol.split(':')[1]}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-mono font-semibold">${formatPrice(item.price)}</p>
                  <div className="flex items-center gap-1">
                    {item.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-profit" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-loss" />
                    )}
                    <span className={`text-xs font-mono ${item.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Vol: {formatVolume(item.volume)}</span>
                <span>H: ${formatPrice(item.high24h)}</span>
                <span>L: ${formatPrice(item.low24h)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}