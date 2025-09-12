import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Target
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay } from "date-fns";

interface DailyPnL {
  date: Date;
  amount: number;
  trades: number;
}

// Generate mock PnL data for demonstration
const generateMockPnLData = (month: Date): DailyPnL[] => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  return days.map(date => {
    // Generate realistic trading data
    const hasTrading = Math.random() > 0.2; // 80% chance of trading
    if (!hasTrading) return { date, amount: 0, trades: 0 };
    
    const volatility = 50000 + Math.random() * 100000;
    const direction = Math.random() > 0.4 ? 1 : -1; // 60% win rate
    const amount = direction * (Math.random() * volatility + 10000);
    const trades = Math.floor(Math.random() * 8) + 1;
    
    return { date, amount: Math.round(amount), trades };
  });
};

export function PnLCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [pnlData] = useState(() => generateMockPnLData(currentMonth));

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const formatPnL = (amount: number) => {
    const abs = Math.abs(amount);
    const sign = amount >= 0 ? '+' : '-';
    
    if (abs >= 1000000) {
      return `${sign}$${(abs / 1000000).toFixed(1)}M`;
    } else if (abs >= 1000) {
      return `${sign}$${(abs / 1000).toFixed(0)}K`;
    }
    return `${sign}$${abs.toFixed(0)}`;
  };

  const getPnLColor = (amount: number) => {
    if (amount > 0) return "text-profit bg-profit/10 border-profit/20";
    if (amount < 0) return "text-loss bg-loss/10 border-loss/20";
    return "text-muted-foreground bg-muted/20 border-muted/20";
  };

  // Calculate statistics
  const totalPnL = pnlData.reduce((sum, day) => sum + day.amount, 0);
  const profitDays = pnlData.filter(day => day.amount > 0).length;
  const totalTradingDays = pnlData.filter(day => day.trades > 0).length;
  const winRate = totalTradingDays > 0 ? (profitDays / totalTradingDays) * 100 : 0;

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let isCurrentStreakActive = true;

  for (let i = pnlData.length - 1; i >= 0; i--) {
    const day = pnlData[i];
    if (day.trades === 0) continue; // Skip non-trading days
    
    if (day.amount > 0) {
      tempStreak++;
      if (isCurrentStreakActive) currentStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 0;
      isCurrentStreakActive = false;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  // Create calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - getDay(monthStart));
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - getDay(monthEnd)));
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">PnL Calendar</h2>
            <p className="text-sm text-muted-foreground">Daily profit & loss tracking</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly PnL</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatPnL(totalPnL)}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${totalPnL >= 0 ? 'text-profit' : 'text-loss'}`} />
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold text-card-foreground">{winRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">{profitDays}/{totalTradingDays}</p>
            </div>
            <Target className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-profit">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-profit" />
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Streak</p>
              <p className="text-2xl font-bold text-primary">{bestStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="glass-card p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-card-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date) => {
            const dayData = pnlData.find(d => 
              format(d.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            );
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const pnlAmount = dayData?.amount || 0;
            const hasTrading = dayData?.trades && dayData.trades > 0;

            return (
              <div
                key={format(date, 'yyyy-MM-dd')}
                className={`
                  relative h-20 rounded-lg border transition-all duration-200 hover:scale-105
                  ${isCurrentMonth ? 'opacity-100' : 'opacity-30'}
                  ${hasTrading ? getPnLColor(pnlAmount) : 'bg-muted/5 border-muted/20'}
                `}
              >
                <div className="p-2 h-full flex flex-col justify-between">
                  <div className="text-xs font-medium">
                    {format(date, 'd')}
                  </div>
                  
                  {hasTrading && (
                    <div className="text-center">
                      <div className={`text-xs font-bold ${pnlAmount >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {formatPnL(pnlAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {dayData?.trades} trades
                      </div>
                    </div>
                  )}
                  
                  {!hasTrading && isCurrentMonth && (
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">$0</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Streak Info */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-muted/20">
          <div className="text-sm text-muted-foreground">
            Current Positive Streak: <span className="font-semibold text-profit">{currentStreak} days</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Best Positive Streak in {format(currentMonth, 'MMMM')}: <span className="font-semibold text-primary">{bestStreak} days</span>
          </div>
        </div>
      </Card>
    </div>
  );
}