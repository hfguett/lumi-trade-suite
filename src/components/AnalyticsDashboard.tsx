import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  PieChart,
  Activity,
  DollarSign
} from "lucide-react";
import { MetricCard } from "./MetricCard";

// Mock data for demonstration
const performanceData = {
  monthly: [
    { month: "Jan", pnl: 1250, winRate: 65, trades: 28 },
    { month: "Feb", pnl: -340, winRate: 45, trades: 22 },
    { month: "Mar", pnl: 2180, winRate: 72, trades: 35 },
    { month: "Apr", pnl: 890, winRate: 58, trades: 31 },
    { month: "May", pnl: 1560, winRate: 68, trades: 29 },
    { month: "Jun", pnl: -120, winRate: 48, trades: 25 },
  ],
  pairs: [
    { pair: "BTC/USDT", trades: 45, pnl: 2340, winRate: 67 },
    { pair: "ETH/USDT", trades: 38, pnl: 1890, winRate: 63 },
    { pair: "SOL/USDT", trades: 22, pnl: -450, winRate: 41 },
    { pair: "ADA/USDT", trades: 15, pnl: 780, winRate: 73 },
    { pair: "MATIC/USDT", trades: 18, pnl: 340, winRate: 56 },
  ],
  riskMetrics: {
    sharpeRatio: 1.34,
    maxDrawdown: 8.7,
    averageWin: 145.60,
    averageLoss: 89.20,
    profitFactor: 1.63,
    winStreak: 7,
    lossStreak: 3,
  }
};

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("6m");
  const [selectedMetric, setSelectedMetric] = useState("pnl");

  const totalPnL = performanceData.monthly.reduce((sum, month) => sum + month.pnl, 0);
  const totalTrades = performanceData.monthly.reduce((sum, month) => sum + month.trades, 0);
  const overallWinRate = performanceData.monthly.reduce((sum, month, idx, arr) => 
    sum + month.winRate / arr.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Analytics Dashboard</h2>
            <p className="text-sm text-muted-foreground">Comprehensive trading performance analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 bg-card border-border z-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total PnL"
          value={`$${totalPnL.toLocaleString()}`}
          change={`${totalPnL >= 0 ? '+' : ''}${((totalPnL / 10000) * 100).toFixed(1)}%`}
          changeType={totalPnL >= 0 ? "profit" : "loss"}
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          glowEffect={true}
        />
        
        <MetricCard
          title="Win Rate"
          value={`${overallWinRate.toFixed(1)}%`}
          description="Overall success rate"
          icon={<Target className="w-5 h-5 text-profit" />}
          changeType={overallWinRate >= 60 ? "profit" : overallWinRate >= 50 ? "neutral" : "loss"}
        />
        
        <MetricCard
          title="Sharpe Ratio"
          value={performanceData.riskMetrics.sharpeRatio.toFixed(2)}
          description="Risk-adjusted returns"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          changeType={performanceData.riskMetrics.sharpeRatio >= 1.5 ? "profit" : "neutral"}
        />
        
        <MetricCard
          title="Max Drawdown"
          value={`${performanceData.riskMetrics.maxDrawdown}%`}
          description="Largest peak-to-trough decline"
          icon={<TrendingDown className="w-5 h-5 text-loss" />}
          changeType="loss"
        />
      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Monthly Performance</h3>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-24 bg-card border-border z-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-40">
                <SelectItem value="pnl">PnL</SelectItem>
                <SelectItem value="winRate">Win Rate</SelectItem>
                <SelectItem value="trades">Trades</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            {performanceData.monthly.map((month, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-card-foreground w-8">{month.month}</span>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedMetric === 'pnl' && month.pnl >= 0 ? 'bg-gradient-profit' :
                          selectedMetric === 'pnl' && month.pnl < 0 ? 'bg-gradient-loss' :
                          selectedMetric === 'winRate' && month.winRate >= 60 ? 'bg-gradient-profit' :
                          selectedMetric === 'winRate' && month.winRate < 50 ? 'bg-gradient-loss' :
                          'bg-gradient-primary'
                        }`}
                        style={{ 
                          width: selectedMetric === 'pnl' ? 
                            `${Math.min(Math.abs(month.pnl) / 25, 100)}%` :
                            selectedMetric === 'winRate' ?
                            `${month.winRate}%` :
                            `${(month.trades / 40) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right min-w-20">
                  {selectedMetric === 'pnl' && (
                    <span className={`font-mono text-sm ${month.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      ${month.pnl}
                    </span>
                  )}
                  {selectedMetric === 'winRate' && (
                    <span className="font-mono text-sm text-card-foreground">{month.winRate}%</span>
                  )}
                  {selectedMetric === 'trades' && (
                    <span className="font-mono text-sm text-card-foreground">{month.trades}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trading Pairs Performance */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Top Trading Pairs</h3>
          <div className="space-y-4">
            {performanceData.pairs.map((pair, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-card-foreground">{pair.pair}</span>
                  <Badge variant="outline" className="text-xs">
                    {pair.trades} trades
                  </Badge>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${pair.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {pair.pnl >= 0 ? '+' : ''}${pair.pnl}
                  </p>
                  <p className="text-xs text-muted-foreground">{pair.winRate}% win rate</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Risk Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-profit">
              ${performanceData.riskMetrics.averageWin.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Average Win</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-loss">
              ${performanceData.riskMetrics.averageLoss.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Average Loss</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-mono font-bold text-primary">
              {performanceData.riskMetrics.profitFactor.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Profit Factor</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center gap-4">
              <div>
                <p className="text-lg font-mono font-bold text-profit">
                  {performanceData.riskMetrics.winStreak}
                </p>
                <p className="text-xs text-muted-foreground">Win Streak</p>
              </div>
              <div>
                <p className="text-lg font-mono font-bold text-loss">
                  {performanceData.riskMetrics.lossStreak}
                </p>
                <p className="text-xs text-muted-foreground">Loss Streak</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Goal Progress */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Goal Progress</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-card-foreground">Monthly Target: $2,000</span>
              <span className="text-sm text-primary-glow">
                {Math.min((Math.abs(totalPnL) / 2000) * 100, 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((Math.abs(totalPnL) / 2000) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-card-foreground">Win Rate Target: 70%</span>
              <span className="text-sm text-primary-glow">
                {Math.min((overallWinRate / 70) * 100, 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-profit h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((overallWinRate / 70) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}