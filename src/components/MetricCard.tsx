import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "profit" | "loss" | "neutral";
  icon?: ReactNode;
  description?: string;
  className?: string;
  glowEffect?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
  className,
  glowEffect = false
}: MetricCardProps) {
  const changeColor = {
    profit: "text-profit",
    loss: "text-loss", 
    neutral: "text-neutral"
  }[changeType];

  const glowClass = {
    profit: "shadow-profit",
    loss: "shadow-loss",
    neutral: "shadow-glow"
  }[changeType];

  return (
    <Card className={cn(
      "glass-card p-6 transition-all duration-300 hover:scale-[1.02]",
      glowEffect && glowClass,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-mono font-bold text-card-foreground">
              {value}
            </p>
            {change && (
              <span className={cn("text-sm font-medium", changeColor)}>
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}