import { useMemo } from "react";
import { ComposedChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line, ReferenceLine } from "recharts";
import { TradeEntry, CandleData } from "@/types/trading";
import { format } from "date-fns";

interface TradingChartProps {
  candleData: CandleData[];
  trade: TradeEntry;
  showVolume: boolean;
}

export function TradingChart({ candleData, trade, showVolume }: TradingChartProps) {
  const chartData = useMemo(() => {
    return candleData.map(candle => ({
      time: candle.time,
      timeLabel: format(new Date(candle.time), "MMM dd HH:mm"),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      // Add trade markers
      isEntry: Math.abs(candle.time - trade.entryTime.getTime()) < 3600000, // Within 1 hour
      isExit: trade.exits.some(exit => Math.abs(candle.time - exit.time.getTime()) < 3600000),
    }));
  }, [candleData, trade]);

  const priceRange = useMemo(() => {
    const prices = candleData.flatMap(d => [d.high, d.low]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return { min: min - padding, max: max + padding };
  }, [candleData]);

  if (candleData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="timeLabel"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[priceRange.min, priceRange.max]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          
          {/* Entry Price Line */}
          <ReferenceLine 
            y={trade.entryPrice} 
            stroke="#3b82f6" 
            strokeDasharray="5 5"
            label={{ value: `Entry: $${trade.entryPrice.toLocaleString()}`, position: "top" }}
          />
          
          {/* Stop Price Line */}
          {trade.stopPrice && (
            <ReferenceLine 
              y={trade.stopPrice} 
              stroke="#ef4444" 
              strokeDasharray="3 3"
              label={{ value: `Stop: $${trade.stopPrice.toLocaleString()}`, position: "top" }}
            />
          )}
          
          {/* Exit Price Lines */}
          {trade.exits.map((exit, index) => (
            <ReferenceLine 
              key={exit.id}
              y={exit.price} 
              stroke="#22c55e" 
              strokeDasharray="5 5"
              label={{ value: `Exit ${index + 1}: $${exit.price.toLocaleString()}`, position: "top" }}
            />
          ))}

          {/* Volume bars (if enabled) */}
          {showVolume && (
            <Line 
              dataKey="volume" 
              stroke="hsl(var(--muted))" 
              strokeWidth={1}
              dot={false}
              yAxisId="volume"
            />
          )}

          {/* Price line */}
          <Line 
            dataKey="close" 
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Entry/Exit markers overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        {chartData.some(d => d.isEntry) && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Entry Point</span>
          </div>
        )}
        {chartData.some(d => d.isExit) && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Exit Point</span>
          </div>
        )}
        {trade.stopPrice && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Stop Loss</span>
          </div>
        )}
      </div>
    </div>
  );
}