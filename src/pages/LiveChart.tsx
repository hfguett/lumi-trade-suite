import { useState } from "react";
import { TradingViewChart } from "@/components/trading/TradingViewChart";
import { TradingJournal } from "@/components/TradingJournal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, Calculator, Activity } from "lucide-react";

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Live Chart
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Trade Journal
          </TabsTrigger>
          <TabsTrigger value="split" className="gap-2">
            <Activity className="w-4 h-4" />
            Split View
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

        <TabsContent value="journal" className="mt-6">
          <TradingJournal />
        </TabsContent>

        <TabsContent value="split" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart takes 2/3 of space */}
            <div className="xl:col-span-2">
              <Card className="glass-card p-4">
                <TradingViewChart
                  symbol={selectedSymbol}
                  onSymbolChange={setSelectedSymbol}
                  height={600}
                  showControls={true}
                />
              </Card>
            </div>

            {/* Journal takes 1/3 of space */}
            <div className="xl:col-span-1">
              <Card className="glass-card p-4 max-h-[600px] overflow-y-auto">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Recent Trades
                </h3>
                <TradingJournal />
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}