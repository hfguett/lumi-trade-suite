import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";

const marketData = {
  indices: [
    { name: "S&P 500", value: "4,193.80", change: "+1.2%", changeType: "profit" as const },
    { name: "NASDAQ", value: "12,975.69", change: "+2.1%", changeType: "profit" as const },
    { name: "Dow Jones", value: "33,826.16", change: "+0.8%", changeType: "profit" as const },
    { name: "Russell 2000", value: "1,789.43", change: "-0.5%", changeType: "loss" as const }
  ],
  crypto: [
    { name: "Bitcoin", symbol: "BTC", price: "$67,234.56", change: "+3.4%", changeType: "profit" as const },
    { name: "Ethereum", symbol: "ETH", price: "$3,789.12", change: "+5.2%", changeType: "profit" as const },
    { name: "Solana", symbol: "SOL", price: "$178.45", change: "+8.7%", changeType: "profit" as const },
    { name: "Cardano", symbol: "ADA", price: "$0.67", change: "-2.1%", changeType: "loss" as const }
  ],
  forex: [
    { name: "EUR/USD", value: "1.0876", change: "+0.12%", changeType: "profit" as const },
    { name: "GBP/USD", value: "1.2734", change: "-0.34%", changeType: "loss" as const },
    { name: "USD/JPY", value: "148.67", change: "+0.56%", changeType: "profit" as const },
    { name: "AUD/USD", value: "0.6789", change: "+0.23%", changeType: "profit" as const }
  ]
};

const rateCutData = {
  nextMeeting: "December 18, 2024",
  currentRate: "5.25-5.50%",
  probability: "87%",
  expectedCut: "0.25%",
  impact: "Bullish for equities, bearish for USD"
};

const fearGreedIndex = {
  score: 72,
  status: "Greed",
  description: "Markets showing strong bullish sentiment"
};

export function MarketData() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Rate Cut Alert Banner */}
      <Card className="glass-card border-accent/50 bg-gradient-to-r from-accent/5 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground">Fed Rate Cut Alert</h3>
              <p className="text-sm text-muted-foreground">
                {rateCutData.probability} probability of {rateCutData.expectedCut} cut on {rateCutData.nextMeeting}
              </p>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              {rateCutData.currentRate}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Fear & Greed Index"
          value={fearGreedIndex.score}
          description={fearGreedIndex.status}
          changeType="profit"
          glowEffect={true}
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Market Cap"
          value="$2.8T"
          change="+4.2%"
          changeType="profit"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="24h Volume"
          value="$89.4B"
          change="+12.8%"
          changeType="profit"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Volatility Index"
          value="18.4"
          change="-2.1%"
          changeType="loss"
          icon={<TrendingDown className="h-5 w-5" />}
        />
      </div>

      {/* Market Data Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20">
            Stock Indices
          </TabsTrigger>
          <TabsTrigger value="crypto" className="data-[state=active]:bg-primary/20">
            Cryptocurrency
          </TabsTrigger>
          <TabsTrigger value="forex" className="data-[state=active]:bg-primary/20">
            Forex
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Stock Market Indices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {marketData.indices.map((index) => (
                  <div key={index.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{index.name}</h3>
                      <p className="text-2xl font-mono font-bold text-card-foreground">{index.value}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        index.changeType === 'profit' 
                          ? 'text-profit border-profit/30 bg-profit/10' 
                          : 'text-loss border-loss/30 bg-loss/10'
                      }`}
                    >
                      {index.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Cryptocurrency Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {marketData.crypto.map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground">{crypto.name}</h3>
                        <Badge variant="outline" className="text-xs">{crypto.symbol}</Badge>
                      </div>
                      <p className="text-xl font-mono font-bold text-card-foreground">{crypto.price}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        crypto.changeType === 'profit' 
                          ? 'text-profit border-profit/30 bg-profit/10' 
                          : 'text-loss border-loss/30 bg-loss/10'
                      }`}
                    >
                      {crypto.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forex" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Foreign Exchange</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {marketData.forex.map((pair) => (
                  <div key={pair.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{pair.name}</h3>
                      <p className="text-xl font-mono font-bold text-card-foreground">{pair.value}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        pair.changeType === 'profit' 
                          ? 'text-profit border-profit/30 bg-profit/10' 
                          : 'text-loss border-loss/30 bg-loss/10'
                      }`}
                    >
                      {pair.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rate Cut Impact Analysis */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl text-card-foreground">Rate Cut Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Expected Impacts</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-lg bg-profit/10">
                  <span className="text-sm">Stock Markets</span>
                  <Badge className="bg-profit/20 text-profit">Bullish</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-loss/10">
                  <span className="text-sm">USD Strength</span>
                  <Badge className="bg-loss/20 text-loss">Bearish</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-profit/10">
                  <span className="text-sm">Crypto Markets</span>
                  <Badge className="bg-profit/20 text-profit">Bullish</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Trading Opportunities</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Consider increasing equity exposure before rate cuts</p>
                <p>• Monitor USD pairs for shorting opportunities</p>
                <p>• Crypto could benefit from lower rates</p>
                <p>• Real estate sector historically performs well</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}