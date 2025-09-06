import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign, Percent, Target, AlertTriangle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const portfolioHoldings = [
  { 
    symbol: "BTC", 
    name: "Bitcoin", 
    amount: 0.75, 
    value: 50425.67, 
    cost: 45000, 
    pnl: 5425.67, 
    pnlPercent: 12.06,
    allocation: 42.5,
    color: "#f7931a" 
  },
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    amount: 12.5, 
    value: 47362.50, 
    cost: 40000, 
    pnl: 7362.50, 
    pnlPercent: 18.41,
    allocation: 39.8,
    color: "#627eea" 
  },
  { 
    symbol: "SOL", 
    name: "Solana", 
    amount: 45, 
    value: 8032.50, 
    cost: 6750, 
    pnl: 1282.50, 
    pnlPercent: 19.00,
    allocation: 6.8,
    color: "#9945ff" 
  },
  { 
    symbol: "ADA", 
    name: "Cardano", 
    amount: 2500, 
    value: 1675.00, 
    cost: 2000, 
    pnl: -325.00, 
    pnlPercent: -16.25,
    allocation: 1.4,
    color: "#0033ad" 
  },
  { 
    symbol: "MATIC", 
    name: "Polygon", 
    amount: 1200, 
    value: 1080.00, 
    cost: 960, 
    pnl: 120.00, 
    pnlPercent: 12.50,
    allocation: 0.9,
    color: "#8247e5" 
  }
];

const portfolioHistory = [
  { date: "Jan", value: 95000, pnl: 0 },
  { date: "Feb", value: 102000, pnl: 7000 },
  { date: "Mar", value: 98000, pnl: 3000 },
  { date: "Apr", value: 105000, pnl: 10000 },
  { date: "May", value: 118000, pnl: 23000 },
  { date: "Jun", value: 119575, pnl: 24575 }
];

const rebalanceRecommendations = [
  { 
    asset: "BTC", 
    current: 42.5, 
    target: 40, 
    action: "Sell", 
    amount: "$2,987.50", 
    priority: "Medium" 
  },
  { 
    asset: "ETH", 
    current: 39.8, 
    target: 35, 
    action: "Sell", 
    amount: "$5,722.50", 
    priority: "Low" 
  },
  { 
    asset: "SOL", 
    current: 6.8, 
    target: 15, 
    action: "Buy", 
    amount: "$9,800.00", 
    priority: "High" 
  },
  { 
    asset: "ADA", 
    current: 1.4, 
    target: 5, 
    action: "Buy", 
    amount: "$4,295.00", 
    priority: "Medium" 
  }
];

