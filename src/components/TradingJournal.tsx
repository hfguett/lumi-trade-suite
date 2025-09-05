import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Filter, Download, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

interface TradeEntry {
  id: string;
  date: Date;
  pair: string;
  type: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  notes: string;
  tags: string[];
  category: string;
}

const mockTrades: TradeEntry[] = [
  {
    id: "1",
    date: new Date(2024, 0, 15),
    pair: "BTC/USDT",
    type: "LONG",
    entryPrice: 42000,
    exitPrice: 45000,
    quantity: 0.1,
    pnl: 300,
    notes: "Strong bullish momentum after support hold at 41k",
    tags: ["momentum", "support"],
    category: "swing"
  },
  {
    id: "2", 
    date: new Date(2024, 0, 14),
    pair: "ETH/USDT",
    type: "SHORT",
    entryPrice: 2600,
    exitPrice: 2450,
    quantity: 2,
    pnl: 300,
    notes: "Failed to break resistance, clear rejection",
    tags: ["resistance", "rejection"],
    category: "scalp"
  },
  {
    id: "3",
    date: new Date(2024, 0, 13),
    pair: "SOL/USDT", 
    type: "LONG",
    entryPrice: 95,
    exitPrice: 88,
    quantity: 10,
    pnl: -70,
    notes: "Stop loss hit, market turned bearish",
    tags: ["stop-loss", "bearish"],
    category: "swing"
  }
];

export function TradingJournal() {
  const [trades, setTrades] = useState<TradeEntry[]>(mockTrades);
  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredTrades = trades.filter(trade => {
    if (filter === "all") return true;
    if (filter === "profits") return trade.pnl > 0;
    if (filter === "losses") return trade.pnl < 0;
    return trade.category === filter;
  });

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = (trades.filter(t => t.pnl > 0).length / trades.length) * 100;

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
            <SelectItem value="swing">Swing Trades</SelectItem>
            <SelectItem value="scalp">Scalp Trades</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trades List */}
      <div className="space-y-3">
        {filteredTrades.map((trade) => (
          <Card key={trade.id} className="glass-card p-4 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {format(trade.date, "MMM dd")}
                  </p>
                  <Badge variant={trade.type === "LONG" ? "default" : "secondary"}>
                    {trade.type}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-card-foreground">{trade.pair}</h3>
                  <p className="text-sm text-muted-foreground">
                    Entry: ${trade.entryPrice.toLocaleString()} → Exit: ${trade.exitPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-lg font-mono font-bold ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {trade.quantity}
                </p>
              </div>
            </div>
            
            {trade.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">{trade.notes}</p>
                <div className="flex gap-1 mt-2">
                  {trade.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}