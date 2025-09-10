import { useState } from "react";
import { TradingViewChart } from "@/components/trading/TradingViewChart";
import { TradingJournal } from "@/components/TradingJournal";
import { MarketWatch } from "@/components/trading/MarketWatch";
import { AlertSystem } from "@/components/trading/AlertSystem";
import { QuickTradeActions } from "@/components/trading/QuickTradeActions";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, Activity, Eye, Bell, Zap } from "lucide-react";

export default function LiveChartPage() {
  const [selectedSymbol, setSelectedSymbol] = useState("BINANCE:BTCUSDT");

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Live Trading Center</h1>
          <p className="text-muted-foreground">Real-time charts with trade analysis</p>
        </div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chart" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Chart
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="gap-2">
            <Eye className="w-4 h-4" />
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="quick-trade" className="gap-2">
            <Zap className="w-4 h-4" />
            Quick Trade
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="split" className="gap-2">
            <Activity className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-6">
          <Card className="glass-card p-6">
            <TradingViewChart
              symbol={selectedSymbol}
              onSymbolChange={setSelectedSymbol}
              height={700}
              showControls={true}
            />
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="mt-6">
          <MarketWatch 
            onSymbolSelect={setSelectedSymbol}
            selectedSymbol={selectedSymbol}
          />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertSystem />
        </TabsContent>

        <TabsContent value="quick-trade" className="mt-6">
          <QuickTradeActions symbol={selectedSymbol} />
        </TabsContent>

        <TabsContent value="journal" className="mt-6">
          <TradingJournal />
        </TabsContent>

        <TabsContent value="split" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chart takes main space */}
            <div className="lg:col-span-3">
              <Card className="glass-card p-4">
                <TradingViewChart
                  symbol={selectedSymbol}
                  onSymbolChange={setSelectedSymbol}
                  height={500}
                  showControls={true}
                />
              </Card>
            </div>

            {/* Side panel with market watch and quick actions */}
            <div className="lg:col-span-1 space-y-4">
              <MarketWatch 
                onSymbolSelect={setSelectedSymbol}
                selectedSymbol={selectedSymbol}
              />
              <Card className="glass-card p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
                <QuickTradeActions symbol={selectedSymbol} compact />
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}