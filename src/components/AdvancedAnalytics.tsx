import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Target, Award, AlertCircle, BarChart3 } from "lucide-react";
import { MetricCard } from "./MetricCard";

const performanceData = [
  { month: "Jan", pnl: 2400, trades: 45, winRate: 68 },
  { month: "Feb", pnl: 1800, trades: 52, winRate: 72 },
  { month: "Mar", pnl: 3200, trades: 38, winRate: 75 },
  { month: "Apr", pnl: -800, trades: 61, winRate: 58 },
  { month: "May", pnl: 4200, trades: 43, winRate: 81 },
  { month: "Jun", pnl: 2800, trades: 49, winRate: 69 },
];

const riskMetrics = [
  { name: "Max Drawdown", value: "-12.4%", status: "warning" },
  { name: "Sharpe Ratio", value: "1.87", status: "good" },
  { name: "Calmar Ratio", value: "2.34", status: "good" },
  { name: "Win Rate", value: "68.5%", status: "good" },
  { name: "Profit Factor", value: "1.92", status: "good" },
  { name: "Average R:R", value: "1:2.1", status: "excellent" }
];

const streakData = [
  { type: "Current Win Streak", value: 7, color: "#10b981" },
  { type: "Max Win Streak", value: 15, color: "#059669" },
  { type: "Current Loss Streak", value: 0, color: "#ef4444" },
  { type: "Max Loss Streak", value: 4, color: "#dc2626" }
];

const assetAllocation = [
  { name: "Stocks", value: 45, color: "#10b981" },
  { name: "Crypto", value: 30, color: "#3b82f6" },
  { name: "Forex", value: 20, color: "#8b5cf6" },
  { name: "Commodities", value: 5, color: "#f59e0b" }
];

const tradingPairs = [
  { pair: "BTC/USD", trades: 48, pnl: 3420, winRate: 72, avgHold: "4.2h" },
  { pair: "EUR/USD", trades: 34, pnl: 1890, winRate: 68, avgHold: "2.1h" },
  { pair: "AAPL", trades: 29, pnl: 2150, winRate: 75, avgHold: "6.8h" },
  { pair: "ETH/USD", trades: 25, pnl: 1650, winRate: 69, avgHold: "5.3h" },
  { pair: "TSLA", trades: 22, pnl: -420, winRate: 54, avgHold: "3.7h" }
];

const monthlyGoals = [
  { month: "January", target: 5000, actual: 4200, achieved: false },
  { month: "February", target: 5000, actual: 5800, achieved: true },
  { month: "March", target: 5000, actual: 6200, achieved: true },
  { month: "April", target: 5000, actual: 3800, achieved: false },
  { month: "May", target: 5000, actual: 7100, achieved: true },
  { month: "June", target: 5000, actual: 4900, achieved: false }
];

export function AdvancedAnalytics() {
  const [timeframe, setTimeframe] = useState("6M");
  const [selectedMetric, setSelectedMetric] = useState("pnl");

  const totalPnL = performanceData.reduce((sum, item) => sum + item.pnl, 0);
  const totalTrades = performanceData.reduce((sum, item) => sum + item.trades, 0);
  const avgWinRate = performanceData.reduce((sum, item) => sum + item.winRate, 0) / performanceData.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-accent border-accent/30 bg-accent/10";
      case "good": return "text-profit border-profit/30 bg-profit/10";
      case "warning": return "text-orange-400 border-orange-400/30 bg-orange-400/10";
      default: return "text-muted-foreground border-muted/30 bg-muted/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your trading performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px] bg-secondary/50 border-accent/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-accent/20">
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="glass" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total P&L"
          value={`$${totalPnL.toLocaleString()}`}
          change="+18.5%"
          changeType="profit"
          glowEffect={true}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Trades"
          value={totalTrades}
          description="Across all pairs"
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <MetricCard
          title="Average Win Rate"
          value={`${avgWinRate.toFixed(1)}%`}
          change="+2.3%"
          changeType="profit"
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Risk Score"
          value="8.4/10"
          description="Excellent risk management"
          changeType="profit"
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary/20">
            Performance
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-primary/20">
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="streaks" className="data-[state=active]:bg-primary/20">
            Win/Loss Streaks
          </TabsTrigger>
          <TabsTrigger value="pairs" className="data-[state=active]:bg-primary/20">
            Trading Pairs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Monthly P&L Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="pnl" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Monthly Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyGoals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="target" fill="rgba(107, 114, 128, 0.5)" name="Target" />
                  <Bar dataKey="actual" fill="#10b981" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskMetrics.map((metric) => (
              <MetricCard
                key={metric.name}
                title={metric.name}
                value={metric.value}
                changeType={metric.status === "good" || metric.status === "excellent" ? "profit" : metric.status === "warning" ? "neutral" : "loss"}
                glowEffect={metric.status === "excellent"}
              />
            ))}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Risk Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-profit/10 border border-profit/20">
                  <h3 className="font-semibold text-profit mb-2">Strengths</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Excellent Sharpe ratio indicates good risk-adjusted returns</li>
                    <li>• Strong profit factor shows winning trades outweigh losses</li>
                    <li>• Good average risk-reward ratio of 1:2.1</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-orange-400/10 border border-orange-400/20">
                  <h3 className="font-semibold text-orange-400 mb-2">Areas for Improvement</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Max drawdown of 12.4% could be reduced with better position sizing</li>
                    <li>• Consider diversifying across more asset classes</li>
                    <li>• Monitor correlation between positions to reduce portfolio risk</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {streakData.map((streak) => (
              <MetricCard
                key={streak.type}
                title={streak.type}
                value={streak.value}
                changeType={streak.type.includes("Win") ? "profit" : "loss"}
                glowEffect={streak.type === "Current Win Streak" && streak.value > 5}
              />
            ))}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Streak Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Current Performance</h3>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-profit/20 text-profit text-lg px-4 py-2">
                      7 Win Streak 🔥
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      You're on fire! Keep following your strategy.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-card-foreground mb-3">Streak Insights</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-secondary/20">
                      <p className="font-medium text-card-foreground">Average Win Streak</p>
                      <p className="text-xl font-mono text-profit">8.3 trades</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/20">
                      <p className="font-medium text-card-foreground">Average Loss Streak</p>
                      <p className="text-xl font-mono text-loss">2.1 trades</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pairs" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Top Trading Pairs Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingPairs.map((pair, index) => (
                  <div key={pair.pair} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{pair.pair}</h3>
                        <p className="text-sm text-muted-foreground">{pair.trades} trades</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">P&L</p>
                        <p className={`font-mono font-bold ${pair.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                          ${pair.pnl >= 0 ? '+' : ''}{pair.pnl}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="font-mono font-bold text-card-foreground">{pair.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Hold</p>
                        <p className="font-mono font-bold text-card-foreground">{pair.avgHold}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}