export function SpotPortfolio() {
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({ symbol: "", amount: "", price: "" });

  const totalValue = portfolioHoldings.reduce((sum, holding) => sum + holding.value, 0);
  const totalCost = portfolioHoldings.reduce((sum, holding) => sum + holding.cost, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  const profitableHoldings = portfolioHoldings.filter(h => h.pnl > 0).length;
  const bestPerformer = portfolioHoldings.reduce((best, current) => 
    current.pnlPercent > best.pnlPercent ? current : best
  );

  const handleAddAsset = () => {
    if (newAsset.symbol && newAsset.amount && newAsset.price) {
      // In real app, this would add to portfolio
      console.log("Adding asset:", newAsset);
      setNewAsset({ symbol: "", amount: "", price: "" });
      setShowAddAsset(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Spot Portfolio</h1>
          <p className="text-muted-foreground">Track your cryptocurrency holdings and performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="glass" 
            onClick={() => setShowAddAsset(!showAddAsset)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
          <Button variant="glass" className="gap-2">
            <Target className="h-4 w-4" />
            Rebalance
          </Button>
        </div>
      </div>

      {/* Add Asset Form */}
      {showAddAsset && (
        <Card className="glass-card border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Add New Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Input
                placeholder="Symbol (e.g., BTC)"
                value={newAsset.symbol}
                onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value.toUpperCase() })}
                className="bg-secondary/50 border-accent/20"
              />
              <Input
                placeholder="Amount"
                type="number"
                value={newAsset.amount}
                onChange={(e) => setNewAsset({ ...newAsset, amount: e.target.value })}
                className="bg-secondary/50 border-accent/20"
              />
              <Input
                placeholder="Purchase Price"
                type="number"
                value={newAsset.price}
                onChange={(e) => setNewAsset({ ...newAsset, price: e.target.value })}
                className="bg-secondary/50 border-accent/20"
              />
              <Button onClick={handleAddAsset} className="bg-accent/20 hover:bg-accent/30 text-accent">
                Add Asset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Portfolio Value"
          value={`$${totalValue.toLocaleString()}`}
          change={`+$${totalPnL.toLocaleString()}`}
          changeType="profit"
          glowEffect={true}
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricCard
          title="Total P&L"
          value={`${totalPnLPercent >= 0 ? '+' : ''}${totalPnLPercent.toFixed(2)}%`}
          description={`$${totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}`}
          changeType={totalPnL >= 0 ? "profit" : "loss"}
          icon={totalPnL >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        />
        <MetricCard
          title="Profitable Holdings"
          value={`${profitableHoldings}/${portfolioHoldings.length}`}
          description={`${((profitableHoldings / portfolioHoldings.length) * 100).toFixed(0)}% success rate`}
          changeType="profit"
          icon={<Percent className="h-5 w-5" />}
        />
        <MetricCard
          title="Best Performer"
          value={bestPerformer.symbol}
          description={`+${bestPerformer.pnlPercent.toFixed(2)}%`}
          changeType="profit"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Portfolio Tabs */}
      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="holdings" className="data-[state=active]:bg-primary/20">
            Holdings
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary/20">
            Performance
          </TabsTrigger>
          <TabsTrigger value="allocation" className="data-[state=active]:bg-primary/20">
            Allocation
          </TabsTrigger>
          <TabsTrigger value="rebalance" className="data-[state=active]:bg-primary/20">
            Rebalancing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Current Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioHoldings.map((holding) => (
                  <div key={holding.symbol} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: holding.color }}
                      >
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{holding.name}</h3>
                        <p className="text-sm text-muted-foreground">{holding.amount} {holding.symbol}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-mono font-bold text-card-foreground">
                          ${holding.value.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">P&L</p>
                        <p className={`font-mono font-bold ${holding.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                          ${holding.pnl >= 0 ? '+' : ''}{holding.pnl.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">%</p>
                        <Badge 
                          variant="outline"
                          className={`${
                            holding.pnlPercent >= 0 
                              ? 'text-profit border-profit/30 bg-profit/10' 
                              : 'text-loss border-loss/30 bg-loss/10'
                          }`}
                        >
                          {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={portfolioHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">30-Day Return</span>
                  <Badge className="bg-profit/20 text-profit">+12.4%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Max Drawdown</span>
                  <Badge className="bg-loss/20 text-loss">-8.7%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Volatility</span>
                  <Badge variant="outline">24.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sharpe Ratio</span>
                  <Badge className="bg-profit/20 text-profit">1.87</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Top Gainers & Losers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded bg-profit/10">
                  <span className="font-medium text-card-foreground">SOL</span>
                  <Badge className="bg-profit/20 text-profit">+19.00%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-profit/10">
                  <span className="font-medium text-card-foreground">ETH</span>
                  <Badge className="bg-profit/20 text-profit">+18.41%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-loss/10">
                  <span className="font-medium text-card-foreground">ADA</span>
                  <Badge className="bg-loss/20 text-loss">-16.25%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioHoldings}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="allocation"
                      label={({ symbol, allocation }) => `${symbol}: ${allocation}%`}
                    >
                      {portfolioHoldings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Allocation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioHoldings.map((holding) => (
                    <div key={holding.symbol} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-card-foreground">{holding.symbol}</span>
                        <span className="text-sm text-muted-foreground">{holding.allocation}%</span>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${holding.allocation}%`, 
                            backgroundColor: holding.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rebalance" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Rebalancing Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rebalanceRecommendations.map((rec) => (
                  <div key={rec.asset} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-card-foreground">{rec.asset}</h3>
                        <p className="text-sm text-muted-foreground">
                          {rec.current}% → {rec.target}% target
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={`${
                          rec.priority === "High" 
                            ? "text-loss border-loss/30 bg-loss/10"
                            : rec.priority === "Medium"
                            ? "text-orange-400 border-orange-400/30 bg-orange-400/10"
                            : "text-muted-foreground border-muted/30 bg-muted/10"
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                      <div className="text-right">
                        <p className="font-semibold text-card-foreground">{rec.action}</p>
                        <p className="text-sm text-muted-foreground">{rec.amount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">Rebalancing Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm text-muted-foreground">Estimated Fees</p>
                  <p className="text-xl font-mono font-bold text-card-foreground">$127.50</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm text-muted-foreground">Risk Reduction</p>
                  <p className="text-xl font-mono font-bold text-profit">-15.3%</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20">
                  <p className="text-sm text-muted-foreground">Diversification Score</p>
                  <p className="text-xl font-mono font-bold text-accent">8.7/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}