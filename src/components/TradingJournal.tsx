import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Filter, Download, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { TradeEntry } from "@/types/trading";
import { TradeRegistrationForm } from "./trading/TradeRegistrationForm";
import { ChartModal } from "./trading/ChartModal";

const mockTrades: TradeEntry[] = [
  {
    id: "1",
    symbol: "BTC/USDT",
    direction: "LONG",
    entryPrice: 42000,
    entryTime: new Date(2024, 0, 15, 10, 30),
    stopPrice: 40000,
    exits: [
      {
        id: "exit1",
        price: 45000,
        quantity: 0.05,
        time: new Date(2024, 0, 16, 14, 20),
        pnl: 150
      },
      {
        id: "exit2", 
        price: 46500,
        quantity: 0.05,
        time: new Date(2024, 0, 17, 9, 15),
        pnl: 225
      }
    ],
    quantity: 0.1,
    totalPnL: 375,
    notes: "Strong bullish momentum after support hold at 41k. Perfect breakout setup with high volume confirmation.",
    tags: ["momentum", "support", "breakout"],
    category: "swing",
    status: "closed"
  },
  {
    id: "2",
    symbol: "ETH/USDT", 
    direction: "SHORT",
    entryPrice: 2600,
    entryTime: new Date(2024, 0, 14, 15, 45),
    stopPrice: 2720,
    exits: [
      {
        id: "exit3",
        price: 2450,
        quantity: 2,
        time: new Date(2024, 0, 14, 18, 30),
        pnl: 300
      }
    ],
    quantity: 2,
    totalPnL: 300,
    notes: "Failed to break resistance, clear rejection with strong selling pressure",
    tags: ["resistance", "rejection", "reversal"],
    category: "scalp",
    status: "closed"
  },
  {
    id: "3",
    symbol: "SOL/USDT",
    direction: "LONG", 
    entryPrice: 95,
    entryTime: new Date(2024, 0, 13, 11, 0),
    stopPrice: 88,
    exits: [
      {
        id: "exit4",
        price: 88,
        quantity: 10,
        time: new Date(2024, 0, 13, 16, 45),
        pnl: -70
      }
    ],
    quantity: 10,
    totalPnL: -70,
    notes: "Stop loss hit, market turned bearish on macro news. Risk management worked as planned.",
    tags: ["stop-loss", "bearish", "macro"],
    category: "swing",
    status: "closed"
  },
  {
    id: "4",
    symbol: "AVAX/USDT",
    direction: "LONG",
    entryPrice: 35.50,
    entryTime: new Date(2024, 0, 20, 13, 15),
    stopPrice: 32.00,
    exits: [],
    quantity: 50,
    totalPnL: 0,
    notes: "Waiting for breakout above resistance. Good accumulation zone identified.",
    tags: ["accumulation", "resistance", "pending"],
    category: "position",
    status: "open"
  }
];

export function TradingJournal() {
  const [trades, setTrades] = useState<TradeEntry[]>(mockTrades);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeEntry | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredTrades = trades.filter(trade => {
    if (filter === "all") return true;
    if (filter === "profits") return trade.totalPnL > 0;
    if (filter === "losses") return trade.totalPnL < 0;
    if (filter === "open") return trade.status === "open";
    return trade.category === filter;
  });

  const totalPnL = trades.reduce((sum, trade) => sum + trade.totalPnL, 0);
  const winRate = trades.length > 0 ? (trades.filter(t => t.totalPnL > 0).length / trades.length) * 100 : 0;

  const addTrade = (newTrade: Omit<TradeEntry, 'id'>) => {
    const trade: TradeEntry = {
      ...newTrade,
      id: Date.now().toString(),
    };
    setTrades([trade, ...trades]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Trading Journal</h2>
            <p className="text-sm text-muted-foreground">Track and analyze your trades</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => setIsAddingTrade(true)}
            variant="hero"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total PnL</p>
              <p className={`text-2xl font-mono font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                ${totalPnL.toFixed(2)}
              </p>
            </div>
            {totalPnL >= 0 ? 
              <TrendingUp className="w-8 h-8 text-profit" /> : 
              <TrendingDown className="w-8 h-8 text-loss" />
            }
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-mono font-bold text-card-foreground">
              {winRate.toFixed(1)}%
            </p>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-2xl font-mono font-bold text-card-foreground">
              {trades.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trades</SelectItem>
            <SelectItem value="profits">Profits Only</SelectItem>
            <SelectItem value="losses">Losses Only</SelectItem>
            <SelectItem value="open">Open Trades</SelectItem>
            <SelectItem value="swing">Swing Trades</SelectItem>
            <SelectItem value="scalp">Scalp Trades</SelectItem>
            <SelectItem value="position">Position Trades</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {filteredTrades.map((trade) => (
          <Card 
            key={trade.id} 
            className="glass-card p-4 hover:shadow-glow transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedTrade(trade)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {format(trade.entryTime, "MMM dd")}
                  </p>
                  <Badge variant={trade.direction === "LONG" ? "default" : "secondary"}>
                    {trade.direction}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground">{trade.symbol}</h3>
                    <Badge 
                      variant={trade.status === "open" ? "outline" : "secondary"}
                      className="text-xs"
                    >
                      {trade.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Entry: ${trade.entryPrice.toLocaleString()}
                    {trade.exits.length > 0 && (
                      <> → Exit: ${trade.exits[trade.exits.length - 1].price.toLocaleString()}</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-mono font-bold ${trade.totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {trade.totalPnL >= 0 ? '+' : ''}${trade.totalPnL.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {trade.quantity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrade(trade);
                  }}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {trade.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground line-clamp-2">{trade.notes}</p>
                <div className="flex gap-1 mt-2">
                  {trade.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {trade.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{trade.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
        
        {filteredTrades.length === 0 && (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">No trades found matching your filters.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddingTrade(true)}
            >
              Add Your First Trade
            </Button>
          </Card>
        )}
      </div>

      {/* Modals */}
      <TradeRegistrationForm
        isOpen={isAddingTrade}
        onClose={() => setIsAddingTrade(false)}
        onSubmit={addTrade}
      />

      <ChartModal
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        trade={selectedTrade}
      />
    </div>
  );
}