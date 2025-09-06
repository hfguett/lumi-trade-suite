import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, Search, Copy, ExternalLink, TrendingUp, TrendingDown, Activity, Clock, DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";

const mockWalletData = {
  address: "0x742d35Cc6634C0532925a3b8f4638C7b7b4E2A1A",
  network: "Ethereum",
  balance: 847.23,
  totalValue: 1247890.50,
  totalPnL: 523847.23,
  totalPnLPercent: 72.4,
  firstTxDate: "2021-08-15",
  totalTxCount: 2847
};

const transactions = [
  {
    hash: "0x1234...abcd",
    type: "Buy",
    token: "ETH",
    amount: 5.0,
    price: 2400,
    value: 12000,
    fee: 25.50,
    timestamp: "2024-01-15 14:30:22",
    status: "Success"
  },
  {
    hash: "0x5678...efgh",
    type: "Sell",
    token: "USDC",
    amount: 8500,
    price: 1.0,
    value: 8500,
    fee: 18.75,
    timestamp: "2024-01-14 09:15:45",
    status: "Success"
  },
  {
    hash: "0x9abc...ijkl",
    type: "Swap",
    token: "UNI → ETH",
    amount: 250,
    price: 8.45,
    value: 2112.50,
    fee: 42.30,
    timestamp: "2024-01-13 16:22:18",
    status: "Success"
  },
  {
    hash: "0xdef0...mnop",
    type: "Transfer",
    token: "ETH",
    amount: 1.5,
    price: 2380,
    value: 3570,
    fee: 15.20,
    timestamp: "2024-01-12 11:45:12",
    status: "Success"
  },
  {
    hash: "0x1357...qrst",
    type: "Buy",
    token: "BTC",
    amount: 0.25,
    price: 45000,
    value: 11250,
    fee: 33.75,
    timestamp: "2024-01-11 08:30:55",
    status: "Failed"
  }
];

const portfolioHistory = [
  { date: "Jan", value: 45000, pnl: -15000 },
  { date: "Feb", value: 62000, pnl: 2000 },
  { date: "Mar", value: 78000, pnl: 18000 },
  { date: "Apr", value: 95000, pnl: 35000 },
  { date: "May", value: 125000, pnl: 65000 },
  { date: "Jun", value: 124790, pnl: 64790 }
];

const tokenHoldings = [
  { token: "ETH", amount: 45.67, value: 173542, cost: 98000, pnl: 75542, pnlPercent: 77.1 },
  { token: "BTC", amount: 1.25, value: 84375, cost: 52000, pnl: 32375, pnlPercent: 62.3 },
  { token: "USDC", amount: 25000, value: 25000, cost: 25000, pnl: 0, pnlPercent: 0 },
  { token: "UNI", amount: 850, value: 7225, cost: 5100, pnl: 2125, pnlPercent: 41.7 },
  { token: "LINK", amount: 420, value: 6930, cost: 4200, pnl: 2730, pnlPercent: 65.0 }
];

export function WalletTracker() {
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchAddress) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(mockWalletData.address);
  };

  const openInExplorer = () => {
    window.open(`https://etherscan.io/address/${mockWalletData.address}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Wallet Tracker</h1>
          <p className="text-muted-foreground">Track any wallet's transactions and PnL history</p>
        </div>
        
        <Card className="glass-card border-accent/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50 border-accent/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-secondary border-accent/20">
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Enter wallet address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="flex-1 bg-secondary/50 border-accent/20"
              />
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-accent/20 hover:bg-accent/30 text-accent gap-2"
              >
                <Search className="h-4 w-4" />
                {isLoading ? "Analyzing..." : "Track Wallet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Overview */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl text-card-foreground">Wallet Overview</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyAddress} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={openInExplorer} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Explorer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-sm text-muted-foreground mb-2">Wallet Address</p>
              <p className="font-mono text-card-foreground break-all">{mockWalletData.address}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{mockWalletData.network}</Badge>
                <span className="text-sm text-muted-foreground">
                  First transaction: {mockWalletData.firstTxDate}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Portfolio Value"
          value={`$${mockWalletData.totalValue.toLocaleString()}`}
          change={`+${mockWalletData.totalPnLPercent.toFixed(1)}%`}
          changeType="profit"
          glowEffect={true}
          icon={<Wallet className="h-5 w-5" />}
        />
        <MetricCard
          title="Unrealized P&L"
          value={`$${mockWalletData.totalPnL.toLocaleString()}`}
          description="Since inception"
          changeType="profit"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Total Transactions"
          value={mockWalletData.totalTxCount}
          description="All time"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="Active Since"
          value={`${Math.floor((Date.now() - new Date(mockWalletData.firstTxDate).getTime()) / (1000 * 60 * 60 * 24 * 365 * 10))/10} years`}
          description="First transaction"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Wallet Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-primary/20">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="holdings" className="data-[state=active]:bg-primary/20">
            Holdings
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-primary/20">
            Performance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.hash} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'Buy' ? 'bg-profit/20' :
                        tx.type === 'Sell' ? 'bg-loss/20' :
                        tx.type === 'Swap' ? 'bg-accent/20' :
                        'bg-secondary/40'
                      }`}>
                        {tx.type === 'Buy' ? <TrendingUp className="h-5 w-5 text-profit" /> :
                         tx.type === 'Sell' ? <TrendingDown className="h-5 w-5 text-loss" /> :
                         tx.type === 'Swap' ? <Activity className="h-5 w-5 text-accent" /> :
                         <ExternalLink className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {tx.type} {tx.token}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tx.amount} @ ${tx.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-card-foreground">
                        ${tx.value.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fee: ${tx.fee}
                      </p>
                      <Badge 
                        variant="outline"
                        className={tx.status === 'Success' ? 'text-profit border-profit/30 bg-profit/10' : 'text-loss border-loss/30 bg-loss/10'}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holdings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl text-card-foreground">Current Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokenHoldings.map((holding) => (
                  <div key={holding.token} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-accent">
                        {holding.token}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{holding.token}</h3>
                        <p className="text-sm text-muted-foreground">{holding.amount} tokens</p>
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
                          ${holding.pnl >= 0 ? '+' : ''}{holding.pnl.toLocaleString()}
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
                          {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(1)}%
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
              <CardTitle className="text-xl text-card-foreground">Portfolio Performance Over Time</CardTitle>
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
                  <Area type="monotone" dataKey="pnl" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <MetricCard
              title="Best Month"
              value="+$60K"
              description="March 2024"
              changeType="profit"
            />
            <MetricCard
              title="Worst Month"
              value="-$15K"
              description="January 2024"
              changeType="loss"
            />
            <MetricCard
              title="Average Monthly Return"
              value="+23.4%"
              description="6-month average"
              changeType="profit"
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Trading Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Most Active Hour</span>
                  <Badge variant="outline">2:00 PM UTC</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Avg Transaction Size</span>
                  <Badge variant="outline">$4,287</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Success Rate</span>
                  <Badge className="bg-profit/20 text-profit">87.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Holding Period</span>
                  <Badge variant="outline">4.2 months avg</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Portfolio Beta</span>
                  <Badge variant="outline">1.34</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Max Drawdown</span>
                  <Badge className="bg-loss/20 text-loss">-23.1%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sharpe Ratio</span>
                  <Badge className="bg-profit/20 text-profit">2.14</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Volatility</span>
                  <Badge variant="outline">45.7%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}