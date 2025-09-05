import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  type: "trade" | "earnings" | "economic" | "personal";
  date: Date;
  time: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed?: boolean;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "NVDA Earnings Report",
    type: "earnings",
    date: new Date(2024, 1, 21),
    time: "16:00",
    description: "Q4 earnings expected to beat estimates",
    priority: "high"
  },
  {
    id: "2",
    title: "Fed Interest Rate Decision",
    type: "economic",
    date: new Date(2024, 1, 20),
    time: "14:00",
    description: "FOMC meeting - potential rate change",
    priority: "high"
  },
  {
    id: "3",
    title: "Review BTC Position",
    type: "trade",
    date: new Date(2024, 1, 19),
    time: "09:00",
    description: "Check technical levels and adjust stop loss",
    priority: "medium",
    completed: true
  },
  {
    id: "4",
    title: "Weekly Portfolio Review",
    type: "personal",
    date: new Date(2024, 1, 18),
    time: "17:00",
    description: "Analyze week performance and plan next week",
    priority: "medium"
  }
];

const weeklyGoals = [
  { id: "1", goal: "Complete 5 quality trades", progress: 3, target: 5, status: "active" },
  { id: "2", goal: "Maintain 2% risk per trade", progress: 4, target: 5, status: "active" },
  { id: "3", goal: "Journal all trades", progress: 5, target: 5, status: "completed" },
  { id: "4", goal: "Study market analysis", progress: 2, target: 3, status: "active" }
];

export function CalendarPlanning() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'trade': return 'bg-primary/10 border-primary/20 text-primary';
      case 'earnings': return 'bg-profit/10 border-profit/20 text-profit';
      case 'economic': return 'bg-loss/10 border-loss/20 text-loss';
      case 'personal': return 'bg-accent/10 border-accent/20 text-accent-foreground';
    }
  };

  const getPriorityIcon = (priority: CalendarEvent['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-loss" />;
      case 'medium': return <Clock className="w-4 h-4 text-primary" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const thisWeekEvents = events.filter(event => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return event.date >= weekStart && event.date <= weekEnd;
  });

  const upcomingEvents = events
    .filter(event => event.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Calendar Planning</h2>
            <p className="text-sm text-muted-foreground">Schedule trades and track market events</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddEvent(true)}
          variant="hero"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-card-foreground">{thisWeekEvents.length}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-profit" />
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {events.filter(e => e.type === 'earnings').length}
              </p>
              <p className="text-sm text-muted-foreground">Earnings</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {events.filter(e => e.type === 'trade').length}
              </p>
              <p className="text-sm text-muted-foreground">Trade Plans</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-loss" />
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {events.filter(e => e.priority === 'high').length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(event.priority)}
                    <h4 className="font-semibold text-card-foreground">{event.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{format(event.date, 'MMM dd, yyyy')}</span>
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Goals */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Weekly Trading Goals</h3>
          <div className="space-y-4">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-card-foreground">{goal.goal}</span>
                  <Badge variant={goal.status === 'completed' ? 'default' : 'outline'}>
                    {goal.status === 'completed' ? 'Done' : 'Active'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Progress: {goal.progress}/{goal.target}
                  </span>
                  <span className="text-sm font-medium text-card-foreground">
                    {Math.round((goal.progress / goal.target) * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      goal.status === 'completed' ? 'bg-gradient-profit' : 'bg-gradient-primary'
                    }`}
                    style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Market Calendar */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Market Calendar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Economic Events */}
          <div className="p-4 bg-loss/10 rounded-lg border border-loss/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-loss" />
              <h4 className="font-semibold text-loss">Economic Events</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium text-card-foreground">Fed Meeting</p>
                <p className="text-muted-foreground">Feb 20, 2:00 PM</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">CPI Report</p>
                <p className="text-muted-foreground">Feb 13, 8:30 AM</p>
              </div>
            </div>
          </div>

          {/* Earnings Season */}
          <div className="p-4 bg-profit/10 rounded-lg border border-profit/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-profit" />
              <h4 className="font-semibold text-profit">Earnings</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium text-card-foreground">NVDA</p>
                <p className="text-muted-foreground">Feb 21, After close</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">TSLA</p>
                <p className="text-muted-foreground">Feb 22, After close</p>
              </div>
            </div>
          </div>

          {/* Crypto Events */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-primary">Crypto Events</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium text-card-foreground">BTC Halving</p>
                <p className="text-muted-foreground">Apr 2024 (Est.)</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">ETH Upgrade</p>
                <p className="text-muted-foreground">Q2 2024</p>
              </div>
            </div>
          </div>

          {/* Personal Reminders */}
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-accent-foreground" />
              <h4 className="font-semibold text-accent-foreground">Personal</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium text-card-foreground">Portfolio Review</p>
                <p className="text-muted-foreground">Every Sunday</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">Risk Assessment</p>
                <p className="text-muted-foreground">Monthly</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* This Week's Schedule */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">This Week's Schedule</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = addDays(startOfWeek(new Date()), i);
            const dayEvents = events.filter(event => 
              format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            );
            
            return (
              <div key={i} className="p-3 rounded-lg bg-muted/20 min-h-32">
                <div className="text-center mb-2">
                  <p className="text-xs text-muted-foreground">
                    {format(date, 'EEE')}
                  </p>
                  <p className="text-sm font-medium text-card-foreground">
                    {format(date, 'dd')}
                  </p>
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-primary/20 text-primary truncate"
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}