import { TrendingUp, TrendingDown, BarChart3, Target, Activity, DollarSign } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/trading-hero.jpg";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8 lg:p-12">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Professional Trading
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Analytics</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Advanced tools for calculating PnL, tracking performance, and managing risk. 
            Make data-driven trading decisions with professional-grade analytics.
          </p>
          <Button variant="hero" size="lg" className="shadow-glow">
            Start Trading Analysis
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Performance Overview</h2>
        <p className="text-muted-foreground mb-6">
          Your trading performance at a glance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Portfolio Value"
          value="$24,567.89"
          change="+12.5%"
          changeType="profit"
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          glowEffect={true}
        />
        
        <MetricCard
          title="Monthly PnL"
          value="$1,234.56"
          change="+8.2%"
          changeType="profit"
          icon={<TrendingUp className="w-5 h-5 text-profit" />}
          glowEffect={true}
        />
        
        <MetricCard
          title="Win Rate"
          value="68.5%"
          change="+2.1%"
          changeType="profit"
          icon={<Target className="w-5 h-5 text-primary" />}
        />
        
        <MetricCard
          title="Active Positions"
          value="7"
          change="2 new"
          changeType="neutral"
          icon={<Activity className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Quick Actions */}
      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
            className="h-auto p-4"
            variant="hero"
            onClick={() => window.location.href = '/calculator'}
          >
            <div className="text-left">
              <h3 className="font-semibold">Calculate PnL</h3>
              <p className="text-sm opacity-90">Quick profit/loss calculation</p>
            </div>
          </Button>
          
          <Button 
            variant="glass"
            className="h-auto p-4"
            onClick={() => window.location.href = '/journal'}
          >
            <div className="text-left">
              <h3 className="font-semibold">Add Trade</h3>
              <p className="text-sm opacity-80">Log your latest trade</p>
            </div>
          </Button>
          
          <Button 
            variant="glass"
            className="h-auto p-4"
            onClick={() => window.location.href = '/analytics'}
          >
            <div className="text-left">
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-sm opacity-80">Detailed performance metrics</p>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Recent Trades</h2>
          <div className="space-y-3">
            {[
              { pair: "BTC/USDT", type: "LONG", pnl: 245.67, time: "2 hours ago" },
              { pair: "ETH/USDT", type: "SHORT", pnl: -89.12, time: "5 hours ago" },
              { pair: "SOL/USDT", type: "LONG", pnl: 156.89, time: "1 day ago" },
            ].map((trade, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${trade.type === 'LONG' ? 'bg-profit' : 'bg-loss'}`} />
                  <div>
                    <p className="font-medium text-card-foreground">{trade.pair}</p>
                    <p className="text-sm text-muted-foreground">{trade.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{trade.type}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Performance Trends</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="font-mono font-semibold text-profit">+$567.89</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-profit h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="font-mono font-semibold text-profit">+$1,234.56</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-profit h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-medium text-card-foreground">Goal Progress</span>
              <span className="text-sm text-primary-glow">68% to target</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}