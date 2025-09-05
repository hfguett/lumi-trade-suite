import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Award, 
  CheckCircle2,
  Clock,
  DollarSign
} from "lucide-react";
import { MetricCard } from "./MetricCard";

interface Goal {
  id: string;
  title: string;
  type: "profit" | "winrate" | "trades" | "streak";
  target: number;
  current: number;
  deadline: Date;
  status: "active" | "completed" | "overdue";
  description: string;
}

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Monthly Profit Target",
    type: "profit",
    target: 2000,
    current: 1340,
    deadline: new Date(2024, 9, 31),
    status: "active",
    description: "Achieve $2,000 profit this month"
  },
  {
    id: "2", 
    title: "Improve Win Rate",
    type: "winrate",
    target: 70,
    current: 68.5,
    deadline: new Date(2024, 11, 31),
    status: "active",
    description: "Maintain 70% win rate over 3 months"
  },
  {
    id: "3",
    title: "Complete 100 Trades",
    type: "trades",
    target: 100,
    current: 87,
    deadline: new Date(2024, 10, 15),
    status: "active",
    description: "Execute 100 profitable trading opportunities"
  },
  {
    id: "4",
    title: "5-Trade Win Streak",
    type: "streak",
    target: 5,
    current: 5,
    deadline: new Date(2024, 8, 30),
    status: "completed",
    description: "Achieve 5 consecutive winning trades"
  }
];

const achievements = [
  { title: "First Profitable Month", date: "Jan 2024", icon: Award },
  { title: "10-Trade Win Streak", date: "Feb 2024", icon: TrendingUp },
  { title: "Risk Management Pro", date: "Mar 2024", icon: Target },
  { title: "Consistency Master", date: "Apr 2024", icon: CheckCircle2 },
];

export function GoalTracking() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'text-profit';
      case 'overdue': return 'text-loss';
      default: return 'text-primary';
    }
  };

  const getTypeIcon = (type: Goal['type']) => {
    switch (type) {
      case 'profit': return DollarSign;
      case 'winrate': return TrendingUp;
      case 'trades': return Target;
      case 'streak': return Award;
      default: return Target;
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const averageProgress = activeGoals.reduce((acc, goal) => acc + getProgressPercentage(goal), 0) / activeGoals.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">Goal Tracking</h2>
            <p className="text-sm text-muted-foreground">Set and track your trading objectives</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowAddGoal(true)}
          variant="hero"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Goals"
          value={activeGoals.length.toString()}
          icon={<Target className="w-5 h-5 text-primary" />}
          changeType="neutral"
        />
        
        <MetricCard
          title="Completed Goals"
          value={completedGoals.length.toString()}
          icon={<CheckCircle2 className="w-5 h-5 text-profit" />}
          changeType="profit"
        />
        
        <MetricCard
          title="Average Progress"
          value={`${averageProgress.toFixed(0)}%`}
          changeType={averageProgress >= 75 ? "profit" : averageProgress >= 50 ? "neutral" : "loss"}
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
        />
        
        <MetricCard
          title="Achievement Score"
          value="1,247"
          change="+89 this week"
          changeType="profit"
          icon={<Award className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Active Goals */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Active Goals</h3>
        <div className="space-y-6">
          {activeGoals.map((goal) => {
            const IconComponent = getTypeIcon(goal.type);
            const progress = getProgressPercentage(goal);
            const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal.id} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={goal.status === 'completed' ? 'default' : 'outline'} className="mb-1">
                      {goal.status === 'completed' ? 'Completed' : 
                       daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {goal.deadline.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="font-mono text-sm text-card-foreground">
                      {goal.type === 'profit' ? `$${goal.current.toLocaleString()}` : 
                       goal.type === 'winrate' ? `${goal.current}%` : 
                       goal.current.toString()}
                      {' / '}
                      {goal.type === 'profit' ? `$${goal.target.toLocaleString()}` : 
                       goal.type === 'winrate' ? `${goal.target}%` : 
                       goal.target.toString()}
                    </span>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      progress >= 100 ? 'text-profit' :
                      progress >= 75 ? 'text-primary' :
                      progress >= 50 ? 'text-neutral' : 'text-loss'
                    }`}>
                      {progress.toFixed(0)}% Complete
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, idx) => {
            const IconComponent = achievement.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-profit/10 border border-profit/20">
                <div className="p-2 bg-profit/20 rounded-lg">
                  <IconComponent className="w-5 h-5 text-profit" />
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weekly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">This Week's Focus</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-profit" />
                <span className="text-sm text-card-foreground">Complete 5 trades</span>
              </div>
              <Badge variant="default" className="bg-profit text-white">Done</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-card-foreground">Maintain 2% risk per trade</span>
              </div>
              <Badge variant="outline">In Progress</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-card-foreground">Journal all trades</span>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Goal Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Trending Up</h4>
              <p className="text-sm text-muted-foreground">
                Your win rate has improved 5% this month. Keep following your strategy!
              </p>
            </div>
            
            <div className="p-4 bg-loss/10 rounded-lg">
              <h4 className="font-semibold text-loss mb-2">Needs Attention</h4>
              <p className="text-sm text-muted-foreground">
                Risk per trade exceeded target twice this week. Review position sizing.
              </p>
            </div>
            
            <div className="p-4 bg-profit/10 rounded-lg">
              <h4 className="font-semibold text-profit mb-2">Achievement Ready</h4>
              <p className="text-sm text-muted-foreground">
                You're 87% towards your trade count goal. 13 more trades to complete!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}